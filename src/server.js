import Redis from 'socket.io-redis'
import socketio from 'socket.io'
import express from 'express'
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

let users = []

io.on('connection', (socket) => {

  let user = null

  socket.emit('message', 'presence', users)

  socket.on('join', (name, callback) => {

    user = name

    users = [ ...users, { name, status: 'active' } ]

    socket.join('chat')

    io.emit('message', 'presence', users)

    callback()

  })

  socket.on('leave', async (callback) => {

    users = users.filter(item => item.name !== user)

    user = null

    io.emit('message', 'presence', users)

    socket.leave('chat')

    callback()

  })

  socket.on('disconnect', async () => {

    if(!user) return

    users = users.filter(item => item.name !== user)

    user = null

    io.emit('message', 'presence', users)

    socket.leave('chat')

  })

  socket.on('message', async (action, data, callback = () => {}) => {

    if(action === 'presence') {

      users = users.map(user => ({
        ...user,
        status: user.name === data.name ? data.status : user.status
      }))

      io.emit('message', 'presence', users)

    }

  })

})

transport.listen(3000, () => {
  console.log('Listening on 3000')
})
