const http = require('http');
const express = require('express');
const WebSocket = require('ws');
const mysql = require('mysql');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const port = process.env.PORT || 3000;
let messageContent

app.use(express.static(__dirname + '/public'));

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Serafim12',
  database: 'AppTest'
});

connection.connect();

function saveMessage(name, message) {
  const query = 'INSERT INTO messages (name, message) VALUES (?, ?)';
  connection.query(query, [name, message], (error, results, fields) => {
    if (error) throw error;
    console.log('Message saved to database');
  });
}

wss.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('message', (message) => {
    console.log(`received message: ${message}`);
    const data = JSON.parse(message);
    if (data.type === 'join') {
      const joinMessage = `${data.name} joined the chat`;
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: 'join', message: joinMessage }));
        }
      });
    } else if (data.type === 'message') {
      messageContent = `${data.name}: ${data.message}`;
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: 'message', name: data.name, message: data.message }));
        }
      });
      saveMessage(data.name, data.message); // Save the message to the database
    }
  });

  socket.on('close', () => {
    console.log('a user disconnected');
  });
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});




//const http = require('http');
//const express = require('express');
//const WebSocket = require('ws');
//
//const app = express();
//const server = http.createServer(app);
//const wss = new WebSocket.Server({ server });
//
//const port = process.env.PORT || 3000;
//let messageContent
//
//app.use(express.static(__dirname + '/public'));
//
//wss.on('connection', (socket) => {
//  console.log('a user connected');
//
//  socket.on('message', (message) => {
//    console.log(`received message: ${message}`);
//    const data = JSON.parse(message);
//    if (data.type === 'join') {
//      const joinMessage = `${data.name} joined the chat`;
//      wss.clients.forEach((client) => {
//        if (client.readyState === WebSocket.OPEN) {
//          client.send(JSON.stringify({ type: 'join', message: joinMessage }));
//        }
//      });
//    } else if (data.type === 'message') {
//      messageContent = `${data.name}: ${data.message}`;
//      wss.clients.forEach((client) => {
//        if (client.readyState === WebSocket.OPEN) {
//          client.send(JSON.stringify({ type: 'message', name: data.name, message: data.message }));
//        }
//      });
//      saveMessage(data.name, data.message); // Save the message to the database
//    }
//  });
//
//  socket.on('close', () => {
//    console.log('a user disconnected');
//  });
//});
//
//server.listen(port, () => {
//  console.log(`Server listening on port ${port}`);
//});



//const WebSocket = require('ws');
//
//const server = new WebSocket.Server({ port: 8080 });
//
//const clients = new Set();
//
//server.on('connection', (client) => {
//  console.log('Client connected');
//
//  // Add client to the set of connected clients
//  clients.add(client);
//
//  // Send the number of connected clients to all clients
//  broadcast({ type: 'numClients', numClients: clients.size });
//
//  client.on('message', (message) => {
//    console.log(`Received message: ${message}`);
//
//    // Broadcast the received message to all clients
//    broadcast({ type: 'message', message });
//
//  });
//
//  client.on('close', () => {
//    console.log('Client disconnected');
//
//    // Remove client from the set of connected clients
//    clients.delete(client);
//
//    // Send the updated number of connected clients to all clients
//    broadcast({ type: 'numClients', numClients: clients.size });
//  });
//});
//
//function broadcast(data) {
//  for (const client of clients) {
//    client.send(JSON.stringify(data));
//  }
//}