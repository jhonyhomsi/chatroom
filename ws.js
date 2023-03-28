const http = require('http');
const express = require('express');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/public'));

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
      const messageContent = `${data.name}: ${data.message}`;
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: 'message', name: data.name, message: data.message }));
        }
      });
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
//
//app.use(express.static(__dirname + '/public'));
//
//const clients = new Set();
//
//wss.on('connection', (socket) => {
//  clients.add(socket);
//  console.log(`Online: ${clients.size} clients connected`);
//
//  socket.on('message', (message) => {
//    console.log(`Received message: ${message}`);
//    const data = JSON.stringify({ type: 'message', content: message });
//    clients.forEach((client) => {
//      if (client !== socket && client.readyState === WebSocket.OPEN) {
//        client.send(data);
//      }
//    });
//  });
//
//  socket.on('close', () => {
//    clients.delete(socket);
//    console.log(`Offline: ${clients.size} clients connected`);
//  });
//});
//
//server.listen(port, () => {
//  console.log(`Server listening on port ${port}`);
//});




//const http = require('http');
//const express = require('express');
//const WebSocket = require('ws');
//
//const app = express();
//const server = http.createServer(app);
//const wss = new WebSocket.Server({ server });
//
//const port = process.env.PORT || 3000;
//
//app.use(express.static(__dirname + '/public'));
//
//wss.on('connection', (socket) => {
//  console.log(`online`);
//
//  socket.on('message', (message) => {
//    const data = JSON.parse(message);
//    console.log(`received message: ${message}`);
//    wss.clients.forEach((client) => {
//      if (client !== socket && client.readyState === WebSocket.OPEN) {
//        client.send(JSON.stringify(data));
//      }
//    });
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





//const http = require('http');
//const express = require('express');
//const WebSocket = require('ws');
//
//const app = express();
//const server = http.createServer(app);
//const wss = new WebSocket.Server({ server });
//
//const port = process.env.PORT || 3000;
//
//app.use(express.static(__dirname + '/public'));
//
//wss.on('connection', (socket) => {
//  console.log(`online`);
//
//  socket.on('message', (message) => {
//    console.log(`received message: ${message}`);
//    wss.clients.forEach((client) => {
//      if (client.readyState === WebSocket.OPEN) {
//        client.send(message);
//      }
//    });
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





//const http = require('http');
//const express = require('express');
//const WebSocket = require('ws');
//
//const app = express();
//const server = http.createServer(app);
//const wss = new WebSocket.Server({ server });
//
//const port = process.env.PORT || 3000;
//
//app.use(express.static(__dirname + '/public'));
//
//wss.on('connection', (socket) => {
//  console.log(`online`);
//
//  socket.on('message', (message) => {
//    console.log(`received message: ${message}`);
//    wss.clients.forEach((client) => {
//      if (client !== socket && client.readyState === WebSocket.OPEN) {
//        client.send(message.toString());
//      }
//    });
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
//const http = require('http');
//const express = require('express');
//
//const app = express();
//const server = http.createServer(app);
//const wss = new WebSocket.Server({ server });
//
//const port = process.env.PORT || 3000;
//
//app.use(express.static(__dirname + '/public'));
//
//wss.on('connection', (ws) => {
//  console.log('New client connected');
//
//  ws.on('message', (message) => {
//    console.log(`Received message: ${message}`);
//
//    // Broadcast the message to all connected clients
//    wss.clients.forEach((client) => {
//      if (client !== ws && client.readyState === WebSocket.OPEN) {
//        client.send(message);
//      }
//    });
//  });
//
//  ws.on('close', () => {
//    console.log('Client disconnected');
//  });
//});
//
//server.listen(port, () => {
//  console.log(`WebSocket server started on port ${port}`);
//});












//const http = require('http');
//const express = require('express');
//const WebSocket = require('ws');
//
//const app = express();
//const server = http.createServer(app);
//const wss = new WebSocket.Server({ server });
//
//const port = process.env.PORT || 3000;
//
//app.use(express.static(__dirname + '/public'));
//
//wss.on('connection', (socket) => {
//  console.log(`online`);
//
//  socket.on('message', (message) => {
//    console.log(`received message: ${message}`);
//    wss.clients.forEach((client) => {
//      if (client !== socket && client.readyState === WebSocket.OPEN) {
//        client.send(message);
//      }
//    });
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