const fs = require('fs');
const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();
app.use(express.json());
app.use(cookieParser());

const user = {
  id: 123,
  username: 'testuser',
  password: 'qwerty'
};

// Auth controller
app.post('/auth', (req, res) => {
  const { username, password } = req.body;
  if (username === user.username && password === user.password) {
    res.cookie('userId', user.id, { maxAge: 2 * 24 * 60 * 60 * 1000, httpOnly: true });
    res.cookie('authorized', true, { maxAge: 2 * 24 * 60 * 60 * 1000, httpOnly: true });
    res.send('Authorized successfully');
  } else {
    res.status(400).send('Incorrect username or password');
  }
});

// Post controller
app.post('/post', (req, res) => {
  const { filename, content } = req.body;
  const userId = req.cookies.userId;
  const authorized = req.cookies.authorized;
  if (userId === user.id.toString() && authorized === 'true') {
    fs.writeFile(`./files/${filename}`, content, (err) => {
      if (err) {
        res.status(500).send('Internal server error');
      } else {
        res.send('File created successfully');
      }
    });
  } else {
    res.status(401).send('Unauthorized');
  }
});

// Delete controller
app.post('/delete', (req, res) => {
  const { filename } = req.body;
  const userId = req.cookies.userId;
  const authorized = req.cookies.authorized;
  if (userId === user.id.toString() && authorized === 'true') {
    fs.unlink(`./files/${filename}`, (err) => {
      if (err) {
        res.status(500).send('Internal server error');
      } else {
        res.send('File deleted successfully');
      }
    });
  } else {
    res.status(401).send('Unauthorized');
  }
});

app.listen(3000, () => console.log('Server is listening on port 3000'));
