const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

const allowedNames = [
  "Fyodor Dostoyevsky DA",
  "Dazai Osamu Beast",
  "Fyodor Dostoyevsky Ori",
  "Dazai Osamu Ori",
  "Kouyou Ozaki",
  "Agatha Christie",
  "Edogawa Ranpo Ori",
  "Francis Fitzgerlard",
  "Jikoyuu Suisen",
  "Van",
  "Nakahara Chuuya",
  "Shibusawa Tatsuhiko",
  "Oda Sakunosuke"
];

const players = {};

io.on("connection", (socket) => {

  socket.on("login", (name) => {

    if (!allowedNames.includes(name)) {
      socket.emit("loginFailed", "Danh tính không tồn tại");
      return;
    }

    const taken = Object.values(players).find(
      p => p.name === name
    );

    if (taken) {
      socket.emit("loginFailed", "Danh tính đã được sử dụng");
      return;
    }

    players[socket.id] = {
      id: socket.id,
      name,
     x: 500,
y: 500
    };

    socket.emit("loginSuccess", players[socket.id]);

    io.emit("players", players);
  });

  socket.on("move", (dir) => {

    const p = players[socket.id];
    if (!p) return;

    const speed = 8;

    if (dir === "up") p.y -= speed;
    if (dir === "down") p.y += speed;
    if (dir === "left") p.x -= speed;
    if (dir === "right") p.x += speed;

    io.emit("players", players);
  });

  socket.on("disconnect", () => {

    delete players[socket.id];

    io.emit("players", players);
  });

});

server.listen(process.env.PORT || 3000);
