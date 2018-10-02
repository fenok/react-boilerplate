import * as React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { routes } from '../../../../routes';
import { CommonInnerProps, CommonProps } from '../../../common/lib/CommonProps';

import { Header } from '../../../common/components/Header';

interface Props extends CurrentCommonProps {}

type CurrentCommonProps = CommonProps;
type CurrentInnerCommonProps = CommonInnerProps;

const RootPageTemplate: React.StatelessComponent<Props> = ({ className }) => (
    <Root className={className}>
        <Header />
        <Link to={routes.DEVELOPMENT.pathWithParams({ name: 'Sir', id: '1', query: { queryFirst: 'queryValue' } })}>
            Development
        </Link>
    </Root>
);

const Root = styled.div``;

export { RootPageTemplate, Props, CurrentCommonProps, CurrentInnerCommonProps };
