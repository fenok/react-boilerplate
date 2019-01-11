import React, { FC } from 'react';
import { Route } from 'react-router';
import { CommonProps } from '../../types/CommonProps';

interface Props extends CommonProps {
    code: number;
}

const StatusTemplate: FC<Props> = ({ code, children }) => (
    <Route
        render={({ staticContext }) => {
            if (staticContext) staticContext.statusCode = code;
            return children;
        }}
    />
);

export { StatusTemplate, Props };
