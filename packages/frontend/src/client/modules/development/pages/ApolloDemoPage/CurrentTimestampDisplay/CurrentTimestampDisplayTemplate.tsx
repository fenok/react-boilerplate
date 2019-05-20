import * as React from 'react';
import { QueryResult } from 'react-apollo';
import styled from 'styled-components';
import { Button, ButtonThemeName } from '../../../../common/components/Button';
import { ServerError } from '../../../../common/graphql/ApolloTypes/globalTypes';
import { castError } from '../../../../common/lib/castError';
import { includesOnly, useApolloErrorReporter } from '../../../../common/lib/react-hooks/useApolloErrorReporter';
import { CommonProps } from '../../../../common/types/CommonProps';
import { CurrentTimestamp, CurrentTimestampVariables } from './ApolloTypes/CurrentTimestamp';

interface Props extends CommonProps {
    currentTimestampQueryResult: QueryResult<Partial<CurrentTimestamp>, CurrentTimestampVariables>;
}

const KNOWN_ERROR_LIST = [ServerError.TEST_ERROR];

const CurrentTimestampDisplayTemplate: React.FC<Props> = ({ className, currentTimestampQueryResult }) => {
    useApolloErrorReporter(currentTimestampQueryResult, { ignore: KNOWN_ERROR_LIST });

    const { data: currentTimestampData = {} } = currentTimestampQueryResult;

    const onRefetchClick = React.useCallback(() => {
        currentTimestampQueryResult.refetch({ ...currentTimestampQueryResult.variables, returnError: undefined });
    }, [currentTimestampQueryResult]);

    const onRefetchWithErrorClick = React.useCallback(() => {
        currentTimestampQueryResult.refetch({
            ...currentTimestampQueryResult.variables,
            returnError: ServerError.TEST_ERROR,
        });
    }, [currentTimestampQueryResult]);

    const onRefetchWithUnknownErrorClick = React.useCallback(() => {
        currentTimestampQueryResult.refetch({
            ...currentTimestampQueryResult.variables,
            returnError: ServerError.INTERNAL_SERVER_ERROR,
        });
    }, [currentTimestampQueryResult]);

    return (
        <Root className={className}>
            <DataDisplay>
                Data: {currentTimestampData.development ? currentTimestampData.development.currentTimestamp : 'No data'}
            </DataDisplay>
            <LoadingDisplay>Loading: {String(currentTimestampQueryResult.loading)}</LoadingDisplay>
            <ErrorDisplay>
                Error: {/* eslint-disable-next-line no-nested-ternary */}
                {currentTimestampQueryResult.error
                    ? includesOnly(currentTimestampQueryResult.error, KNOWN_ERROR_LIST)
                        ? castError(currentTimestampQueryResult.error).userDisplayedMessage
                        : 'Unknown error'
                    : 'No error'}
            </ErrorDisplay>
            <Button themeName={ButtonThemeName.PRIMARY} onClick={onRefetchClick}>
                Refetch
            </Button>
            <Button themeName={ButtonThemeName.PRIMARY} onClick={onRefetchWithErrorClick}>
                Refetch with known error
            </Button>
            <Button themeName={ButtonThemeName.PRIMARY} onClick={onRefetchWithUnknownErrorClick}>
                Refetch with unknown error
            </Button>
        </Root>
    );
};

const Root = styled.div``;

const DataDisplay = styled.div``;

const LoadingDisplay = styled.div``;

const ErrorDisplay = styled.div``;

export { CurrentTimestampDisplayTemplate, Props };
