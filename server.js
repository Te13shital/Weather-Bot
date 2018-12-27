'use strict';

const express = require('express');
const config = require('./config')
const FBeamer = require('./FBeamer');
const bodyParser = require('body-parser');

const server = express();
const PORT = process.env.PORT || 8080;
const f = new FBeamer(config.fb);

server.get('/', (req, res) => f.registerHook(req, res));
server.post('/', bodyParser.json({
    verify: f.verifySignature
}));
server.post('/', (req, res, next) => {
    //messages will be received here if signature goes through
});
server.listen(PORT, () => console.log(`server started on port ${PORT}`))