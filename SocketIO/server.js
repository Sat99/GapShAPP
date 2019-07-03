
const express = require('express')
const path = require('path')
const socketio = require('socket.io')
const http = require('http')
const SERVER_PORT = process.env.PORT || 2345

const app = express();
const server = http.createServer(app)
const io = socketio(server)

let usersockets = {};     //for convenience, usersockets1 contains keys as 'user id' and values as 'user name'
    // while usersockets2 contains keys as 'user name' and values as 'user ids'
                            //for convenience as in, when we want to search user  id for a certain user name, and to search user name for a particular user id


app.use('/', express.static(path.join(__dirname, 'frontend')))

io.on('connection', (socket) => {
    console.log("New socket formed from " + socket.id)
    socket.emit('connected')

    socket.on('login', (data) => {
        // username is in data.user
        usersockets[data.user] = socket.id;
        console.log(usersockets);
    })
    
    // socket.on('send_msg', (data) => {
    //     // if we use io.emit, everyone gets it
    //     // if we use socket.broadcast.emit, only others get it
    //     if (data.message.startsWith('@')) {
    //        
    //         let recipient = data.message.split(':')[0].substr(1)
    //         let rcptSocket = usersockets[recipient]
    //         io.to(rcptSocket).emit('recv_msg', data)
    //     } else {
    //         io.emit('recv_msg', data)            
    //     }
    // })
    socket.on("room1", (data) =>
    {
        socket.join(data.room);
        socket.broadcast.in(data.room).emit("online_message_room1", {
            user: data.user
        } )
    })
    socket.on("room2", (data) =>
    {
        socket.join(data.room);
        socket.broadcast.in(data.room).emit("online_message_room2", {
            user: data.user
        })
    })
    socket.on("room1_send_msg", function(data)
    {
        if (data.message.startsWith('@')) {
             //data.message = "@a: hello"
           // split at :, then remove @ from beginning
            let recipient = data.message.split(':')[0].substr(1)
              // if we use io.emit, everyone gets it
        // if we use socket.broadcast.emit, only others get it
            io.to(usersockets[recipient]).emit('room1_recv_msg', {
                user: data.user,
                message: data.message
            })
        } else {
            io.emit('room1_recv_msg', {
                user: data.user,
                message: data.message
            })            
        }
    })
    socket.on("room2_send_msg", function(data)
    {
        if (data.message.startsWith('@')) {
            let recipient = data.message.split(':')[0].substr(1)
            io.to(usersockets[recipient]).emit('room2_recv_msg', {
                user: data.user,
                message: data.message
            })
        } else {
            io.emit('room2_recv_msg', {
                user: data.user,
                message: data.message
            })            
        }
    })

})

server.listen((SERVER_PORT), () => console.log('Website open on http://localhost:2345'))
