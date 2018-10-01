import { NormalizedCacheObject } from 'apollo-cache-inmemory';
import ApolloClient from 'apollo-client/ApolloClient';
import * as React from 'react';
import { ApolloProvider } from 'react-apollo';
import { Provider } from 'react-redux';
import { Route, Switch } from 'react-router';
import { Store } from 'redux';
import { observeFontFamilies } from '../fonts';
import { StoreState } from '../IsomorphicStore';
import { observeResize } from '../media';
import { routes } from '../routes';
/** Log useful information (development only) */
import './development-logger.ts';
/** Inject external and global styles */
import './external-and-global-styles';
import { InitialHelmet } from './InitialHelmet';
import { isomorphicHot } from './isomorphicHot';
import { IsomorphicLoadableCapture } from './IsomorphicLoadableCapture';
import { IsomorphicRouter } from './IsomorphicRouter';
import { RootErrorBoundary } from './RootErrorBoundary';
import { ScrollToTop } from './ScrollToTop';

/** Import global scripts here (such as external-and-global-styles) */

export interface IsomorphicAppProps {
    client: ApolloClient<NormalizedCacheObject>;
    store: Store<StoreState>;
    modules?: string[];
    location?: string;
    context?: object;
}

@isomorphicHot(module)
export class IsomorphicApp extends React.Component<IsomorphicAppProps> {
    componentDidMount() {
        // These functions must be called client-side only and immediately
        observeFontFamilies();
        observeResize();
    }

    render() {
        return (
            <IsomorphicLoadableCapture modules={this.props.modules}>
                <ApolloProvider client={this.props.client}>
                    <Provider store={this.props.store}>
                        <RootErrorBoundary>
                            <React.Fragment>
                                <InitialHelmet />
                                <IsomorphicRouter location={this.props.location} context={this.props.context}>
                                    <ScrollToTop>
                                        <Switch>
                                            {Object.values(routes).map(route => (
                                                <Route key={route.name} {...route} />
                                            ))}
                                        </Switch>
                                    </ScrollToTop>
                                </IsomorphicRouter>
                            </React.Fragment>
                        </RootErrorBoundary>
                    </Provider>
                </ApolloProvider>
            </IsomorphicLoadableCapture>
        );
    }
}