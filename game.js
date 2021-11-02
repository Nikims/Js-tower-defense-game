// Creating variables
let updates = 0;
mapEditMode = 0;
mapImgs = [];
mapImgs[0] = new Image();
mapImgs[0].src = "map1fixed.png";
circleImg = new Image();
circleImg.src = "tqkrug.png";
robotPic = new Image();
robotPic.src = "robot1.png";
towerPic = new Image();
towerPic.src = "tower1big.png";
currentWave = 1;
totalNumOfEnemies = 0;
circlesCoords = new Map();
selectedTower = -1;
waves = [];
waves.push({ time: 100, number: 40 });
waves.push({ time: 400, number: 1 });
waves.push({ time: 40, number: 10 });
waves.push({ time: 400, number: 1 });
waves.push({ time: 20, number: 20 });
waves.push({ time: 400, number: 1 });

waves.push({ time: 10, number: 20 });

currentWave = 0;
money = 300;
// function drawCircle(radius) {
//   if (circlesCoords.get(radius) != undefined) {
//   } else {
//     circlesCoords.set(radius, []);
//     for (i = -Math.PI; i < Math.PI; i += 0.02) {
//       circlesCoords.get(radius).push({
//         xCoords: 10 + radius * Math.cos(i),
//         yCoords: radius * Math.sin(i),
//       });
//     }
//   }
// }
class towerSpawner {
  x = 0;
  y = 0;
  ogX = 0;
  ogY = 0;
  type = 0;
  currentlyDragging = false;
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.ogX = x;
    this.ogY = y;
    this.type = type;
  }
  updatePos() {
    if (this.currentlyDragging) {
      this.x = mouseX;
      this.y = mouseY;
    }
  }
  mouseDownUpdate() {
    if (areColliding(this.x, this.y, 100, 100, mouseX, mouseY, 100, 100)) {
      this.currentlyDragging = true;
    }
  }
  drawSelf() {
    context.drawImage(towerPic, this.x, this.y, 60, 60);
    if (money < 200) {
      context.fillStyle = "red";
      context.globalAlpha = 0.4;
      context.fillRect(this.x + 10, this.y, 37, 60);
      context.globalAlpha = 1;
    }
    context.fillStyle = "black";
  }
  mouseUpUpdate() {
    this.x = this.ogX;
    this.y = this.ogY;

    let numOfCollisions = 0;
    if (money > 200 && this.currentlyDragging == true) {
      if (grid[Math.floor(mouseX / 60)][Math.floor(mouseY / 60)] == 1) {
        for (i = 0; i < towers.length; i++) {
          if (
            Math.sqrt(
              Math.pow(mouseX - 10 - towers[i].x, 2) +
                Math.pow(mouseY - 30 - towers[i].y, 2)
            ) <
            towers[i].range / 3
          ) {
            numOfCollisions++;
          }
        }
        if (numOfCollisions == 0) {
          towers.push(
            new tower(mouseX - 10, mouseY - 30, "ddz", towers.length)
          );
          money -= 200;
        }
      }
    }
    this.currentlyDragging = false;
  }
}
testSpawner = new towerSpawner(700, 100);
class node {
  x = 0;
  y = 0;
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}
class bullet {
  dmg = 0;
  x = 0;
  y = 0;
  source = 0;
  target = 0;
  IremberTarget = {};
  constructor(source, target, dmg) {
    this.x = source.x;
    this.y = source.y;
    this.source = source;
    this.dmg = dmg;
    this.target = target;
    this.IremberTarget.x = target.x;
    this.IremberTarget.y = target.y;
    this.IremberTarget.x -= (this.x - this.IremberTarget.x) * 4;
    this.IremberTarget.y -= (this.y - this.IremberTarget.y) * 4;
  }
  flyTo() {
    let xDistToNextNode = this.x - this.IremberTarget.x;
    let yDistToNextNode = this.y - this.IremberTarget.y;
    let dist = Math.sqrt(
      Math.pow(xDistToNextNode, 2) + Math.pow(yDistToNextNode, 2)
    );
    this.x -= 9 * Math.sin(xDistToNextNode / dist);
    this.y -= 9 * Math.sin(yDistToNextNode / dist);
    if (
      areColliding(this.x, this.y, 10, 10, this.target.x, this.target.y, 30, 30)
    ) {
      money += 20;
      this.target.health -= 20;
      bullets.splice(bullets.indexOf(this), 1);
    }
    if (
      areColliding(
        this.x,
        this.y,
        5,
        5,
        this.IremberTarget.x,
        this.IremberTarget.y,
        30,
        30
      )
    ) {
      bullets.splice(bullets.indexOf(this), 1);
    }

    // this.y += 5 * Math.sin(this.y / dist);
  }
  drawSelf() {
    context.fillRect(this.x, this.y, 10, 10);
  }
}
nodes = [
  new node(270, 207),
  new node(505, 207),
  new node(508, 442),
  new node(328, 447),
  new node(325, 266),
  new node(27, 270),
  new node(26, 800),
];
class tower {
  shootingSpeed = 20;
  hasntShotIn = 0;
  type = "";
  x = 0;
  y = 0;
  range = 120;
  myId = 0;
  isSelected = 0;
  recievedEvent = 0;
  enemiesInRange = [];
  closestDistance = [];
  currentRotation = 0;

  constructor(x, y, type, id) {
    this.type = type;
    this.x = x;
    this.y = y;
    this.myId = id;
    // drawCircle(this.range);

    // for (let i = 0; i < towers.length; i++) {
    //   towers[i].isSelected = 0;
    // }
    // this.isSelected = 1;
  }
  drawSelf() {
    {
      // for (let i = 0; i < circlesCoords.get(this.range).length; i++) {
      //   context.fillRect(
      //     circlesCoords.get(this.range)[i].xCoords + this.x,
      //     circlesCoords.get(this.range)[i].yCoords + this.y,
      //     5,
      //     5
      //   );
      // }
      if (this.isSelected == 1) {
        context.globalAlpha = 1;
        context.globalAlpha = 0.4;
        context.drawImage(
          circleImg,
          this.x - this.range + 10,
          this.y - this.range + 15,
          this.range * 2,
          this.range * 2
        );
      }

      context.globalAlpha = 1;
      if (this.isSelected == 1) {
        context.fillStyle = "red";
      } else {
        context.fillStyle = "blue";
      }
      context.save();
      context.translate(this.x + 15, this.y + 15);
      try {
        let nextRotaion =
          Math.atan2(
            this.y - enemies[this.closestDistance[1]].y + 15,
            this.x - enemies[this.closestDistance[1]].x + 15
          ) -
          Math.PI / 2;
        if (this.currentRotation < nextRotaion) {
          this.currentRotation += 0.1;
        } else {
          this.currentRotation -= 0.1;
        }
      } catch (e) {
        console.log("cope");
      }
      if (
        this.closestDistance[1] != undefined &&
        this.closestDistance[0] < this.range
      ) {
        // console.log(enemies[towers[0].closestDistance[1]].x);
        try {
          context.rotate(this.currentRotation);
        } catch (e) {
          console.log("cope");
        }
      }

      context.drawImage(towerPic, -32, -32, 64, 64);
      context.restore();
      context.fillStyle = "rgb(0,0,0,50)";
    }
  }
  aim() {
    this.hasntShotIn++;
    if (this.hasntShotIn > this.shootingSpeed + 1) {
      this.hasntShotIn = 0;
    }
    this.closestDistance = [9999, 9999];
    let distanceToMe = 0;
    for (let i = 0; i < enemies.length; i++) {
      distanceToMe = Math.sqrt(
        Math.pow(this.x - enemies[i].x, 2) + Math.pow(this.y - enemies[i].y, 2)
      );
      if (distanceToMe < this.closestDistance[0]) {
        this.closestDistance[0] = distanceToMe;
        this.closestDistance[1] = i;
      }
      if (distanceToMe < this.range) {
        if (this.isSelected == 1) {
          enemies[i].didSomeoneTellMeToDrawMyselfRed = 1;
        }

        // if (this.hasntShotIn % 30 == 0) {
        //   enemies[i].killSelf();
        //   this.hasntShotIn = 0;
        //   break;
        // }
        if (enemies[i] != undefined) {
          if (!this.enemiesInRange.includes(enemies[i].trueId)) {
            this.enemiesInRange.push(enemies[i].trueId);
          } else {
            this.enemiesInRange.splice(
              this.enemiesInRange.indexOf(enemies[i].trueId),
              1
            );
          }
        }
      }
    }
    if (
      this.hasntShotIn == this.shootingSpeed &&
      this.closestDistance[0] < this.range
    ) {
      bullets.push(new bullet(this, enemies[this.closestDistance[1]], 20));
      //     enemies[closestDistance[1]].health -= 20;
    }
  }
}
bullets = [];
towers = [];

enemies = [];
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
      }
    }
  }
  drawSelf() {
    if (this.health < 0) {
      this.money += 20;
      this.killSelf();
    }

    //context.filter = "none";

    context.save();
    context.translate(this.x, this.y);
    context.rotate(this.rotation * (Math.PI / 180));
    context.drawImage(robotPic, -15, -15, 30, 30);
    context.restore();
    if (this.didSomeoneTellMeToDrawMyselfRed == 1) {
      context.fillStyle = "red";
      context.globalAlpha = 0.2;
      context.fillRect(this.x - 15, this.y - 15, 30, 30);
      context.globalAlpha = 1;

      this.didSomeoneTellMeToDrawMyselfRed = 0;
    } else {
      context.fillStyle = "black";
    }

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

enemies.push(new enemy(260, 0));

//wave 1 4000
//wave 2 2000
// for (i = 0; i < 600; i += 10) {
//   for (j = 0; j < 600; j += 10) {
//     if (grid[Math.floor(i / 60)][Math.floor(j / 60)] == 1) {
//       towers.push(new tower(i - 10, j - 50, "lmao", towers.length));
//     }
//   }
// }
function update() {
  testSpawner.updatePos();
  updates++;
  for (i = 0; i < bullets.length; i++) {
    bullets[i].flyTo();
  }
  if (updates % waves[currentWave].time == 0) {
    if (waves[currentWave].number > 0) {
      waves[currentWave].number--;
    } else {
      if (currentWave != waves.length - 1) {
        currentWave++;
      }
    }
    totalNumOfEnemies++;

    enemies.push(new enemy(260, 0, enemies.length));
    enemies[enemies.length - 1].trueId = totalNumOfEnemies;
  }

  for (i = 0; i < enemies.length; i++) {
    if (enemies.length > 0) {
      enemies[i].followNext();
    }
  }
  // for (i = 0; i < towers.length; i++) {
  //   towers[i].aimAt();
  // }
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
    towers[i].aim();
  }
  if (mapEditMode == 1) {
    for (i = 0; i < nodes.length; i++) {
      context.fillRect(nodes[i].x, nodes[i].y, 5, 5);
    }
  }

  if (mapEditMode == 2) {
    for (i = 0; i < grid.length; i++) {
      for (j = 0; j < grid[i].length; j++) {
        context.strokeRect(j * 60, i * 60, 60, 60);
      }
    }
  }
  for (i = 0; i < bullets.length; i++) {
    bullets[i].drawSelf();
  }
  // context.drawImage(towerPic, tempTower.x, tempTower.y, 60, 60);
  testSpawner.drawSelf();
  context.font = "20px Ariel";
  context.fillText(money, 20, 20);
  context.fillRect(700, 300, 100, 100);

  // tuk naprogramirai kakvo da se risuva
}
output = "";

function keyup(key) {
  // Show the pressed keycode in the console
  console.log("Pressed", key);
  if (mapEditMode == 1) {
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
  if (mapEditMode == 2) {
    if (key == 32) {
      output +=
        "grid[" +
        Math.floor(mouseX / 60) +
        "][" +
        Math.floor(mouseY / 60) +
        "]=0 \n";
    }
    console.log(output);
  }
}
function mousedown() {
  testSpawner.mouseDownUpdate();
}
function mouseup() {
  testSpawner.mouseUpUpdate();
  numOfCollisions = 0;
  towerToBeSelected = 0;
  if (selectedTower != -1) {
    if (areColliding(mouseX, mouseY, 30, 30, 700, 300, 300, 300)) {
      towers[selectedTower].shootingSpeed = Math.floor(
        towers[selectedTower].shootingSpeed / 1.5
      );
    }
  }
  if (towers.length > 0) {
    for (i = 0; i < towers.length; i++) {
      if (
        areColliding(mouseX, mouseY, 1, 1, towers[i].x, towers[i].y, 20, 50)
      ) {
        numOfCollisions++;
        towerToBeSelected = i;
      }
    }
    if (numOfCollisions > 0) {
      for (i = 0; i < towers.length; i++) {
        towers[i].isSelected = 0;
      }
      towers[towerToBeSelected].isSelected = 1;
      selectedTower = towerToBeSelected;
    }
  }

  // Show coordinates of mouse on click
  console.log("Mouse clicked at", mouseX, mouseY);
}
