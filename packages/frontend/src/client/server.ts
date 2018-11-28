import { ApolloLink } from 'apollo-link';
import { Request, Response } from 'express';
import { filter, uniq } from 'lodash';
import fetch from 'node-fetch';
import * as React from 'react';
import { getDataFromTree } from 'react-apollo';
import { renderToStaticMarkup, renderToString } from 'react-dom/server';
import Helmet from 'react-helmet';
import { getBundles } from 'react-loadable/webpack';
import { ServerStyleSheet } from 'styled-components';
import sprite from 'svg-sprite-loader/runtime/sprite.build';
import { config } from '../../config';
import './isomorphic-globals-init';
import { IsomorphicApp } from './modules/common/components/IsomorphicApp';
import { IsomorphicApolloClient } from './modules/common/lib/IsomorphicApolloClient';
import { IsomorphicStore } from './modules/common/lib/IsomorphicStore';
import { browserConfig, Html, HtmlProps, webManifest } from './modules/common/lib/server-templates';

/** Incomplete */
interface WebpackHotServerMiddlewareStats {
    clientStats: {
        publicPath: string | null;
        chunks: {
            files: string[];
            modules: {
                id: number;
                name: string;
                reasons: {
                    userRequest: string;
                }[];
            }[];
        }[];
    };
}

type ReactLoadableStats = FirstArgument<typeof getBundles>;

interface FrontendServerStats {
    reactLoadableStats: ReactLoadableStats;
}

interface RouterContext {
    url?: string;
    statusCode?: number;
}

export default function serverRenderer(
    stats: WebpackHotServerMiddlewareStats | FrontendServerStats,
    link?: ApolloLink,
) {
    return (req: Request, res: Response) => {
        if (req.path === WEB_MANIFEST_PATH) {
            sendWebManifest(res);
        } else if (req.path === BROWSER_CONFIG_PATH) {
            sendBrowserConfig(res);
        } else {
            sendHtmlOrRedirect(req, res, getReactLoadableStats(stats), link);
        }
    };
}

function sendHtmlOrRedirect(req: Request, res: Response, reactLoadableStats: ReactLoadableStats, link?: ApolloLink) {
    const client = IsomorphicApolloClient.getClient({ fetch, link });
    const store = IsomorphicStore.getStore();
    const context: RouterContext = {};
    const sheet = new ServerStyleSheet();
    const modules: string[] = [];

    const App = React.createElement(IsomorphicApp, { client, store, modules, context, location: req.url });

    getDataFromTree(App)
        .then(() => {
            const content = renderToString(sheet.collectStyles(App));

            if (context.url) {
                sendRedirect(res, context);
            } else {
                const html = React.createElement(Html, {
                    content,
                    config,
                    helmet: Helmet.renderStatic(),
                    styleTags: sheet.getStyleTags(),
                    spriteContent: sprite.stringify(),
                    apolloState: client.extract(),
                    reduxState: store.getState(),
                    bundles: getNormalizedBundles(reactLoadableStats, modules),
                });

                sendHtml(res, html, context.statusCode);
            }
        })
        .catch((error: Error) => {
            const html = React.createElement(Html, {
                config,
                ssrError: error,
            });

            sendHtml(res, html, context.statusCode, true);
        });
}

function sendHtml(res: Response, html: React.ReactElement<HtmlProps>, appStatus?: number, isSsrError?: boolean) {
    let statusCode = appStatus;

    if (statusCode === undefined) {
        // No status provided by app, using fallback error or success
        statusCode = isSsrError ? 500 : 200;
    } else if (statusCode === 0 || (statusCode === 200 && isSsrError)) {
        // Sending HTML with status 0 makes no sense, using fallback error
        // Sending HTML with status 200 after SSR error makes no sense, using fallback error
        statusCode = 500;
    }

    res.status(statusCode).send(`<!doctype html>\n${renderToStaticMarkup(html)}`);
}

function sendWebManifest(res: Response) {
    res.status(200)
        .header('Content-Type', 'application/manifest+json')
        .send(JSON.stringify(webManifest));
}

function sendBrowserConfig(res: Response) {
    res.status(200)
        .header('Content-Type', 'application/xml')
        .send(browserConfig);
}

function sendRedirect(res: Response, context: RouterContext) {
    res.status(301)
        .header('Location', context.url)
        .send();
}

function getNormalizedBundles(reactLoadableStats: ReactLoadableStats, modules: string[]) {
    return filter(getBundles(reactLoadableStats, uniq(modules)), bundle => !bundle.file.includes('.js.map'));
}

function getReactLoadableStats(stats: WebpackHotServerMiddlewareStats | FrontendServerStats): ReactLoadableStats {
    let reactLoadableStats: ReactLoadableStats;
    if (!isWebpackHotServerMiddlewareStats(stats)) {
        reactLoadableStats = stats.reactLoadableStats;
    } else {
        reactLoadableStats = convertWebpackHotServerMiddlewareStatsToReactLoadableStats(stats);
    }

    return reactLoadableStats;
}

function isWebpackHotServerMiddlewareStats(
    stats: WebpackHotServerMiddlewareStats | FrontendServerStats,
): stats is WebpackHotServerMiddlewareStats {
    return (stats as WebpackHotServerMiddlewareStats).clientStats !== undefined;
}

function convertWebpackHotServerMiddlewareStatsToReactLoadableStats(
    stats: WebpackHotServerMiddlewareStats,
): ReactLoadableStats {
    const manifest: ReactLoadableStats = {};

    stats.clientStats.chunks.forEach(chunk => {
        chunk.files.forEach(file => {
            chunk.modules.forEach(module => {
                const request = module.reasons[0].userRequest;
                if (!manifest[request]) {
                    manifest[request] = [];
                }

                manifest[request].push({
                    file,
                    id: module.id,
                    name: module.name,
                });
            });
        });
    });

    return manifest;
}