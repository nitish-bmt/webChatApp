const express = require('express');
const path = require('path');
const http = require('http');
const os = require('os');

// bidirectional communication
// No need to refresh like HTTP requests
const socketio = require("socket.io");
const formatMessage = require('./utils/messages');
const {userJoin, getCurrentUser, getRoomUsers, userLeave} = require('./users');

const app = express();

// express also does this under the hood
// here we are createt the server on our own because we need it for the socket connection
const server = http.createServer(app);

// isiliye chahiye tha server instance
const io = socketio(server);

// connect the be to fe via static folder
app.use(express.static(path.join((__dirname, './public'))));

app.get('/healthcheck',(req, res)=>{

  const systemUptimeInSecs = os.uptime();
  const systemUptime = `${Math.floor(systemUptimeInSecs/(60*60))}hrs, ${Math.floor((systemUptimeInSecs%(60*60))/60)}mins, ${Math.floor(systemUptimeInSecs%60)}secs`;

  const serverUptimeInSecs = process.uptime();
  const serverUptime = `${Math.floor(serverUptimeInSecs/(60*60))}hrs, ${Math.floor((serverUptimeInSecs%(60*60))/60)}mins, ${Math.floor(serverUptimeInSecs%60)}secs`;

  res.json({
    status: 200,
    serverUptime: serverUptime,
    systemUptime: systemUptime
  })
})

const bot = 'ADMIN';
io.on('connection', socket=>{

  socket.on('joinRoom', ({username, room})=>{

    const user = userJoin(socket.id, username, room);
    socket.join(user.room);

    socket.emit('message', formatMessage(bot, 'Welcome to my chatApp'));

    socket.broadcast.to(user.room).emit('message', formatMessage(bot,`${user.username} joined the chat`));
  
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });
  console.log('new node connected');

  socket.on('disconnect', ()=>{
    const user = userLeave(socket.id);

    console.log(`${user.username} disconnected`);

    if(user){
      io.to(user.room).emit('message', formatMessage(bot, `${user.username} left the chat`));
  
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room),
    });
    }
  
  })

  socket.on('chatMessage',message=>{
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit('message', formatMessage(user.username, message));
  })
  // to all including the new node
  // io.emit('message', 'message string');
});


const PORT = process.env.PORT || 3000;

server.listen(PORT, ()=>console.log(`server started at: http://localhost:${PORT}`));