import { useEffect } from 'react';
import { QueryResult } from 'react-apollo';
import { IsomorphicStore } from '../../../../common/lib/IsomorphicStore';
import { onMessageAdd } from '../../../../common/store/actions';

export function useApolloErrorReporter(queryResult: QueryResult<any>) {
    useEffect(
        () => {
            if (queryResult.error) {
                IsomorphicStore.getStore().dispatch(onMessageAdd(queryResult.error));
            }
        },
        [queryResult.error],
    );
}
