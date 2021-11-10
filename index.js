const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
towers = [];
updates = 0;
// const io = require("socket.io")(server);
waves = [];

waves.push({ time: 100, number: 20, health: 100 });
waves.push({ time: 1000, number: 0, health: 100 });
waves.push({ time: 40, number: 40, health: 200 });
waves.push({ time: 1000, number: 0, health: 100 });
waves.push({ time: 30, number: 70, health: 250 });
waves.push({ time: 1000, number: 0, health: 100 });
waves.push({ time: 20, number: 100, health: 300 });
waves.push({ time: 4, number: Infinity, health: 500 });
currentWave = 1;
enemies = [];
totalNumOfEnemies = 0;
function update() {
  updates++;
  if (updates % waves[currentWave].time == 0) {
    if (waves[currentWave].number > 0) {
      waves[currentWave].number--;
    } else {
      if (currentWave != waves.length - 1) {
        currentWave++;
      }
    }
    totalNumOfEnemies++;

    enemies.push(new enemy(260, 0, enemies.length, waves[currentWave].health));
    enemies[enemies.length - 1].trueId = totalNumOfEnemies;
  }
}
setInterval(update(), 10);
class enemy {
  x = 0;
  y = 0;
  currentlyFollowing = 0;
  myId = 0;
  health = 100;
  speed = 1;
  trueId = 0;
  didSomeoneTellMeToDrawMyselfRed = 0;
  rotation = 180;
  maxHealth = 100;
  constructor(x, y, id, health) {
    this.x = x;
    this.y = y;
    this.myId = id;
    this.maxHealth = health;
    this.health = this.maxHealth;
  }
  followNext() {
    let xDistToNextNode = this.x - nodes[this.currentlyFollowing].x;
    let yDistToNextNode = this.y - nodes[this.currentlyFollowing].y;
    let dist = Math.sqrt(
      Math.pow(xDistToNextNode, 2) + Math.pow(yDistToNextNode, 2)
    );
    this.x -= this.speed * Math.sin(xDistToNextNode / dist);
    this.y -= this.speed * Math.sin(yDistToNextNode / dist);
    if (
      areColliding(
        this.x,
        this.y,
        2,
        2,
        nodes[this.currentlyFollowing].x,
        nodes[this.currentlyFollowing].y,
        2,
        2
      )
    ) {
      if (this.currentlyFollowing < nodes.length - 1) {
        this.currentlyFollowing++;
        if (
          this.currentlyFollowing == 1 ||
          this.currentlyFollowing == 5 ||
          this.currentlyFollowing == 6
        ) {
          this.rotation -= 90;
        }
        if (
          this.currentlyFollowing == 2 ||
          this.currentlyFollowing == 3 ||
          this.currentlyFollowing == 4
        ) {
          this.rotation += 90;
        }
      } else {
        this.killSelf();
        health -= 20;
        if (health < 0) {
          isGameOver = true;
        }
      }
    }
  }

  killSelf() {
    enemies.splice(enemies.indexOf(this), 1);
  }
}
nodes = [
  new node(275, 210),
  new node(515, 210),
  new node(515, 450),
  new node(330, 450),
  new node(330, 265),
  new node(25, 265),
  new node(25, 610),
];

app.use("/", express.static(__dirname + "/public"));

const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:8100",
    methods: ["GET", "POST"],
    transports: ["websocket", "polling"],
    credentials: true,
  },
  allowEIO3: true,
});
playerIds = [];
function newPlayerId() {
  var id = Math.floor(Math.random() * 1000000);
  if (playerIds.indexOf(id) != -1) {
    id = newPlayerId();
  }
  playerIds.push(id);
  return id;
}

io.on("connection", (socket) => {
  socket.emit("newId", { id: newPlayerId(), towers: towers });
  socket.on("towerPlaced", (tower) => {
    towers.push(tower);
  });
  console.log("hi");
  setInterval(() => {
    socket.emit("its3amTimeForYourTowerUpgrade", towers.slice(towers));
  }, 400);
});
server.listen(3000, () => {
  console.log("listening on *:3000");
});
