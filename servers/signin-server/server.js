const express = require('express');
const app = express();
const mysql = require('mysql');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));

// Enable CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Serafim12',
  database: 'AppTest'
});

connection.connect();

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

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});