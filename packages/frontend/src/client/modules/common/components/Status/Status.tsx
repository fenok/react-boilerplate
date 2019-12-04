import React, { FC } from 'react';
import { Route } from 'react-router';
import { CommonProps } from '../../types/CommonProps';

interface Props extends CommonProps {
    code?: number;
}

const Status: FC<Props> = ({ code, children }) => (
    <Route
        render={({ staticContext }) => {
            // eslint-disable-next-line no-param-reassign
            if (staticContext && code) staticContext.statusCode = code;
            return children;
        }}
    />
);

export { Status, Props };
