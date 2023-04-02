const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const { MongoClient } = require('mongodb');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const port = process.env.PORT || 4000;

const mongoUrl = 'mongodb+srv://jhony-33:Serafim12@cluster0.j3va4xj.mongodb.net/?retryWrites=true&w=majority';
const dbName = 'ChatsDatabase';
let collectionName = 'ChatsLog';
let db;

// Connect to MongoDB
MongoClient.connect(mongoUrl, (err, client) => {
  if (err) {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  }

  console.log('Connected to MongoDB successfully');
  db = client.db(dbName);
});

// Broadcast the number of online users to all connected clients
function broadcastUserCount() {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      db.collection(collectionName).countDocuments({ online: true }, (err, count) => {
        if (err) {
          console.error('Failed to retrieve online user count from database:', err);
          return;
        }
        client.send(JSON.stringify({ type: 'userCount', count }));
      });
    }
  });
}

// Handle new WebSocket connections
wss.on('connection', (socket) => {
  console.log('Client connected');

  // Broadcast the number of online users to all connected clients on each new connection
  broadcastUserCount();

  // Handle incoming WebSocket messages
  socket.on('message', (data) => {
    console.log(`Received message from client: ${data}`);

    // Broadcast the received message to all connected clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  });

  // Handle WebSocket disconnections
  socket.on('close', () => {
    console.log('Client disconnected');

    // Broadcast the number of online users to all connected clients on each disconnection
    broadcastUserCount();
  });
});

server.listen(port, () => {
  console.log(`Server started on port ${port}` );
<<<<<<< HEAD
});
=======
});
>>>>>>> parent of 1558ae5 (CorrectStack)
