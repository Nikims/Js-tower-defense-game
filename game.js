// Creating variables
let updates = 0;
mapEditMode = false;
mapImgs = [];
mapImgs[0] = new Image();
mapImgs[0].src = "map1fixed.png";
currentWave = 1;
totalNumOfEnemies = 0;
class node {
  x = 0;
  y = 0;
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}
nodes = [
  new node(270, 207),
  new node(505, 207),
  new node(508, 442),
  new node(328, 447),
  new node(325, 266),
  new node(27, 270),
  new node(26, 597),
];
class tower {
  shootingSpeed = 60;
  hasntShotIn = 60;
  type = "";
  x = 0;
  y = 0;
  range = 100;
  myId = 0;
  targets;
  constructor(x, y, type, id) {
    this.type = type;
    this.x = x;
    this.y = y;
    this.myId = id;
  }
  drawSelf() {
    context.fillStyle = "red";
    context.fillRect(this.x, this.y, 20, 50);
    context.fillStyle = "rgb(0,0,0,50)";
    for (let i = -Math.PI; i < Math.PI; i += 0.02) {
      context.fillRect(
        this.x + 10 + this.range * Math.cos(i),
        this.y + this.range * Math.sin(i),
        5,
        5
      );
    }
  }
  aimAt() {
    this.hasntShotIn -= 1;
    for (let i = 0; i < enemies.length; i++) {
      if (this.hasntShotIn < 0) {
        this.hasntShotIn = this.shootingSpeed;
      }
      if (
        Math.sqrt(
          Math.pow(this.x - enemies[i].x, 2) +
            Math.pow(this.y - enemies[i].y, 2)
        ) < this.range
      ) {
        if (enemies[i].isAimedAt.indexOf(this.myId) == -1) {
          enemies[i].isAimedAt.push(this.myId);
        }
      } else {
        if (enemies[i].isAimedAt.indexOf(this.myId) != -1) {
          enemies[i].isAimedAt.splice(
            enemies[i].isAimedAt.indexOf(this.myId),
            1
          );
        }
      }
    }
  }
}
towers = [];

enemies = [];
class enemy {
  x = 0;
  y = 0;
  currentlyFollowing = 0;
  myId = 0;
  health = 100;
  isAimedAt = [];
  trueId = 0;
  constructor(x, y, id) {
    this.x = x;
    this.y = y;
    this.myId = id;
  }
  followNext() {
    let xDistToNextNode = this.x - nodes[this.currentlyFollowing].x;
    let yDistToNextNode = this.y - nodes[this.currentlyFollowing].y;
    let dist = Math.sqrt(
      Math.pow(xDistToNextNode, 2) + Math.pow(yDistToNextNode, 2)
    );
    this.x -= 2 * Math.sin(xDistToNextNode / dist);
    this.y -= 2 * Math.sin(yDistToNextNode / dist);
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
      } else {
        this.killSelf();
      }
    }
  }
  drawSelf() {
    if (this.isAimedAt.length == 0) {
      context.fillStyle = "black";
    } else {
      context.fillStyle = "red";
    }
    context.fillRect(this.x, this.y, 30, 30);
    if (this.health < 100) {
      context.fillStyle = "rgb(5, 5, 5)";
      context.fillRect(this.x - 2.5, this.y - 22, 55, 15);
      context.fillStyle = "green";
      context.fillRect(this.x, this.y - 20, this.health / 2, 10);
      context.fillStyle = "black";
    }
  }
  killSelf() {
    enemies.splice(enemies.indexOf(this), 1);
  }
}

setInterval(() => {
  totalNumOfEnemies++;

  enemies.push(new enemy(260, 0, enemies.length));
  enemies[enemies.length - 1].trueId = totalNumOfEnemies;
}, 500);

enemies.push(new enemy(260, 0));

//wave 1 4000
//wave 2 2000
function update() {
  for (i = 0; i < enemies.length; i++) {
    if (enemies.length > 0) {
      enemies[i].followNext();
    }
  }
  for (i = 0; i < towers.length; i++) {
    towers[i].aimAt();
  }
  // Napisanoto tuk se izpulnqva otnovo i otnovo mnogo puti v sekunda
}

function draw() {
  for (i = 0; i < mapImgs.length; i++) {
    context.drawImage(mapImgs[i], 0, 0, 600, 600);
  }
  for (i = 0; i < enemies.length; i++) {
    if (enemies.length > 0) {
      enemies[i].drawSelf();
    }
  }
  for (i = 0; i < towers.length; i++) {
    towers[i].drawSelf();
  }
  if (mapEditMode) {
    for (i = 0; i < nodes.length; i++) {
      context.fillRect(nodes[i].x, nodes[i].y, 5, 5);
    }
  }

  // tuk naprogramirai kakvo da se risuva
}

function keyup(key) {
  // Show the pressed keycode in the console
  console.log("Pressed", key);
  if (mapEditMode) {
    if (key == 32) {
      nodes.push(new node(mouseX, mouseY));
      output = "[";
      for (i = 0; i < nodes.length; i++) {
        output += ", new node(" + nodes[i].x + "," + nodes[i].y + ")";
      }
      output += "]";
      console.log(output);
    }
  }
  if (key == 32) {
    towers.push(new tower(mouseX, mouseY, "ddz", towers.length));
  }
}

function mouseup() {
  // Show coordinates of mouse on click
  console.log("Mouse clicked at", mouseX, mouseY);
}
