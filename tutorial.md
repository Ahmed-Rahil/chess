# Building a Real-Time Chess Game with Node.js

This tutorial will guide you through building a real-time chess game using Node.js, Express, Socket.IO, and Chess.js.

## Project Setup

First, ensure you have Node.js installed on your system. Then follow these steps:

1. Initialize your project with required dependencies:

```bash
npm install express socket.io chess.js ejs
```

## Server Setup

### 1. Basic Express and Socket.IO Setup

In your `app.js`, start by importing the necessary modules:

```javascript
const express = require("express");
const http = require("http");
const { Chess } = require("chess.js");
const socket = require("socket.io");
const path = require("path");
```

Create the Express app and initialize the HTTP server:

```javascript
const app = express();
const server = http.createServer(app);
const io = socket(server);
```

### 2. Game State Initialization

Initialize the chess game and player tracking:

```javascript
const chess = new Chess();
let players = {};
let currentPlayer = "W";
```

### 3. Express Configuration

Configure Express to use EJS templating and serve static files:

```javascript
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("index");
});
```

### 4. Socket.IO Event Handlers

Handle player connections and game moves:

```javascript
io.on("connection", (uniquesocket) => {
  console.log("A user connected:", uniquesocket.id);

  // Assign roles to players
  if (!players.white) {
    players.white = uniquesocket.id;
    uniquesocket.emit("playerRole", "white");
  } else if (!players.black) {
    players.black = uniquesocket.id;
    uniquesocket.emit("playerRole", "black");
  } else {
    uniquesocket.emit("spectator");
    return;
  }

  // Handle disconnections
  uniquesocket.on("disconnect", () => {
    if (players.white === uniquesocket.id) {
      delete players.white;
    } else if (players.black === uniquesocket.id) {
      delete players.black;
    }
  });

  // Handle moves
  uniquesocket.on("makeMove", (move) => {
    // Validate player's turn
    if (
      (chess.turn() === "white" && players.white !== uniquesocket.id) ||
      (chess.turn() === "black" && players.black !== uniquesocket.id)
    ) {
      // Invalid move handling
    }
    // Move validation and game state update will be implemented here
  });
});
```

## Current Implementation Status

✅ Basic server setup  
✅ Express configuration  
✅ Player connection handling  
✅ Role assignment  
✅ Disconnect handling  
⏳ Move validation (in progress)  
⏳ Game state broadcasting  
⏳ Spectator mode implementation

This tutorial will be updated as more features are implemented in the application.
