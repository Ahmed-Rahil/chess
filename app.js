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
let currentPlayer = 'W';



app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
  res.render('index');
});

io.on('connection', (uniquesocket) => {
  console.log('A user connected:', uniquesocket.id);

  if(!players.white) {
    players.white = uniquesocket.id;
    uniquesocket.emit('playerRole', 'white');
  }
  else if(!players.black) {
    players.black = uniquesocket.id;
    uniquesocket.emit('playerRole', 'black');
  } else {
    uniquesocket.emit('spectator');
    return;
  }

  uniquesocket.on('disconnect', () => {
    if (players.white === uniquesocket.id) {
      delete players.white;
    }
    else if (players.black === uniquesocket.id) {
      delete players.black;
    }});

  uniquesocket.on('makeMove', (move) => {
    try{
      if(chess.turn() === 'white' && players.white !== uniquesocket.id ||
         chess.turn() === 'black' && players.black !== uniquesocket.id) 
         return;
      const result = chess.move(move);
      if(result) {
        console.log('Move made:', move);
        currentPlayer = chess.turn();
        io.emit('moveMade', move);
        io.emit('gameState', chess.fen());
      }
      else{
        console.error('Invalid move:', move);
        uniquesocket.emit('invalidMove', 'Invalid move: ' + move);
      }
    }
    catch(error) {
      console.error('Invalid move:', error);
      uniquesocket.emit('invalidMove', error.message);
      return;
    }
  });


});


server.listen(3000, () => {
  console.log('Server is running on port 3000');
});