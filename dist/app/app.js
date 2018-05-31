'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _socket = require('socket.io-client');

var _socket2 = _interopRequireDefault(_socket);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var App = function (_React$Component) {
  (0, _inherits3.default)(App, _React$Component);

  function App() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, App);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = App.__proto__ || Object.getPrototypeOf(App)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      joined: false,
      name: '',
      users: []
    }, _this._handleTypeName = _this._handleTypeName.bind(_this), _this._handleReceive = _this._handleReceive.bind(_this), _this._handleLeave = _this._handleLeave.bind(_this), _this._handleFocus = _this._handleFocus.bind(_this), _this._handleJoin = _this._handleJoin.bind(_this), _this._handleBlur = _this._handleBlur.bind(_this), _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  (0, _createClass3.default)(App, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _state = this.state,
          joined = _state.joined,
          log = _state.log,
          messages = _state.messages,
          name = _state.name,
          users = _state.users;

      return _react2.default.createElement(
        'div',
        { className: 'ui form' },
        _react2.default.createElement(
          'div',
          { className: 'application' },
          _react2.default.createElement(
            'div',
            { className: 'left' },
            _react2.default.createElement(
              'div',
              { className: 'top' },
              _react2.default.createElement(
                'div',
                { className: 'fields' },
                _react2.default.createElement(
                  'div',
                  { className: 'field' },
                  joined ? _react2.default.createElement('input', { disabled: true, className: 'ui disabled input', type: 'text', defaultValue: name }) : _react2.default.createElement('input', { ref: function ref(node) {
                      return _this2.name = node;
                    }, className: 'ui input', type: 'text', onChange: this._handleTypeName })
                ),
                _react2.default.createElement(
                  'div',
                  { className: 'field' },
                  joined ? _react2.default.createElement(
                    'button',
                    { className: 'ui button', onClick: this._handleLeave },
                    'Leave'
                  ) : _react2.default.createElement(
                    'button',
                    { className: 'ui button', onClick: this._handleJoin },
                    'Join'
                  )
                )
              )
            ),
            _react2.default.createElement(
              'div',
              { className: 'bottom' },
              _react2.default.createElement(
                'div',
                { className: 'users' },
                users.map(function (user, index) {
                  return _react2.default.createElement(
                    'div',
                    { className: 'user', key: 'user_' + index },
                    _react2.default.createElement('div', { className: 'status ' + user.status }),
                    user.name
                  );
                })
              )
            )
          )
        )
      );
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.client = (0, _socket2.default)('http://localhost:3000');
      this.client.on('message', this._handleReceive);
      window.addEventListener('blur', this._handleBlur, false);
      window.addEventListener('focus', this._handleFocus, false);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      window.removeEventListener('blur', this._handleBlur);
      window.removeEventListener('focus', this._handleFocus);
    }
  }, {
    key: '_handleTypeName',
    value: function _handleTypeName() {
      this.setState({
        name: this.name.value
      });
    }
  }, {
    key: '_handleTypeMessage',
    value: function _handleTypeMessage() {
      this.setState({
        message: this.message.value
      });
    }
  }, {
    key: '_handleJoin',
    value: function _handleJoin() {
      var _this3 = this;

      var name = this.state.name;

      this.client.emit('join', name, function () {
        _this3.setState({
          joined: true
        });
      });
    }
  }, {
    key: '_handleLeave',
    value: function _handleLeave() {
      var _this4 = this;

      this.client.emit('leave', function () {
        _this4.setState({
          joined: false
        });
      });
    }
  }, {
    key: '_handleReceive',
    value: function _handleReceive(action, data) {
      if (action === 'presence') this._handlePresence(data);
    }
  }, {
    key: '_handleMessage',
    value: function _handleMessage(message) {
      var log = this.state.log;

      this.setState({
        log: [].concat((0, _toConsumableArray3.default)(log), [message])
      });
    }
  }, {
    key: '_handleBlur',
    value: function _handleBlur() {
      var name = this.state.name;

      if (name === '') return;
      this.client.emit('message', 'presence', {
        name: name,
        status: 'abandoned'
      });
    }
  }, {
    key: '_handleFocus',
    value: function _handleFocus() {
      var name = this.state.name;

      if (name === '') return;
      this.client.emit('message', 'presence', {
        name: name,
        status: 'active'
      });
    }
  }, {
    key: '_handlePresence',
    value: function _handlePresence(users) {
      this.setState({
        users: users
      });
    }
  }]);
  return App;
}(_react2.default.Component);

exports.default = App;