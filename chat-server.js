const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const { MongoClient } = require('mongodb');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const port = process.env.PORT || 4000;

async function connectToDatabase() {
  const uri = 'mongodb+srv://<username>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority';
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  return client.db().collection("users");
}

let userCount = 0;

wss.on('connection', async (ws) => {
  console.log('a user connected');
  userCount++;

  const usersCollection = await connectToDatabase();
  const users = await usersCollection.find().toArray();
  ws.send(JSON.stringify({ type: 'users', users }));

  ws.on('message', async (data) => {
    console.log(`received message: ${data}`);

    const messageObj = JSON.parse(data);

    if (messageObj.type === 'join') {
      const joinMessage = `${messageObj.name} has joined the chat`;
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: 'notification', message: joinMessage }));
        }
      });
      userCount++;
    } else if (messageObj.type === 'message') {
      const message = `${messageObj.name}: ${messageObj.message}`;
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: 'message', message }));
        }
      });
      await saveMessage(messagesCollection, messageObj);
    }
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type: 'userCount', count: userCount }));
      }
    });
  });

  ws.on('close', () => {
    console.log('a user disconnected');
    userCount--;
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type: 'userCount', count: userCount }));
      }
    });
  });

  ws.send(JSON.stringify({ type: 'userCount', count: userCount }));
});

async function saveMessage(collection, messageObj) {
  const chatMessage = {
    name: messageObj.name,
    message: messageObj.message,
    timestamp: new Date(),
  };
  collection.insertOne(chatMessage, (error, result) => {
    if (error) {
      console.log('Error saving message:', error);
    } else {
      console.log('Message saved successfully');
    }
  });
}

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});