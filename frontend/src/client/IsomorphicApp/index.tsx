import { NormalizedCacheObject } from 'apollo-cache-inmemory';
import ApolloClient from 'apollo-client/ApolloClient';
import * as React from 'react';
import { ApolloProvider } from 'react-apollo';
import Helmet from 'react-helmet';
import { Provider } from 'react-redux';
import { Route, Switch } from 'react-router';
import { Store } from 'redux';
import appleTouchIcon from '../favicon/apple-touch-icon.png';
import favicon16x16 from '../favicon/favicon-16x16.png';
import favicon32x32 from '../favicon/favicon-32x32.png';
import favicon from '../favicon/favicon.ico';
import safariPinnedTab from '../favicon/safari-pinned-tab.svg';
import { StoreState } from '../IsomorphicStore';
import { routes } from '../routes';
/** Just to generate files */
import '../server-templates';
import './external-and-global-styles';
import { hot } from './isomorphicHot';
import { IsomorphicRouter } from './IsomorphicRouter';

// Import global scripts here (such as external-and-global-styles)

export interface IsomorphicAppProps {
    client: ApolloClient<NormalizedCacheObject>;
    store: Store<StoreState>;
    location?: string;
    context?: object;
}

@hot(module)
export class IsomorphicApp extends React.Component<IsomorphicAppProps> {
    render() {
        return (
            <ApolloProvider client={this.props.client}>
                <Provider store={this.props.store}>
                    <React.Fragment>
                        <Helmet>
                            <html lang="ru" />
                            <meta charSet="utf-8" />
                            <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
                            <meta name="mobile-web-app-capable" content="yes" />
                            <meta name="apple-mobile-web-app-capable" content="yes" />

                            <link rel="apple-touch-icon" sizes="180x180" href={appleTouchIcon} />
                            <link rel="icon" type="image/png" sizes="32x32" href={favicon32x32} />
                            <link rel="icon" type="image/png" sizes="16x16" href={favicon16x16} />
                            <link rel="mask-icon" href={safariPinnedTab} color="#5bbad5" />
                            <link rel="shortcut icon" href={favicon} />
                            <meta name="apple-mobile-web-app-title" content="React Boilerplate" />
                            <meta name="application-name" content="React Boilerplate" />
                            <meta name="msapplication-TileColor" content="#da532c" />
                            <meta name="theme-color" content="#ffffff" />

                            <link rel="manifest" href={`${WEB_MANIFEST_PATH}?${BUILD_TIMESTAMP}`} />
                            <meta name="msapplication-config" content={`${BROWSER_CONFIG_PATH}?${BUILD_TIMESTAMP}`} />

                            <title>React Boilerplate</title>
                        </Helmet>
                        <IsomorphicRouter location={this.props.location} context={this.props.context}>
                            <Switch>
                                {Object.values(routes).map(route => (
                                    <Route key={route.name} {...route} />
                                ))}
                            </Switch>
                        </IsomorphicRouter>
                    </React.Fragment>
                </Provider>
            </ApolloProvider>
        );
    }
}
