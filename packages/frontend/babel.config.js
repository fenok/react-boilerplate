const packageJson = require('./package');

/**
 * Base config, used by jest
 */
module.exports = {
    presets: [
        [
            '@babel/env',
            {
                targets: {
                    node: packageJson.engines.node,
                },
            },
        ],
        '@babel/react',
        '@babel/typescript',
    ],
    plugins: [
        ['@babel/plugin-proposal-decorators', { legacy: true }],
        ['@babel/plugin-proposal-class-properties', { loose: true }],
        '@babel/plugin-syntax-dynamic-import',
        'react-loadable/babel',
        process.env.NODE_ENV === 'development' && 'react-hot-loader/babel',
        [
            'babel-plugin-styled-components',
            {
                ssr: true,
                displayName: process.env.NODE_ENV === 'development',
            },
        ],
        process.env.NODE_ENV === 'development' && 'add-react-displayname',
        process.env.NODE_ENV === 'development' && '@babel/plugin-transform-react-jsx-source',
        process.env.NODE_ENV !== 'development' && 'lodash',
    ].filter(Boolean),
};
