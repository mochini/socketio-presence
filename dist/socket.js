'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var users = [];

var socket = function socket(io, _socket) {

  var user = null;

  _socket.emit('presence', users);

  _socket.on('signin', function (data, callback) {

    user = data.name;

    users = [].concat((0, _toConsumableArray3.default)(users), [data]);

    io.emit('presence', users);

    callback();
  });

  _socket.on('signout', function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(callback) {
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:

              users = users.filter(function (item) {
                return item.name !== user;
              });

              user = null;

              io.emit('presence', users);

              callback();

            case 4:
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

  _socket.on('disconnect', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
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

            io.emit('presence', users);

          case 5:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  })));

  _socket.on('presence', function () {
    var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(data) {
      var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};
      return _regenerator2.default.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:

              users = users.map(function (user) {
                return (0, _extends3.default)({}, user, {
                  status: user.name === data.name ? data.status : user.status
                });
              });

              io.emit('presence', users);

            case 2:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, undefined);
    }));

    return function (_x2) {
      return _ref3.apply(this, arguments);
    };
  }());
};

exports.default = socket;