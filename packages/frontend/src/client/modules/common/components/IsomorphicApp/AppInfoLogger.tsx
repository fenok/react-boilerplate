import React from 'react';

const AppInfoLogger: React.FC = () => {
    React.useEffect(() => {
        logAppInfo();
    }, []);

    return null;
};

export function logAppInfo() {
    if (!SSR_MODE) {
        console.groupCollapsed('App info');

        console.info(
            `SSR_ERROR:         %c${global.SSR_ERROR ? global.SSR_ERROR.message : 'No error'}
%cBUILD_TIME:        ${new Date(BUILD_TIMESTAMP).toLocaleString()}
GRAPHQL_ENDPOINT:  ${global.GRAPHQL_ENDPOINT}
IS_SHOW_DEV_PAGES: ${global.IS_SHOW_DEV_PAGES}
IS_DISABLE_SSR:    ${global.IS_DISABLE_SSR}`,
            global.SSR_ERROR ? 'color: red;' : 'color: green',
            '',
        );

        console.warn('SSR can be prevented by passing __FAIL_SSR__ in query parameters');

        console.groupEnd();
    }
}

export { AppInfoLogger };

// eslint-disable-next-line import/no-default-export
export default AppInfoLogger;
