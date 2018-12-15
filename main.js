var express = require('express');
var app = express();

var server = app.listen(8083, function () {
    console.log("Server running at 8083");
});

var io = require('socket.io').listen(server);

io.on('connection', (socket) => {
    console.log('new connection made');

    socket.on('join', function (data) {
        // joining the room
        socket.join(data.room);

        console.log(data.username, ' has joined the room ', data.room);

        // to broadcast to all the users belongs to that particular room
        socket.broadcast.to(data.room).emit('new user joined', {username:data.username, message:'has joined the room.'});
    });

    socket.on('leave', function (data) {
        // leaving the room
        socket.leave(data.room);

        console.log(data.username, ' has left the room ', data.room);

        // to broadcast to all the users belongs to that particular room
        socket.broadcast.to(data.room).emit('user left', {username:data.username, message:'has left the room.'});
    });

    socket.on('message', function(data){

        // to send the message to the particular room
        io.to(data.room).emit('new message', {username: data.username, message:data.message});
    })
})