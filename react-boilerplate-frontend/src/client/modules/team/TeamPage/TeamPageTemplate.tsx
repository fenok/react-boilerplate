import * as React from 'react';
import styled from 'styled-components';

import { mediaWidth } from '../../../media';

import { CommonProps } from '../../common/lib/CommonProps';

import { Header } from '../../common/components/Header';

interface CurrentCommnProps extends CommonProps {}

interface Props extends CurrentCommnProps {
    teamId: string;
}

const TeamPageTemplate: React.StatelessComponent<Props> = ({ className, teamId }) => (
    <Page className={className}>
        <Header />
        <Content>Страница команды №{teamId}</Content>
    </Page>
);

const Page = styled.div``;
const Content = styled.div`
    display: flex;
    height: 300px;
    align-items: center;
    justify-content: center;
    font-size: 17px;

    ${mediaWidth.m} {
        height: 500px;
        font-size: 30px;
    }
`;

export { TeamPageTemplate, CurrentCommnProps };
