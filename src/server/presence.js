let users = []

const presence = (io, socket) => {

  let user = null

  socket.emit('presence', users)

  socket.on('signin', (data, callback) => {

    user = data.name

    users = [ ...users, data ]

    io.emit('presence', users)

    callback()

  })

  socket.on('signout', async (callback) => {

    users = users.filter(item => item.name !== user)

    user = null

    io.emit('presence', users)

    callback()

  })

  socket.on('disconnect', async () => {

    if(!user) return

    users = users.filter(item => item.name !== user)

    user = null

    io.emit('presence', users)

  })

  socket.on('presence', async (data, callback = () => {}) => {

    users = users.map(user => ({
      ...user,
      status: user.name === data.name ? data.status : user.status
    }))

    io.emit('presence', users)

  })

}

export default presence
