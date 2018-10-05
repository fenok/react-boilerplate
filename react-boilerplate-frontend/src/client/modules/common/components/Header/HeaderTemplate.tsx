import * as React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { getWidth, mediaWidth, Width } from '../../../../media';
import { routes } from '../../../../routes';
import { Media } from '../../../common/store/types';

import ArrowIcon from '../../icons/ArrowIcon.svg';
import { CommonProps } from '../../lib/CommonProps';

import penguinImage from './images/penguin.png';

interface Props extends CurrentCommonProps {
    teamIds: string[];
    currentTeamId?: string;
    openNavigation: boolean;
    onOpenerClick: React.MouseEventHandler<HTMLDivElement>;
    media: Media;
}

interface CurrentCommonProps extends CommonProps {}

interface StyledLinkProps {
    active: number;
}

const HeaderTemplate: React.StatelessComponent<Props> = ({
    className,
    currentTeamId,
    teamIds,
    onOpenerClick,
    openNavigation,
    media,
}) => (
    <Header className={className}>
        <Content>
            <NavigationWrapper>
                <Opener onClick={onOpenerClick}>
                    Список команд
                    <StyledArrowIcon />
                </Opener>

                {(getWidth(media.exactWidth) >= Width.M || openNavigation) && (
                    <Navigation>
                        {teamIds.map((id, index) => NavigationItemTemplate({ id, index }, currentTeamId))}
                    </Navigation>
                )}
            </NavigationWrapper>
            <Logo src={penguinImage} alt="logo" />
        </Content>
    </Header>
);

const NavigationItemTemplate = (item: { id: string; index: number }, currentTeamId?: string) => {
    const linkTemplate = {
        name: 'команда №',
        path: routes.TEAM,
    };

    return (
        <NavigationItem key={item.index}>
            <StyledLink
                active={currentTeamId === item.id ? 1 : 0}
                to={linkTemplate.path.pathWithParams({ id: item.id })}
            >
                {linkTemplate.name} {item.id}
            </StyledLink>
        </NavigationItem>
    );
};

const Header = styled.div`
    position: relative;
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

const NavigationWrapper = styled.div``;

const Navigation = styled.ul`
    position: absolute;
    left: 0;
    width: 100%;
    margin: 0;
    padding: 5px 30px 10px;
    background-color: #f4f4f4;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
    list-style: none;

    ${mediaWidth.m} {
        position: static;
        width: auto;
        padding: 0;
        background-color: transparent;
        box-shadow: none;
    }
`;

const NavigationItem = styled.li`
    line-height: 24px;

    ${mediaWidth.m} {
        display: inline-block;
        margin-right: 20px;
        border: none;
    }
`;

const Logo = styled.img`
    position: relative;
    height: 70px;
`;

const StyledLink = styled(Link)`
    text-decoration: none;
    color: ${({ active }: StyledLinkProps) => (active ? '#345b98' : '#122c54')};
`;

const Opener = styled.div`
    ${mediaWidth.m} {
        display: none;
    }
`;

const StyledArrowIcon = styled(ArrowIcon)`
    width: 15px;
    height: 20px;
    margin-left: 15px;
`;

export { HeaderTemplate, CurrentCommonProps };
