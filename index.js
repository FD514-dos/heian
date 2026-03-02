const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;
app.use(express.static("public"));

const allowedNames = [
"Fyodor Dostoyevsky Ori",
"Fyodor Dostoyevsky Beast",
"Nikolai Gogol",
"Dazai Osamu",
"Kouyou Ozaki",
"Agatha Christie",
"Edogawa Ranpo",
"Francis Fitzgerlard",
"Izumi Kyouka",
"Ayatsuji Yukito",
"Jikoyuu Suisen",
"Van",
"Nakahara Chuuya",
"Shibusawa Tatsuhiko",
"Oda Sakunosuke"
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
      color: "#" + Math.floor(Math.random()*16777215).toString(16)
    };

    socket.emit("loginSuccess", socket.id);
    io.emit("updatePlayers", players);
  });

  socket.on("move", (key) => {
    const player = players[socket.id];
    if (!player) return;

    const speed = 5;

    if (key === "ArrowUp") player.y -= speed;
    if (key === "ArrowDown") player.y += speed;
    if (key === "ArrowLeft") player.x -= speed;
    if (key === "ArrowRight") player.x += speed;

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
