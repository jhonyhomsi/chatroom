const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const { MongoClient } = require('mongodb');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const port = process.env.PORT || 4000;

async function connectToDatabase() {
  const uri = 'mongodb+srv://jhony-33:Serafim12@cluster0.j3va4xj.mongodb.net/ChatsDatabase?retryWrites=true&w=majority'; // Replace with your own MongoDB Atlas URI
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  return client.db().collection("ChatsLog");

  const usersCollection = await client.db().collection("Users");
  async function getUsers() {
    const users = await usersCollection.find().toArray();
    return users;
  }

}

let userCount = 0;

wss.on('connection', async (ws) => {
  const users = await getUsers();
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type: 'usersList', users }));
    }
  });



  console.log('a user connected');
  userCount++;

  const messagesCollection = await connectToDatabase();

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
    if (messageObj.type === 'getUsers') {
      const users = await getUsers();
      ws.send(JSON.stringify({ type: 'usersList', users }));
    }    
    if (messageObj.type === 'getUsers') {
      const users = await getUsers();
      ws.send(JSON.stringify({ type: 'usersList', users }));
    } else {
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: 'userCount', count: userCount }));
        }
      });
    }    
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
      console.log('Error saving message:', error); // add this line
    } else {
      console.log('Message saved successfully');
    }
  });
}


server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});