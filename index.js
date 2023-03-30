const http = require('http');
const express = require('express');
const WebSocket = require('ws');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const port = process.env.PORT || 9000; // Choose a port to listen on

app.use(bodyParser.urlencoded({ extended: true }));

// Enable CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// Set up database connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Serafim12',
  database: 'AppTest'
});

connection.connect();

// Add route for user signup
app.post('/signup', (req, res) => {
    const { username, passwords, email, number } = req.body;
    const checkUserQuery = 'SELECT * FROM signup WHERE username = ?';
    connection.query(checkUserQuery, [username], (error, results) => {
      if (error) throw error;
      if (results.length > 0) {
        res.send('User already exists');
      } else {
        const insertQuery = 'INSERT INTO signup (username, email, passwords, numbers) VALUES (?, ?, ?, ?)';
        connection.query(insertQuery, [username, email, passwords, number], (error) => {
          if (error) throw error;
          console.log('User Added to database successfully');
          res.send('User Added to database successfully');
        });
      }
    });
  });

// Add route for user login
app.post('/login', (req, res) => {
    const { username, passwords } = req.body;
    const query = 'SELECT * FROM signup WHERE username = ? AND passwords = ?';
    connection.query(query, [username, passwords], (error, results) => {
        if (error) throw error;
        if (results.length > 0) {
            res.send('User authenticated');
        } else {
            res.send('Login failed');
        }
  });
});

// Set up WebSocket connection
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

  function saveMessage(name, message) {
    const query = 'INSERT INTO messages (name, message) VALUES (?, ?)';
    connection.query(query, [name, message], (error, results, fields) => {
      if (error) throw error;
      console.log('Message saved to database');
    });
  }

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});