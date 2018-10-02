import * as React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { routes } from '../../../../routes';
import { CommonProps } from '../../lib/CommonProps';

import penguinImage from './images/penguin.png';

interface Props extends CommonProps {
    teamIds: string[];
    currentTeamId?: string;
}

interface StyledLinkProps {
    active: number;
}

const HeaderTemplate: React.StatelessComponent<Props> = ({ className, currentTeamId, teamIds }) => {
    const linkTemplate = {
        name: 'команда №',
        path: routes.TEAM,
    };

    return (
        <Header className={className}>
            <Content>
                <Navigation>
                    {teamIds.map((id, index) => (
                        <NavigationItem key={index}>
                            <StyledLink
                                active={currentTeamId === id ? 1 : 0}
                                to={linkTemplate.path.pathWithParams({ id })}
                            >
                                {linkTemplate.name}
                                {id}
                            </StyledLink>
                        </NavigationItem>
                    ))}
                </Navigation>

                <Logo src={penguinImage} alt="logo" />
            </Content>
        </Header>
    );
};

const Header = styled.div`
    background-color: #f4f4f4;
`;

const Content = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: content-box;
    height: 90px;
    max-width: 1200px;
    padding: 0 30px;
    margin: 0 auto;
`;

const Navigation = styled.ul`
    margin: 0;
    padding: 0;
    list-style: none;
`;

const NavigationItem = styled.li`
    display: inline-block;
    margin-right: 20px;
`;

const Logo = styled.img`
    height: 70px;
`;

const StyledLink = styled(Link)`
    text-decoration: none;
    color: ${({ active }: StyledLinkProps) => (active ? '#345b98' : '#122c54')};
`;

export { HeaderTemplate };
