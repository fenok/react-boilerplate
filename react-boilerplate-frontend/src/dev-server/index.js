const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const webpackHotServerMiddleware = require('webpack-hot-server-middleware');
const webpackConfig = require('../../webpack.config');
const config = require('../../config');

const completeConfig = config.getCompleteConfig();

const app = express();

const compiler = webpack(webpackConfig);

app.use(
    webpackDevMiddleware(compiler, {
        serverSideRender: true,
        quiet: false,
        noInfo: false,
        stats: webpackConfig[0].stats,
    })
);
app.use(webpackHotMiddleware(compiler.compilers.find(compilerInner => compilerInner.name === 'client')));
app.use(webpackHotServerMiddleware(compiler));

app.listen(completeConfig.root.devServerPort);

// eslint-disable-next-line no-console
console.log(`Dev server is up at http://localhost:${completeConfig.root.devServerPort}`);