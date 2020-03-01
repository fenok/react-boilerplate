import { ApolloLink } from 'apollo-link';
import { Request, Response } from 'express';
import fetch from 'node-fetch';
import * as React from 'react';
import { getDataFromTree } from 'react-apollo';
import { renderToStaticMarkup, renderToString } from 'react-dom/server';
import Helmet from 'react-helmet';
import { ChunkExtractor } from '@loadable/server';
import { ServerStyleSheet } from 'styled-components';
import sprite from 'svg-sprite-loader/runtime/sprite.build';
import {getDataFromTree as getDataFromTreeFetch} from 'react-fetching-hooks';
import { IsomorphicApp } from './modules/common/components/IsomorphicApp';
import { StaticHelmet } from './modules/common/components/StaticHelmet';
import { IsomorphicApolloClient } from './modules/common/lib/IsomorphicApolloClient';
import { getIsomorphicFetchClient } from './modules/common/lib/IsomorphicFetchClient';
import { browserConfig, Html, HtmlProps, robots, webManifest } from './modules/common/lib/server-templates';

/** Incomplete */
interface StatsGroup {
    clientStats: Stats;
}

/** Incomplete */
interface Stats {
    assetsByChunkName: Record<string, string | string[]>;
    entrypoints: {
        main: {
            assets: string[];
            chunks: (number | string)[];
        };
    };
}

interface RouterContext {
    url?: string;
    statusCode?: number;
}

/** Exposing these files allow frontend-server to create them once in '/public' and send them as usual files from '/' */
export const publicFiles = {
    [WEB_MANIFEST_PATH]: { path: WEB_MANIFEST_PATH, content: webManifest, contentType: 'application/json' },
    [BROWSER_CONFIG_PATH]: { path: BROWSER_CONFIG_PATH, content: browserConfig, contentType: 'text/xml' },
    [ROBOTS_PATH]: { path: ROBOTS_PATH, content: robots, contentType: 'text/plain' },
};

/** Allows frontend-server to generate static HTML file and opt-out of SSR */
export function getStaticHtml(statsGroup: StatsGroup) {
    return getHtmlString(getFallbackHtml(statsGroup.clientStats));
}

// eslint-disable-next-line import/no-default-export
export default function serverRenderer(statsGroup: StatsGroup, link?: ApolloLink) {
    return (req: Request, res: Response) => {
        const publicFile = publicFiles[req.path];

        if (publicFile) {
            sendPublicFile(res, publicFile.content, publicFile.contentType);
        } else if (global.IS_DISABLE_SSR) {
            sendPublicFile(res, getStaticHtml(statsGroup), 'text/html');
        } else {
            sendHtmlOrRedirect(req, res, statsGroup.clientStats, link);
        }
    };
}

async function sendHtmlOrRedirect(req: Request, res: Response, stats: Stats, link?: ApolloLink) {
    const context: RouterContext = {};
    const client = IsomorphicApolloClient.getClient({ fetch, link, context });
    const fetchClient = getIsomorphicFetchClient({ fetch });
    const sheet = new ServerStyleSheet();
    const extractor = new ChunkExtractor({ stats, publicPath: global.PUBLIC_PATH });

    const App = React.createElement(IsomorphicApp, { client, fetchClient, context, location: req.url });

    try {
        // eslint-disable-next-line no-underscore-dangle
        if (req.query.__FAIL_SSR__ === undefined) {
            await getDataFromTree(App);
            console.log('START_AWAIT');
            await getDataFromTreeFetch(App);
            console.log('END_AWAIT')

            const content = renderToString(sheet.collectStyles(extractor.collectChunks(App)));

            if (context.url) {
                sendRedirect(res, context);
            } else {
                const html = React.createElement(Html, {
                    content,
                    helmet: Helmet.renderStatic(),
                    styleTags: sheet.getStyleTags(),
                    spriteContent: sprite.stringify(),
                    apolloState: client.extract(),
                    fetchState: fetchClient.extract(),
                    scriptElements: extractor.getScriptElements(),
                });

                sendHtml(res, html, context.statusCode);
            }
        } else {
            throw new Error('SSR was disabled by query parameter');
        }
    } catch (error) {
        const html = getFallbackHtml(stats, error);

        sendHtml(res, html, context.statusCode, true);
    }
}

function getFallbackHtml(stats: Stats, error?: Error) {
    try {
        renderToString(React.createElement(StaticHelmet));

        return React.createElement(Html, {
            helmet: Helmet.renderStatic(),
            scriptElements: getAllScriptElements(stats),
            ssrError: error,
        });
    } catch (innerError) {
        return React.createElement(Html, {
            scriptElements: getAllScriptElements(stats),
            ssrError: innerError,
        });
    }
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

    res.status(statusCode).send(getHtmlString(html));
}

function getHtmlString(html: React.ReactElement<HtmlProps>) {
    return `<!doctype html>\n${renderToStaticMarkup(html)}`;
}

function sendPublicFile(res: Response, content: string, contentType: string) {
    res.status(200)
        .header('Content-Type', contentType)
        .send(content);
}

function sendRedirect(res: Response, context: RouterContext) {
    res.status(context.statusCode || 301)
        .header('Location', context.url)
        .send();
}

function getAllScriptElements(stats: Stats) {
    const assetNames = Object.values(stats.assetsByChunkName);

    return stats.entrypoints.main.chunks
        .map(idOrName => (typeof idOrName === 'number' ? assetNames[idOrName] : stats.assetsByChunkName[idOrName]))
        .map(createScriptElement);
}

function createScriptElement(path: string | string[]) {
    return React.createElement('script', { src: `${global.PUBLIC_PATH}${getFirst(path)}` });
}

function getFirst(line: string | string[]) {
    return typeof line === 'string' ? line : line[0];
}
