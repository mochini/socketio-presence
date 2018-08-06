import config from './config/webpack.config'
import devServer from 'webpack-dev-server'
import socketio from 'socket.io'
import webpack from 'webpack'
import express from 'express'
import presence from './middleware/presence'
import http from 'http'
import path from 'path'

const socket = http.createServer()

const io = socketio(socket)

io.on('connection', (socket) => presence(io, socket))

socket.listen(3001, () => {
  console.log('Socket listening on 3001')
})

const server = new devServer(webpack(config), {
  hot: true,
  stats: 'errors-only'
})

server.listen(3000, null, () => {
  console.info('Server listening on 3000')
})
