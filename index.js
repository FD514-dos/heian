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
  console.log("Player connected:", socket.id);

  // Tạo player mới
  players[socket.id] = {
    id: socket.id,
    x: Math.random() * 500,
    y: Math.random() * 500,
    color: "#" + Math.floor(Math.random()*16777215).toString(16)
  };

  // Gửi toàn bộ player hiện tại cho người mới
  socket.emit("currentPlayers", players);

  // Thông báo cho người khác có player mới
  socket.broadcast.emit("newPlayer", players[socket.id]);

  socket.on("move", (key) => {
    let player = players[socket.id];
    if (!player) return;

    const speed = 5;

    if (key === "ArrowUp") player.y -= speed;
    if (key === "ArrowDown") player.y += speed;
    if (key === "ArrowLeft") player.x -= speed;
    if (key === "ArrowRight") player.x += speed;

    io.emit("playerMoved", player);
  });

  socket.on("disconnect", () => {
    console.log("Player disconnected:", socket.id);
    delete players[socket.id];
    io.emit("playerDisconnected", socket.id);
  });
});

server.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
