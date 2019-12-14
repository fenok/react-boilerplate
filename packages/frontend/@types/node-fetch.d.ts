/** Official types don't match GlobalFetch['fetch'], as they should by documentation */
declare module 'node-fetch' {
    const nodeFetch: typeof fetch;
    // eslint-disable-next-line import/no-default-export
    export default nodeFetch;
}
