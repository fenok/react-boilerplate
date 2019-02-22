import * as React from 'react';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import { CommonProps } from '../../types/CommonProps';
import { OpenGraph } from '../OpenGraph';
import { Status } from '../Status';

interface Props extends CommonProps {
    statusCode?: number;
    documentTitle?: string;
    documentDescription?: string;
    ogTitle?: string;
    ogType?: string;
    ogImage?: string;
    ogUrl?: string;
    ogDescription?: string;
    ogLocale?: string;
}

const PageTemplate: React.FC<Props> = ({
    className,
    statusCode,
    children,
    documentTitle,
    documentDescription,
    ogTitle,
    ogType,
    ogImage,
    ogUrl,
    ogDescription,
    ogLocale,
}) => (
    <Root className={className}>
        <Status code={statusCode || 200}>
            <Helmet>
                <title>{documentTitle || APP_NAME}</title>
                <meta name="description" content={documentDescription || APP_DESCRIPTION} />
            </Helmet>
            <OpenGraph
                title={ogTitle || documentTitle || APP_NAME}
                type={ogType}
                image={ogImage}
                url={ogUrl}
                description={ogDescription || documentDescription || APP_DESCRIPTION}
                locale={ogLocale}
            />
            {children}
        </Status>
    </Root>
);

const Root = styled.div`
    min-height: 100%;
`;

export { PageTemplate, Props };
