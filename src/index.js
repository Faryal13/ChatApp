const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage, generateLocationMessage } = require('./utils/messages')
const {  addUser,RemoveUser,GetUser,getUsersInroom} =require('../src/utils/user.js')
const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

io.on('connection', (socket) => {
    console.log('New WebSocket connection')

    
     socket.on('join',(options,callback)=>{
       const {error,user}= addUser({id:socket.id,...options})
       if(error)
       {
       return  callback(error)
       }
        socket.join(user.room)
        
       
        socket.emit('message', generateMessage(user.username,`Welcome ${user.username} to the Room : ${user.room}`))
        socket.broadcast.to(user.room).emit('message', generateMessage(user.username,`${user.username} has joined!!`))
        io.to(user.room).emit('RoomData',{
            room:user.room,
            users:getUsersInroom(user.room)
        })
        
        callback() 
    
    })
    socket.on('sendMessage', (message, callback) => {
        const user=GetUser(socket.id)
        const filter = new Filter()

        if (filter.isProfane(message)) {
            return callback('Profanity is not allowed!')
        }
     
        io.to(user.room).emit('message', generateMessage(user.username,message))
        callback()
    })

    socket.on('sendLocation', (coords, callback) => {
        const user=GetUser(socket.id)
        io.to(user.room).emit('locationMessage', generateLocationMessage(user.username,`https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback()
    })

    socket.on('disconnect', () => {
       const user= RemoveUser(socket.id)
       if(user)
       {
        io.to(user.room).emit('message', generateMessage(user.username,`${user.username} has left !!`))
        io.to(user.room).emit('RoomData',{
            room:user.room,
            users:getUsersInroom(user.room)
        })
       }
        
    })



})

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})