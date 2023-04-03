const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const { MongoClient } = require('mongodb');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

async function connectToDatabase(collectionName) {
  const uri = 'mongodb+srv://jhony-33:Serafim12@cluster0.j3va4xj.mongodb.net/ChatsDatabase?retryWrites=true&w=majority';
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  return client.db().collection(collectionName);
}

wss.on('connection', async (ws) => {
  console.log('a user connected');

  const messagesCollection = await connectToDatabase("ChatsLog");
  const usersCollection = await connectToDatabase("Users");

  // Retrieve the list of users from the database
  const users = await usersCollection.find().toArray();

  // Send the list of users to the client-side script via WebSocket
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
    } else if (messageObj.type === 'message') {
      const message = `${messageObj.name}: ${messageObj.message}`;
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: 'message', message }));
        }
      });
      await saveMessage(messagesCollection, messageObj);
    }
  });
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

server.listen(3000, () => {
  console.log('Server listening on port 3000');
});



//const express = require('express');
//const http = require('http');
//const WebSocket = require('ws');
//const { MongoClient } = require('mongodb');
//
//const app = express();
//const server = http.createServer(app);
//const wss = new WebSocket.Server({ server });
//
//async function connectToDatabase() {
//  const uri = 'mongodb+srv://jhony-33:Serafim12@cluster0.j3va4xj.mongodb.net/ChatsDatabase?retryWrites=true&w=majority';
//  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
//  await client.connect();
//  return client.db().collection("ChatsLog");
//}
//
//wss.on('connection', async (ws) => {
//  console.log('a user connected');
//
//  const messagesCollection = await connectToDatabase();
//
//  ws.on('message', async (data) => {
//    console.log(`received message: ${data}`);
//
//    const messageObj = JSON.parse(data);
//
//    if (messageObj.type === 'join') {
//      const joinMessage = `${messageObj.name} has joined the chat`;
//      wss.clients.forEach((client) => {
//        if (client.readyState === WebSocket.OPEN) {
//          client.send(JSON.stringify({ type: 'notification', message: joinMessage }));
//        }
//      });
//    } else if (messageObj.type === 'message') {
//      const message = `${messageObj.name}: ${messageObj.message}`;
//      wss.clients.forEach((client) => {
//        if (client.readyState === WebSocket.OPEN) {
//          client.send(JSON.stringify({ type: 'message', message }));
//        }
//      });
//      await saveMessage(messagesCollection, messageObj);
//    }
//  });
//});
//
//async function saveMessage(collection, messageObj) {
//  const chatMessage = {
//    name: messageObj.name,
//    message: messageObj.message,
//    timestamp: new Date(),
//  };
//  collection.insertOne(chatMessage, (error, result) => {
//    if (error) {
//      console.log('Error saving message:', error);
//    } else {
//      console.log('Message saved successfully');
//    }
//  });
//}
//
//server.listen(3000, () => {
//  console.log('Server listening on port 3000');
//});







//const express = require('express');
//const http = require('http');
//const WebSocket = require('ws');
//const { MongoClient } = require('mongodb');
//
//const app = express();
//const server = http.createServer(app);
//const wss = new WebSocket.Server({ server });
//
//const port = process.env.PORT || 4000;
//
//const mongoUrl = 'mongodb+srv://jhony-33:Serafim12@cluster0.j3va4xj.mongodb.net/?retryWrites=true&w=majority';
//const dbName = 'ChatsDatabase';
//let collectionName = 'ChatsLog';
//let db;
//
//// Connect to MongoDB
//MongoClient.connect(mongoUrl, (err, client) => {
//  if (err) {
//    console.error('Failed to connect to MongoDB:', err);
//    process.exit(1);
//  }
//
//  console.log('Connected to MongoDB successfully');
//  db = client.db(dbName);
//});
//
//// Broadcast the number of online users to all connected clients
////function broadcastUserCount() {
////  wss.clients.forEach((client) => {
////    if (client.readyState === WebSocket.OPEN) {
////      db.collection(collectionName).countDocuments({ online: true }, (err, count) => {
////        if (err) {
////          console.error('Failed to retrieve online user count from database:', err);
////          return;
////        }
////        client.send(JSON.stringify({ type: 'userCount', count }));
////      });
////    }
////  });
////}
//
//// Handle new WebSocket connections
//wss.on('connection', (socket) => {
//  console.log('Client connected');
//
//  // Broadcast the number of online users to all connected clients on each new connection
//  //broadcastUserCount();
//
//  // Handle incoming WebSocket messages
//  socket.on('message', (data) => {
//    console.log(`Received message from client: ${data}`);
//
//    // Broadcast the received message to all connected clients
//    wss.clients.forEach((client) => {
//      if (client.readyState === WebSocket.OPEN) {
//        client.send(data);
//      }
//    });
//  });
//
//  // Handle WebSocket disconnections
//  socket.on('close', () => {
//    console.log('Client disconnected');
//
//    // Broadcast the number of online users to all connected clients on each disconnection
//    //broadcastUserCount();
//  });
//});
//
//server.listen(port, () => {
//  console.log(`Server started on port ${port}` );
//});