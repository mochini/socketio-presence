import React from 'react'
import SocketClient from 'socket.io-client'

class App extends React.Component {

  state = {
    joined: false,
    name: '',
    users: []
  }

  _handleBlurFocus = this._handleBlurFocus.bind(this)
  _handleConnect = this._handleConnect.bind(this)
  _handlePresence = this._handlePresence.bind(this)
  _handleSignin = this._handleSignin.bind(this)
  _handleSignout = this._handleSignout.bind(this)
  _handleName = this._handleName.bind(this)

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
                    <input ref={ node => this.name = node } className="ui input" type="text" onChange={ this._handleName } />
                  }
                </div>
                <div className="field">
                  { joined ?
                    <button className="ui button" onClick={ this._handleSignout }>Signout</button> :
                    <button className="ui button" onClick={ this._handleSignin }>Signin</button>
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
    this.client.on('connect', this._handleConnect)
    this.client.on('presence', this._handlePresence)
    window.addEventListener('blur', this._handleBlurFocus, false)
    window.addEventListener('focus', this._handleBlurFocus, false)
  }

  componentWillUnmount() {
    window.removeEventListener('blur', this._handleBlurFocus)
    window.removeEventListener('focus', this._handleBlurFocus)
  }

  _handleName() {
    this.setState({
      name: this.name.value
    })
  }

  _handleConnect() {
    const { joined } = this.state
    if(joined) this._handleSignin()
  }

  _handleSignin() {
    const { name } = this.state
    this.client.emit('signin', {
      name,
      status: document.hasFocus() ? 'active' : 'absent'
    }, () => {
      this.setState({
        joined: true
      })
    })
  }

  _handleSignout() {
    this.client.emit('signout', () => {
      this.setState({
        joined: false
      })
    })
  }

  _handleBlurFocus() {
    const { name } = this.state
    if(name === '') return
    this.client.emit('presence', {
      name,
      status: document.hasFocus() ? 'active' : 'absent'
    })
  }

  _handlePresence(users) {
    this.setState({
      users
    })
  }

}

export default App
