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

// Handle new WebSocket connections
wss.on('connection', (socket) => {
  console.log('Client connected');
  
  // Notify all connected clients that a new user has joined the chat
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN && client !== socket) {
      client.send(JSON.stringify({ type: 'notification', message: 'A new user has joined the chat.' }));
    }
  });


  // Handle incoming WebSocket messages
  socket.on('message', (data) => {
    console.log(`Received message from client: ${data}`);

    // Parse the received message as JSON
    let message;
    try {
      message = JSON.parse(data);
    } catch (err) {
      console.error('Failed to parse message as JSON:', err);
      return;
    }

    // Broadcast the received message to all connected clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  });

  // Handle WebSocket disconnections
  socket.on('close', () => {
    console.log('Client disconnected');
  });
});

server.listen(port, () => {
  console.log(`Server started on port ${port}` );
});