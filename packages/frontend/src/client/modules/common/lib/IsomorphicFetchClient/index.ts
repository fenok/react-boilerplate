import {Client, Cache, ClientOptions, getIdUrl, getUrlDefault, processResponseRestfulJson, mergeShallow} from 'react-fetching-hooks';

let CLIENT_INSTANCE: Client;

export function getIsomorphicFetchClient({fetch}: Partial<ClientOptions> = {}) {
    if(SSR_MODE) {
        return createClient({fetch});
    }

    if(CLIENT_INSTANCE) {
        return CLIENT_INSTANCE;
    }

    // eslint-disable-next-line no-return-assign
    return CLIENT_INSTANCE = createClient({fetch});
}

function createClient({fetch}: Partial<ClientOptions>) {
    return new Client({
        cache: new Cache(!SSR_MODE ? global.FETCH_STATE : undefined),
        fetch,
        generalRequestData: {
            root: 'http://localhost:3001',
            fetchPolicy: 'cache-and-network',
            getId: getIdUrl,
            getUrl: getUrlDefault,
            merge: mergeShallow,
            processResponse: processResponseRestfulJson
        }
    })
}
