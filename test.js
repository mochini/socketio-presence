import SocketClient from 'socket.io-client'
import React from 'react'

class App extends React.Component {

  render() {
    ...
  }

  componentDidMount() {
    this.client = SocketClient('http://localhost:3001')
    this.client.on('connect', this._handleConnect.bind(this))
    this.client.on('pong', this._handlePong.bind(this))
  }

  _handleConnect() {
    this.client.emit('ping')
  }

  _handlePong() {
    console.log('Pong!')
  }

}

export default App
