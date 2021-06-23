'use strict';
const express    = require('express');
const http = require('http')
const config     = require('config');
const bodyparser = require('body-parser')

const routes = require('./routes/index')
const events = require('./events')

const port = config.get('port');

const {errorHandler} = require('../middlewares/errorMiddleware')

//Start Express.js
const app = express();
app.use(bodyparser.json({ limit: '7mb', type: ['application/json', 'text/plain']}));
app.use(bodyparser.urlencoded({ limit: '7mb', extended: true }));
const server = http.createServer(app);

app.use(errorHandler)

routes.bind(app);

server.on('error', events.onServerError);
process.on('SIGINT', ()=>events.onProcessKill(server));
process.on('SIGTERM',()=>events.onProcessKill(server));
process.on('unhandledRejection', events.onException);
process.on('uncaughtException',  (err)=>events.onException(err));

module.exports = app.listen(port, ()=>events.onListen(port));