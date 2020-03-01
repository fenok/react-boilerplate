import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { loadableReady } from '@loadable/component';
import { IsomorphicApp } from './modules/common/components/IsomorphicApp';
import { IsomorphicApolloClient } from './modules/common/lib/IsomorphicApolloClient';
import { getIsomorphicFetchClient } from './modules/common/lib/IsomorphicFetchClient';

async function renderApp(element: HTMLElement) {
    const isHydrate = element.innerHTML !== '';

    const reactHydrateOrRender = isHydrate ? ReactDOM.hydrate : ReactDOM.render;
    if (isHydrate) {
        await loadableReady();
    }

    reactHydrateOrRender(
        React.createElement(IsomorphicApp, {
            client: IsomorphicApolloClient.getClient(),
            fetchClient: getIsomorphicFetchClient(),
        }),
        element,
    );
}

const element = document.getElementById('root');
if (element) {
    renderApp(element);
} else {
    throw new Error('No element to render');
}
