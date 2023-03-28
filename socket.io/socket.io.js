const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/public'));

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('join', (data) => {
    console.log(`${data.username} joined the chat`);
    socket.broadcast.emit('user joined', `${data.username} joined the chat`);
  });

  socket.on('message', (data) => {
    console.log(`${data.username}: ${data.message}`);
    io.emit('message', data);
  });

  socket.on('disconnect', () => {
    console.log('a user disconnected');
  });
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});