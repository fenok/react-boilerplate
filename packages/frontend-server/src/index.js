const express = require('express');

const app = express();
const serverRenderer = require('frontend/dist/server.bundle.js').default;
const reactLoadableStats = require('frontend/dist/react-loadable.json');

app.use(express.static('./node_modules/frontend/dist/public'));
app.use('/static', express.static('./node_modules/frontend/dist/static'));
app.use(serverRenderer({ reactLoadableStats }));

app.listen(6060);

/* eslint-disable-next-line no-console */
console.log('Listen at localhost:6060');
