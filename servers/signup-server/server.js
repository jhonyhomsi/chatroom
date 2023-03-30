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

app.listen(4000, () => {
  console.log('Server listening on port 4000');
});