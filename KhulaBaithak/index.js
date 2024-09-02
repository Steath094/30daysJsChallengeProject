const {Server} = require('socket.io')
const io = new Server(8000)
const users = {}

io.on('connection', (socket) => {
    console.log('New user connected')
    // console.log(socket);
    socket.on('new-user-joined', name=>{
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    })
    socket.on('send',message=>{
        // console.log(message);
        socket.broadcast.emit('recieve', {message: message,name: users[socket.id]});
    })
    // socket.on('new-user-joined', ({ username, room }) => {
    //     socket.join(room)
    //     users[socket.id] = { username, room }
        
    //     io.to(room).emit('message', { user: 'admin', text: `${username} has joined the room` })
        
    //     io.to(room).emit('usersList', { users: Object.values(users).filter(user => user.room === room) })
    // })
    
    // socket.on('sendMessage', (message) => {
    //     const user = users[socket.id]
    //     io.to(user.room).emit('message', { user: user.username, text: message })
    // })
    
    // socket.on('disconnect', () => {
    //     console.log('User disconnected')
    //     const user = users[socket.id]
        
    //     if (user) {
    //         io.to(user.room).emit('message', { user: 'admin', text: `${user.username} has left the room` })
    //         io.to(user.room).emit('usersList', { users: Object.values(users).filter(user => user.room === user.room) })
    //         delete users[socket.id]
    //     }
    // })
})