const express = require('express');
const http = require('http');
const {Chess} = require('chess.js');

const app = express();
const server = http.createServer(app);

const socket = require('socket.io');
const io = socket(server);
const path = require('path');

const chess = new Chess();
let players = {};
let currentPleyer = 'W';



app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
  res.render('index');
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  socket.on('test', () => {
    console.log('Test message received from client');
  });
  socket.emit('move');
});


server.listen(3000, () => {
  console.log('Server is running on port 3000');
});