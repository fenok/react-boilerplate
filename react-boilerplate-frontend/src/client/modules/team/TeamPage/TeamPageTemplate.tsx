import * as React from 'react';
import styled from 'styled-components';

import { CommonProps } from '../../common/lib/CommonProps';

import { Header } from '../../common/components/Header';

interface Props extends CommonProps {
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
    height: 500px;
    align-items: center;
    justify-content: center;
    font-size: 30px;
`;

export { TeamPageTemplate, Props as TeamPageTemplateProps };
