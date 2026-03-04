const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;
app.use(express.static("public"));

const allowedNames = [
"Fyodor Dostoyevsky Dead Apple",
"Dazai Osamu Beast",
"Nikolai Gogol Ori",
"Dazai Osamu Ori",
"Kouyou Ozaki",
"Agatha Christie",
"Edogawa Ranpo Ori",
"Francis Fitzgerlard",
"Izumi Kyouka",
"Ayatsuji Yukito",
"Jikoyuu Suisen",
"Van",
"Nakahara Chuuya Ori",
"Shibusawa Tatsuhiko",
"Oda Sakunosuke Beast"
];

let players = {};

io.on("connection", (socket) => {

  socket.on("login", (name) => {

    if (!allowedNames.includes(name)) {
      socket.emit("loginFailed");
      return;
    }

    players[socket.id] = {
      id: socket.id,
      name: name,
      x: 2000,
      y: 2000,
      direction: "down", // 👈 THÊM DÒNG NÀY
    };

    socket.emit("loginSuccess", socket.id);
    io.emit("updatePlayers", players);
  });

  socket.on("move", (key) => {
    const player = players[socket.id];
    if (!player) return;

    const speed = 5;

    if (key === "ArrowUp") {
      player.y -= speed;
      player.direction = "up";
    }

    if (key === "ArrowDown") {
      player.y += speed;
      player.direction = "down";
    }

    if (key === "ArrowLeft") {
      player.x -= speed;
      player.direction = "left";
    }

    if (key === "ArrowRight") {
      player.x += speed;
      player.direction = "right";
    }

    io.emit("updatePlayers", players);
  });

  socket.on("disconnect", () => {
    delete players[socket.id];
    io.emit("updatePlayers", players);
  });
});

server.listen(PORT, () => {
  console.log("Server running");
});
