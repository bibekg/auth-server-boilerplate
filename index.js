// Main starting point of the application
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const router = require('./router');
const mongoose = require('mongoose');

// DB setup
// Creates a new DB inside of database called 'auth'
mongoose.connect('mongodb://localhost:auth/auth');

// App setup

// morgan is a logging framework useful for debugger
// e.g. when you make a GET request, morgan will log the following in console:
// ::1 - - [10/Nov/2017:04:33:17 +0000] "GET / HTTP/1.1" 404 139 "-" "Mozilla/5.0
// (Macintosh; Intel Mac OS X 10_13_1) AppleWebKit/537.36 (KHTML, like Gecko)
// Chrome/61.0.3163.100 Safari/537.36"
app.use(morgan('combined'));

// bodyParser parses incoming requests into json, whether it's actually in json
// format or not; but it usually is so we gucci
app.use(bodyParser.json({ type: '*/*' }));

router(app);

// Server setup
const port = process.env.PORT || 3090;

// http is a Node built-in module that knows how to set up a server to
// communicate with outside world; will pass in all requests and such to our
// 'app' var
const server = http.createServer(app);
server.listen(port);
console.log(`Server listening on: ${port}`);
