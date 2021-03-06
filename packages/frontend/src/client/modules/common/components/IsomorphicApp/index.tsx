import loadable from '@loadable/component';
import { NormalizedCacheObject } from 'apollo-cache-inmemory';
import ApolloClient from 'apollo-client/ApolloClient';
import * as React from 'react';
import { ApolloProvider } from 'react-apollo';
import { hot } from 'react-hot-loader/root';
import { Route, Switch } from 'react-router';
import { GlobalFontsStyle } from '../../lib/fonts';
import { RouteData } from '../../lib/routes';
import { routesWithComponents } from '../../lib/routes/routesWithComponents';
import { AppStateProvider } from '../AppStateProvider';
import { OpenGraph } from '../OpenGraph';
import { StaticHelmet } from '../StaticHelmet';
import { ExternalAndGlobalStyles } from './ExternalAndGlobalStyles';
import { FontFamiliesObserver } from './FontFamiliesObserver';
import { IsomorphicRouter } from './IsomorphicRouter';
import { Notificator } from './Notificator';
import { RootErrorBoundary } from './RootErrorBoundary';
import { ScrollToTop } from './ScrollToTop';
import { SsrErrorReporter } from './SsrErrorReporter';

const AppInfoLogger = loadable(() => import(/* webpackChunkName: "info-logger" */ './AppInfoLogger'));

/** Import global scripts here (such as external-and-global-styles) */

export interface IsomorphicAppProps {
    client: ApolloClient<NormalizedCacheObject>;
    location?: string;
    context?: object;
}

export const IsomorphicApp = hot(({ client, location, context }: IsomorphicAppProps) => {
    return (
        <ApolloProvider client={client}>
            <RootErrorBoundary>
                <AppStateProvider>
                    <>
                        <StaticHelmet />
                        <GlobalFontsStyle />
                        <ExternalAndGlobalStyles />
                        <IsomorphicRouter location={location} context={context} basename={global.BASENAME}>
                            <>
                                <OpenGraph />
                                <ScrollToTop>
                                    <Switch>
                                        {Object.entries<RouteData<any, {}, string>>(
                                            routesWithComponents,
                                        ).map(([name, route]) =>
                                            global.IS_SHOW_DEV_PAGES || !route.isDev ? (
                                                <Route key={name} {...route} />
                                            ) : null,
                                        )}
                                    </Switch>
                                </ScrollToTop>
                            </>
                        </IsomorphicRouter>
                        <FontFamiliesObserver />
                        <SsrErrorReporter />
                        <Notificator />
                        {global.IS_OUTPUT_APP_INFO ? <AppInfoLogger /> : null}
                    </>
                </AppStateProvider>
            </RootErrorBoundary>
        </ApolloProvider>
    );
});
