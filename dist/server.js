'use strict';

var _socket = require('socket.io-redis');

var _socket2 = _interopRequireDefault(_socket);

var _socket3 = require('socket.io');

var _socket4 = _interopRequireDefault(_socket3);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _socket5 = require('./socket');

var _socket6 = _interopRequireDefault(_socket5);

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv2.default.load({ path: _path2.default.resolve('.env') });

var server = (0, _express2.default)();

server.use(_express2.default.static(_path2.default.resolve('public')));

var transport = _http2.default.createServer(server);

var redis = (0, _socket2.default)(process.env.REDIS_URL);

var io = (0, _socket4.default)(transport);

io.adapter(redis);

io.on('connection', function (sock) {
  return (0, _socket6.default)(io, sock);
});

transport.listen(3000, function () {
  console.log('Listening on 3000');
});