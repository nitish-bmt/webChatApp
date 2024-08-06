const express = require('express');
const path = require('path');
const http = require('http');

// bidirectional communication
// No need to refresh like HTTP requests
const socketio = require("socket.io");
const formatMessage = require('./utils/messages');

const app = express();

// express also does this under the hood
// here we are createt the server on our own because we need it for the socket connection
const server = http.createServer(app);

// isiliye chahiye tha server instance
const io = socketio(server);

// connect the be to fe via static folder
app.use(express.static(path.join((__dirname, './public'))));


const bot = 'NITISH';
io.on('connection', socket=>{

  socket.on('joinRoom', ({username, room}={
    socket.emit
  });
  console.log('new node connected');

  // to the new node 
  socket.emit('message', formatMessage(bot, 'Welcome to my chatApp'));

  // to all expect new node
  socket.broadcast.emit('message','joined the chat');

  socket.on('disconnect', ()=>{
    socket.broadcast.emit('message', 'left the chat');
  })

  socket.on('chatMessage',message=>{
    io.emit('message', formatMessage('nitish', message));
  })
  // to all including the new node
  // io.emit('message', 'message string');
});


const PORT = process.env.PORT || 3000;

server.listen(PORT, ()=>console.log(`server started at: http://localhost:${PORT}`));