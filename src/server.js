import Redis from 'socket.io-redis'
import socketio from 'socket.io'
import express from 'express'
import socket from './socket'
import dotenv from 'dotenv'
import http from 'http'
import path from 'path'

dotenv.load({ path: path.resolve('.env') })

const server = express()

server.use(express.static(path.resolve('public')))

const transport = http.createServer(server)

const redis = Redis(process.env.REDIS_URL)

const io = socketio(transport)

io.adapter(redis)

io.on('connection', (sock) => socket(io, sock))

transport.listen(3000, () => {
  console.log('Listening on 3000')
})
