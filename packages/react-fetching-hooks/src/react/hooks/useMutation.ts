import * as React from 'react';
import { MultiAbortController } from '../../core/promise';
import { BC, PPC, QPC, RC, SDC } from '../../core/request/types';
import { ClientContext } from '../Provider';
import { PartialRequestData } from '../../core/request';
import { ensureClient } from './ensureClient';
import { getRequestId } from './getRequestId';
import { useComponentId } from './useComponentId';

interface MutationOptions<C extends SDC = any, R extends RC = any, P extends PPC = any, Q extends QPC = any, B extends BC = any> {
    getPartialRequestId?(request: PartialRequestData<C, R, P, Q, B>): string | number;
}

export function useMutation<C extends SDC = any, R extends RC = any, P extends PPC = any, Q extends QPC = any, B extends BC = any>(request: PartialRequestData<C, R, P, Q, B>, {getPartialRequestId} : MutationOptions = {}) {
    const componentId = useComponentId();
    const client = React.useContext(ClientContext);
    const multiAbortControllerRef = React.useRef<MultiAbortController>();

    ensureClient(client);

    const requestId = getRequestId(request, client, getPartialRequestId);

    const mutate = React.useCallback(() => {
        multiAbortControllerRef.current?.abort();
        multiAbortControllerRef.current = new MultiAbortController();

        return client.mutate(request, {multiAbortSignal: multiAbortControllerRef.current?.signal, callerId: componentId});
    }, [client, requestId]);

    const abort = React.useCallback(() => {
        if(multiAbortControllerRef.current) {
            multiAbortControllerRef.current.abort();
        }
    }, []);

    return {mutate, abort};
}
