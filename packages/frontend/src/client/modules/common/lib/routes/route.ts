import pathToRegexp from 'path-to-regexp';
import queryString from 'query-string';
import { RouteProps } from 'react-router';

type PathPart<PATH extends string = never> = { [key in PATH]: string };
type PathPartOptional<PATH extends string = never> = { [key in PATH]?: string };
type QueryPart<QUERY extends string = never> = { [key in QUERY]?: string };
type QueryArrayPart<QUERY extends string = never> = { [key in QUERY]?: string[] };

type PathData<
    PATH extends string = never,
    PATH_OPTIONAL extends string = never,
    QUERY extends string = never,
    QUERY_ARRAY extends string = never,
    HASH extends string = never
> = PathPart<PATH> &
    PathPartOptional<PATH_OPTIONAL> & {
        query?: QueryPart<QUERY> & QueryArrayPart<QUERY_ARRAY>;
    } & {
        hash?: HASH;
    };

interface PathWithParams<
    PATH extends string = never,
    PATH_OPTIONAL extends string = never,
    QUERY extends string = never,
    QUERY_ARRAY extends string = never,
    HASH extends string = never
> {
    (params: PathData<PATH, PATH_OPTIONAL, QUERY, QUERY_ARRAY, HASH>): string;
}

function getPathWithParams<
    PATH extends string = never,
    PATH_OPTIONAL extends string = never,
    QUERY extends string = never,
    QUERY_ARRAY extends string = never,
    HASH extends string = never
>(path: string): PathWithParams<PATH, PATH_OPTIONAL, QUERY, QUERY_ARRAY, HASH> {
    return params => {
        return `${pathToRegexp.compile(path)(params)}${
            params.query && Object.values(params.query).length
                ? `?${queryString.stringify(params.query, { arrayFormat: 'bracket' })}`
                : ''
        }${params.hash ? (params.hash[0] === '#' ? params.hash : `#${params.hash}`) : ''}`;
    };
}

function route<
    PATH extends string = never,
    PATH_OPTIONAL extends string = never,
    QUERY extends string = never,
    QUERY_ARRAY extends string = never,
    HASH extends string = never
>(routeData: RouteProps & { path: string }) {
    return {
        ...routeData,
        pathWithParams: getPathWithParams<PATH, PATH_OPTIONAL, QUERY, QUERY_ARRAY, HASH>(routeData.path),
    };
}

export { route };
