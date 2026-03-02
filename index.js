const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

app.use(express.static("public"));

let players = {};

io.on("connection", (socket) => {

  socket.on("login", (name) => {

    // map tên thành 1 trong 15 char
    const charId = hashName(name) % 15;

    players[socket.id] = {
      id: socket.id,
      name,
      charId,
      x: Math.random() * 2000,
      y: Math.random() * 2000
    };

    socket.emit("currentPlayers", players);
    socket.broadcast.emit("newPlayer", players[socket.id]);
  });

  socket.on("move", (data) => {
    if (players[socket.id]) {
      players[socket.id].x = data.x;
      players[socket.id].y = data.y;
      io.emit("playerMoved", players[socket.id]);
    }
  });

  socket.on("disconnect", () => {
    delete players[socket.id];
    io.emit("playerDisconnected", socket.id);
  });

});

function hashName(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash += name.charCodeAt(i);
  }
  return hash;
}

server.listen(PORT, () => {
  console.log("Server running");
});
