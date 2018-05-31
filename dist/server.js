'use strict';

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _socket = require('socket.io-redis');

var _socket2 = _interopRequireDefault(_socket);

var _socket3 = require('socket.io');

var _socket4 = _interopRequireDefault(_socket3);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

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

var users = [];

io.on('connection', function (socket) {

  var user = null;

  socket.emit('message', 'presence', users);

  socket.on('join', function (name, callback) {

    user = name;

    users = [].concat((0, _toConsumableArray3.default)(users), [{ name: name, status: 'active' }]);

    socket.join('chat');

    io.emit('message', 'presence', users);

    callback();
  });

  socket.on('leave', function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(callback) {
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:

              users = users.filter(function (item) {
                return item.name !== user;
              });

              user = null;

              io.emit('message', 'presence', users);

              socket.leave('chat');

              callback();

            case 5:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, undefined);
    }));

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }());

  socket.on('disconnect', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            if (user) {
              _context2.next = 2;
              break;
            }

            return _context2.abrupt('return');

          case 2:

            users = users.filter(function (item) {
              return item.name !== user;
            });

            user = null;

            io.emit('message', 'presence', users);

            socket.leave('chat');

          case 6:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  })));

  socket.on('message', function () {
    var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(action, data) {
      var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {};
      return _regenerator2.default.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:

              if (action === 'presence') {

                users = users.map(function (user) {
                  return (0, _extends3.default)({}, user, {
                    status: user.name === data.name ? data.status : user.status
                  });
                });

                io.emit('message', 'presence', users);
              }

              if (!(action === 'message')) {
                _context3.next = 4;
                break;
              }

              _context3.next = 4;
              return io.in('chat').emit('message', 'message', data);

            case 4:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, undefined);
    }));

    return function (_x2, _x3) {
      return _ref3.apply(this, arguments);
    };
  }());
});

transport.listen(3000, function () {
  console.log('Listening on 3000');
});