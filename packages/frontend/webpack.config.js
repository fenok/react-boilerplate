const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');
const TimeFixPlugin = require('time-fix-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const UnusedWebpackPlugin = require('unused-webpack-plugin');
const FilterWarningsPlugin = require('webpack-filter-warnings-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const MomentLocalesPlugin = require('moment-locales-webpack-plugin');
const LoadablePlugin = require('@loadable/webpack-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const OperationRegistryPlugin = require('./tools/webpack/plugins/OperationRegistryPlugin');
const packageJson = require('./package');

/** These paths are handled by frontend server, so they must be relative */
const WEB_MANIFEST_PATH = '/manifest.json';
const BROWSER_CONFIG_PATH = '/browserconfig.xml';
const ROBOTS_PATH = '/robots.txt';

/** Name and describe the project here */
const APP_NAME = 'React Boilerplate';
const APP_SHORT_NAME = 'R.B.';
const APP_DESCRIPTION = 'React Boilerplate of c7s';

function commonLoaders(ssrMode, env) {
    const babelLoaderOptions = {
        cacheDirectory: true,
        presets: [
            [
                '@babel/env',
                {
                    modules: false,
                    targets: ssrMode
                        ? {
                              node: packageJson.engines.node,
                          }
                        : packageJson.browserslist,
                    useBuiltIns: 'entry',
                    corejs: packageJson.devDependencies['core-js'].split('.')[0],
                },
            ],
        ],
    };

    return [
        {
            test: /\.[tj]sx?$/,
            loader: 'babel-loader',
            options: babelLoaderOptions,
            exclude: /node_modules[\\/](?!(query-string|strict-uri-encode|split-on-first))/,
        },
        {
            test: /\.css$/,
            loaders: ['to-string-loader', 'css-loader'],
        },
        {
            test: /favicon[\\/][^\\/]+\.(png|ico|svg)$/,
            loader: `file-loader`,
            options: {
                name: 'favicon/[name].[hash].[ext]',
                context: './src/client',
                emitFile: !ssrMode,
            },
        },
        {
            test: /[\\/][a-z][A-Za-z0-9]*Image\.(jpg|jpeg|png)$/,
            loaders: [
                {
                    loader: `file-loader`,
                    options: {
                        name: 'images/[name].[hash].[ext]',
                        context: './src/client',
                        emitFile: !ssrMode,
                    },
                },
                {
                    loader: 'image-webpack-loader',
                    options: {
                        disable: !env.build,
                    },
                },
            ],
        },
        {
            test: /[\\/][A-Z][A-Za-z0-9]*Icon\.svg$/,
            loaders: [
                {
                    loader: 'babel-loader',
                    options: babelLoaderOptions,
                },
                {
                    loader: 'svg-sprite-loader',
                    options: {
                        runtimeGenerator: require.resolve('./tools/svg-to-icon-component'),
                        symbolId: '[name]_[hash]',
                    },
                },
            ],
        },
        {
            test: /\.(eot|ttf|otf|woff|woff2)$/,
            loader: `file-loader`,
            options: {
                name: 'fonts/[name].[hash].[ext]',
                context: './src/client',
                emitFile: !ssrMode,
            },
        },
    ];
}

const commonConfig = env => ({
    mode: !env.build ? 'development' : 'production',
    devtool: !env.build && 'cheap-module-source-map',
    plugins: [
        !env.build && new webpack.HotModuleReplacementPlugin(),
        // https://github.com/webpack/webpack-dev-middleware#multiple-successive-builds
        new TimeFixPlugin(),
        // TODO: sort out issue with iconv-loader
        new webpack.NormalModuleReplacementPlugin(/\/iconv-loader$/, 'node-noop'),
        new webpack.DefinePlugin({
            APP_NAME: JSON.stringify(APP_NAME),
            APP_SHORT_NAME: JSON.stringify(APP_SHORT_NAME),
            APP_DESCRIPTION: JSON.stringify(APP_DESCRIPTION),
            WEB_MANIFEST_PATH: JSON.stringify(WEB_MANIFEST_PATH),
            BROWSER_CONFIG_PATH: JSON.stringify(BROWSER_CONFIG_PATH),
            ROBOTS_PATH: JSON.stringify(ROBOTS_PATH),
            BUILD_TIMESTAMP: Date.now(),
        }),
        new CleanWebpackPlugin(),
        // https://github.com/babel/babel/issues/8361
        // Circular dependencies by react-admin
        new FilterWarningsPlugin({
            exclude: /(?:export '[^']+' (\(reexported as '[^']+'\) )?was not found in '[^']+)|(?:Circular dependency[^]+ra-core)/,
        }),
        env.build &&
            new LodashModuleReplacementPlugin({
                // Required by react-admin
                paths: true,
                // Required by loadable-components
                shorthands: true,
            }),
        new MomentLocalesPlugin({
            localesToKeep: ['ru'],
        }),
        new CircularDependencyPlugin({
            failOnError: false,
        }),
    ].filter(Boolean),
    resolve: {
        modules: ['node_modules', path.resolve(`./src/client`)],
        extensions: ['.js', '.ts', '.tsx'],
        alias: {
            'node-fetch$': 'node-fetch/lib/index.js',
            'unfetch/polyfill$': 'unfetch/polyfill/index.js',
        },
    },
    stats: {
        all: false,
        colors: true,
        timings: true,
        errors: true,
    },
});

const cacheableDependencies = [
    'apollo-cache-inmemory',
    'apollo-client',
    'apollo-link',
    'apollo-link-error',
    'apollo-link-http',
    'autobind-decorator',
    'fontfaceobserver',
    'graphql',
    'graphql-tag',
    'lodash',
    'minireset.css',
    'moment',
    'normalize.css',
    'path-to-regexp',
    'query-string',
    'react',
    'react-apollo',
    'react-dom',
    '@hot-loader/react-dom',
    'react-helmet',
    'react-hot-loader',
    'react-loadable',
    'react-router-dom',
    'reset-css',
    'styled-components',
    'svg-sprite-loader',
    'unfetch',
    'core-js',
    'regenerator-runtime',
    'stylis',
    'history',
    'zen-observable',
];

const clientConfig = env => ({
    name: 'client',
    target: 'web',
    entry: [
        './src/client/globals/isomorphic-globals',
        './src/client/globals/client-globals',
        !env.build && 'webpack-hot-middleware/client?reload=true&noInfo=true',
        !env.build && 'react-hot-loader/patch',
        './src/client/client.ts',
    ].filter(Boolean),
    module: {
        rules: commonLoaders(false, env),
    },
    plugins: [
        new webpack.DefinePlugin({ SSR_MODE: false }),
        env.build && new CopyWebpackPlugin([{ from: './src/client/public', to: '../public' }]),
        new LoadablePlugin({
            filename: '../loadable-stats.json',
            writeToDisk: env.build,
        }),
        env.build &&
            new OperationRegistryPlugin({
                filename: './dist/operation-registry.json',
            }),
        // https://webpack.js.org/guides/caching/
        new webpack.HashedModuleIdsPlugin(),
        env.analyze && new BundleAnalyzerPlugin(),
        !env.build &&
            new UnusedWebpackPlugin({
                directories: [path.resolve(`./src/client`)],
                exclude: [
                    // Readme files are fine
                    'README.md',
                    // Apollo types are generated
                    'ApolloTypes',
                    // These files are ignored due to babel usage (instead of tsc)
                    '*.d.ts',
                    // Entry points
                    'client.ts',
                    'server.ts',
                    // Special folder for public files
                    'public',
                    // Tests are fine
                    '__tests__',
                    // TODO: Temporal, remove once common/graphql/Graphql.ts becomes used
                    'Graphql.ts',
                    // TODO: Temporal, remove once common/lib/react-hooks/useMutation.ts becomes used
                    'useMutation.ts',
                ],
                root: path.resolve(`./src/client`),
            }),
    ].filter(Boolean),
    output: {
        // https://webpack.js.org/guides/caching/
        filename: env.build ? '[name].[contenthash].js' : '[name].js',
        chunkFilename: env.build ? '[name].[contenthash].js' : '[name].js',
        path: path.resolve(__dirname, 'dist', 'static'),
    },
    // https://webpack.js.org/guides/caching/
    optimization: {
        runtimeChunk: 'single',
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: new RegExp(`[\\\\/]node_modules[\\\\/](?:${cacheableDependencies.join('|')})`),
                    name: 'vendors',
                    chunks: 'all',
                },
            },
        },
    },
});

const serverConfig = env => ({
    name: 'server',
    target: 'node',
    entry: ['./src/client/globals/isomorphic-globals', './src/client/server.ts'],
    module: {
        rules: commonLoaders(true, env),
    },
    plugins: [
        new webpack.DefinePlugin({ SSR_MODE: true }),
        new webpack.optimize.LimitChunkCountPlugin({
            maxChunks: 1,
        }),
    ],
    output: {
        filename: 'server.bundle.js',
        path: path.resolve(__dirname, 'dist'),
        libraryTarget: 'commonjs2',
    },
});

module.exports = (env = {}) => {
    // https://github.com/webpack/webpack/issues/2121
    process.env.NODE_ENV = !env.build ? 'development' : 'production';

    return [merge(clientConfig(env), commonConfig(env)), merge(serverConfig(env), commonConfig(env))];
};
