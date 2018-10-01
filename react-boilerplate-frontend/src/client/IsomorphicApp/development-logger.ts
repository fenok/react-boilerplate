if (process.env.NODE_ENV === 'development' && !SSR_MODE) {
    /* tslint:disable-next-line no-console */
    console.log(`SSR_ERROR: ${global.SSR_ERROR ? global.SSR_ERROR.message : 'none'}
BUILD_TIME: ${new Date(BUILD_TIMESTAMP).toLocaleString()}
GRAPHQL_ENDPOINT: ${GRAPHQL_ENDPOINT}`);
}