import * as React from 'react';
import styled from 'styled-components';
import { Link, LinkThemeName } from '../../../common/components/Link';
import { routes } from '../../../common/lib/routes';
import { CommonInnerProps, CommonProps } from '../../../common/types/CommonProps';

interface Props extends CurrentCommonProps {}

type CurrentCommonProps = CommonProps;
type CurrentInnerCommonProps = CommonInnerProps;

const RootPageTemplate: React.FC<Props> = ({ className }) => (
    <Root className={className}>
        <Header>{APP_NAME}</Header>
        <Link
            themeName={LinkThemeName.TEXT}
            to={routes.DEVELOPMENT.pathWithParams({
                name: 'Sir',
                id: '1',
                query: { querySingle: 'queryValue', queryArray: ['array'] },
            })}
        >
            Development
        </Link>{' '}
        <Link themeName={LinkThemeName.TEXT} to={routes.SHOWCASE.path}>
            Showcase
        </Link>
    </Root>
);

const Root = styled.div`
    min-height: 100%;
`;

const Header = styled.h1``;

export { RootPageTemplate, Props, CurrentCommonProps, CurrentInnerCommonProps };
