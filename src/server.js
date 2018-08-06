import config from './config/webpack.config'
import devServer from 'webpack-dev-server'
import socketio from 'socket.io'
import webpack from 'webpack'
import express from 'express'
import socket from './socket'
import http from 'http'
import path from 'path'

const transport = http.createServer()

const io = socketio(transport)

io.on('connection', (sock) => socket(io, sock))

transport.listen(3001, () => {
  console.log('Socket listening on 3001')
})

const server = new devServer(webpack(config), {
  contentBase: path.join('src', 'public'),
  compress: true,
  hot: true,
  // stats: 'errors-only',
  watchContentBase: true,
  open: true,
  historyApiFallback: {
    disableDotRule: true,
    rewrites: [
      { from: /.*/, to: "index.html" },
    ]
  }
})

server.listen(3000, null, () => {
  console.info('Server listening on 3000')
})
