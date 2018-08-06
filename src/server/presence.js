let users = []

const presence = (io, socket) => {

  let user = null

  socket.emit('presence', users)

  socket.on('signin', (data, callback) => {

    user = data.name

    console.log(`${user} signed in`)

    users = [ ...users, data ]

    io.emit('presence', users)

    callback()

  })

  socket.on('signout', (callback) => {

    console.log(`${user} signed out`)

    users = users.filter(item => item.name !== user)

    user = null

    io.emit('presence', users)

    callback()

  })

  socket.on('disconnect', () => {

    if(!user) return

    console.log(`${user} disconnected`)

    users = users.filter(item => item.name !== user)

    user = null

    io.emit('presence', users)

  })

  socket.on('status', async (data, callback = () => {}) => {

    console.log(`${data.name} is ${data.status}`)

    users = users.map(item => ({
      ...item,
      status: item.name === user ? data.status : item.status
    }))

    io.emit('presence', users)

  })

}

export default presence
