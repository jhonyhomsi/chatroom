const http = require('http');
const express = require('express');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/public'));

wss.on('connection', (socket) => {
  console.log('a user connected');+

  socket.on('message', (message) => {
    console.log(`received message: ${message}`);
    wss.clients.forEach((client) => {
      if (client !== socket && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  socket.on('close', () => {
    console.log('a user disconnected');
  });
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});