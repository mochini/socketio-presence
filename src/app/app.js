import React from 'react'
import SocketClient from 'socket.io-client'

class App extends React.Component {

  state = {
    joined: false,
    name: '',
    users: []
  }

  _handleTypeName = this._handleTypeName.bind(this)
  _handleReceive = this._handleReceive.bind(this)
  _handleLeave = this._handleLeave.bind(this)
  _handleFocus = this._handleFocus.bind(this)
  _handleJoin = this._handleJoin.bind(this)
  _handleBlur = this._handleBlur.bind(this)

  render() {
    const { joined, log, messages, name, users } = this.state
    return (
      <div className="ui form">
        <div className="application">
          <div className="left">
            <div className="top">
              <div className="fields">
                <div className="field">
                  { joined ?
                    <input disabled className="ui disabled input" type="text" defaultValue={ name } /> :
                    <input ref={ node => this.name = node } className="ui input" type="text" onChange={ this._handleTypeName } />
                  }
                </div>
                <div className="field">
                  { joined ?
                    <button className="ui button" onClick={ this._handleLeave }>Leave</button> :
                    <button className="ui button" onClick={ this._handleJoin }>Join</button>
                  }
                </div>
              </div>
            </div>
            <div className="bottom">
              <div className="users">
                { users.map((user, index) => (
                  <div className="user" key={`user_${index}`}>
                    <div className={`status ${user.status}`} />
                    { user.name }
                  </div>
                )) }
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  componentDidMount() {
    this.client = SocketClient('http://localhost:3000')
    this.client.on('message', this._handleReceive)
    window.addEventListener('blur', this._handleBlur, false)
    window.addEventListener('focus', this._handleFocus, false)
  }

  componentWillUnmount() {
    window.removeEventListener('blur', this._handleBlur)
    window.removeEventListener('focus', this._handleFocus)
  }

  _handleTypeName() {
    this.setState({
      name: this.name.value
    })
  }

  _handleJoin() {
    const { name } = this.state
    this.client.emit('join', name, () => {
      this.setState({
        joined: true
      })
    })
  }

  _handleLeave() {
    this.client.emit('leave', () => {
      this.setState({
        joined: false
      })
    })
  }

  _handleReceive(action, data) {
    if(action === 'presence') this._handlePresence(data)
  }

  _handleBlur() {
    const { name } = this.state
    if(name === '') return
    this.client.emit('message', 'presence', {
      name,
      status: 'abandoned'
    })
  }

  _handleFocus() {
    const { name } = this.state
    if(name === '') return
    this.client.emit('message', 'presence', {
      name,
      status: 'active'
    })
  }

  _handlePresence(users) {
    this.setState({
      users
    })
  }

}

export default App
