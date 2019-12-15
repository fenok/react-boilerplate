import * as React from 'react';
import { renderToString } from 'react-dom/server';
import { HelmetData } from 'react-helmet';
import { castError } from '../castError';

export interface HtmlProps {
    helmet?: HelmetData;
    styleTags?: string;
    spriteContent?: string;
    content?: string;
    ssrError?: Error;
    apolloState?: object;
    scriptElements?: React.ReactElement<{}>[];
}

export const Html: React.FC<HtmlProps> = ({
    helmet,
    styleTags,
    spriteContent,
    content,
    ssrError,
    apolloState,
    scriptElements,
}) => {
    return (
        // eslint-disable-next-line jsx-a11y/html-has-lang
        <html {...(helmet ? helmet.htmlAttributes.toComponent() : {})}>
            <head
                dangerouslySetInnerHTML={{
                    __html:
                        (helmet
                            ? helmet.base.toString() +
                              helmet.link.toString() +
                              helmet.meta.toString() +
                              helmet.noscript.toString() +
                              helmet.script.toString() +
                              helmet.style.toString() +
                              helmet.title.toString()
                            : '') + (styleTags || ''),
                }}
            />
            <body
                {...(helmet ? helmet.bodyAttributes.toComponent() : {})}
                dangerouslySetInnerHTML={{
                    __html: `${spriteContent || ''}${renderToString(
                        <>
                            {!content ? (
                                <noscript>
                                    {ssrError ? castError(ssrError).userDisplayedMessage : 'Enable JS in your browser'}
                                </noscript>
                            ) : null}
                            <div id="root" dangerouslySetInnerHTML={{ __html: content || '' }} />
                            <script
                                dangerouslySetInnerHTML={{
                                    __html: Object.entries({
                                        /** Config part */
                                        GRAPHQL_ENDPOINT: JSON.stringify(global.GRAPHQL_ENDPOINT),
                                        PUBLIC_PATH: JSON.stringify(global.PUBLIC_PATH),
                                        BASENAME: JSON.stringify(global.BASENAME),
                                        CANONICAL_ROBOTS_HOST: JSON.stringify(global.CANONICAL_ROBOTS_HOST),
                                        IS_OUTPUT_APP_INFO: JSON.stringify(global.IS_OUTPUT_APP_INFO),
                                        IS_SHOW_DEV_PAGES: JSON.stringify(global.IS_SHOW_DEV_PAGES),
                                        IS_DISABLE_SSR: JSON.stringify(global.IS_DISABLE_SSR),
                                        /** Dynamic server data part */
                                        APOLLO_STATE: JSON.stringify(apolloState),
                                        SSR_ERROR: JSON.stringify(ssrError, [
                                            ...Object.getOwnPropertyNames(ssrError || {}),
                                            'name',
                                        ]),
                                    })
                                        .map(([key, value]) => `window.${key}=${value};`)
                                        .join(''),
                                }}
                            />
                            {scriptElements}
                        </>,
                    )}`,
                }}
            />
        </html>
    );
};
