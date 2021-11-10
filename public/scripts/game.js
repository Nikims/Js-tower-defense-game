// Creating variables
let updates = 0;
mapEditMode = 0;
devMode = 0;
mapImgs = [];
mapImgs[0] = new Image();
mapImgs[0].src = "map1fixed-v2.png";
circleImg = new Image();
circleImg.src = "tqkrug.png";
robotPic = new Image();
robotPic.src = "robot1.png";
towerPic = new Image();
towerPic.src = "tower2big.png";
electricTowerPic = new Image();
electricTowerPic.src = "electricTower.png";
shockWavePic = new Image();
shockWavePic.src = "shockWaveTower.png";

bulletPic = new Image();
bulletPic.src = "bullet.png";
plasmabulletPic = new Image();
plasmabulletPic.src = "plasmabullet.png";
currentWave = 1;
totalNumOfEnemies = 0;
selectedTower = -1;
health = 200;
waves = [];
currentLevel = 0;
isGameOver = false;
deltaMouseX = 0;
deltaMouseY = 0;

othersTowers = [];

waves.push({ time: 100, number: 20, health: 100 });
waves.push({ time: 1000, number: 0, health: 100 });
waves.push({ time: 40, number: 40, health: 200 });
waves.push({ time: 1000, number: 0, health: 100 });
waves.push({ time: 30, number: 70, health: 250 });
waves.push({ time: 1000, number: 0, health: 100 });
waves.push({ time: 20, number: 100, health: 300 });
waves.push({ time: 4, number: Infinity, health: 500 });
otherTowers = [];
playerId = 0;
socket.on("newId", (response) => {
  playerId = response.id;
  socket.off("newId");
  otherTowers = response.towers;
});
socket.on("its3amTimeForYourTowerUpgrade", (towers) => {
  goodTowers = [];
  for (i = 0; i < towers.length; i++) {
    if (towers[i].belongsTo != playerId) {
      goodTowers.push(towers[i]);
    }
  }
  otherTowers = goodTowers;
});

function foriin(arr, action) {
  for (i = 0; i < arr.length; i++) {
    action();
  }
}
class upgradeBox {
  x = 0;
  y = 0;
  type = "";
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type;
  }
  drawSelf() {
    context.fillRect(this.x, this.y, 200, 60);

    context.fillStyle = "white";
    context.fillText(this.type, this.x + 40, this.y + 35);
    context.fillStyle = "black";
  }
  checkMouseUpCollision(whatdo) {
    if (areColliding(mouseX, mouseY, 30, 30, this.x, this.y, 200, 60)) {
      whatdo();
    }
  }
}
upgradeboxes = [];
upgradeboxes.push(new upgradeBox(700, 300, "Upgrade speed"));
upgradeboxes.push(new upgradeBox(700, 400, "Upgrade damage"));
upgradeboxes.push(new upgradeBox(700, 500, "Upgrade range"));
upgradeboxes.push(new upgradeBox(950, 500, "Change target Mode"));

currentWave = 0;
money = 300;
if (devMode) {
  money = 9999999999999;
}
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

spawners = [];
spawners.push(new towerSpawner(700, 100, "main"));
spawners.push(new towerSpawner(800, 100, "shockwave"));
spawners.push(new towerSpawner(900, 100, "sniper"));
spawners.push(new towerSpawner(900, 200, "electric"));

class node {
  x = 0;
  y = 0;
  constructor(x, y) {
    this.x = x;
    this.y = y;
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

bullets = [];
bullets.push([]);
bullets.push([]);

arcs = [];
towers = [];

enemies = [];

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
  //passive income grindset
  // if (health < 0) {
  //   isGameOver = true;
  // }
  //moved this over to the enemy class
  for (i = 0; i < particleSystems.length; i++) {
    particleSystems[i].updateParticles();
  }

  if (updates % 50 == 0) {
    money += 15;
  }
  if (!isGameOver) {
    foriin(arcs, () => {
      arcs[i].updateArc();
    });
    //to avoid unnecessary calculations
    foriin(spawners, () => {
      spawners[i].updatePos();
    });

    updates++;
    // for (i = 0; i < bullets.length; i++) {
    //   for (j = 0; j < bullets[i].length; j++) {
    //     bullets[i][j].flyTo();
    //   }
    // }

    if (updates % waves[currentWave].time == 0) {
      if (waves[currentWave].number > 0) {
        waves[currentWave].number--;
      } else {
        if (currentWave != waves.length - 1) {
          currentWave++;
        }
      }
      totalNumOfEnemies++;

      enemies.push(
        new enemy(260, 0, enemies.length, waves[currentWave].health)
      );
      enemies[enemies.length - 1].trueId = totalNumOfEnemies;
    }
    foriin(enemies, () => {
      if (enemies.length > 0) {
        enemies[i].followNext();
      }
    });
    foriin(towers, () => {
      towers[i].aim();
      for (j = 0; j < towers[i].bullets.length; j++) {
        towers[i].bullets[j].flyTo();
      }
    });

    // for (i = 0; i < towers.length; i++) {
    //   towers[i].aimAt();
    // }
    // Napisanoto tuk se izpulnqva otnovo i otnovo mnogo puti v sekunda
  }
}
function drawTower(tower) {
  context.drawImage(towerPic, tower.x, tower.y, 55, 64);
}
function draw() {
  context.drawImage(mapImgs[currentLevel], 0, 0, 600, 600);
  for (i = 0; i < particleSystems.length; i++) {
    particleSystems[i].drawParticles();
  }
  if (enemies.length > 0) {
    foriin(enemies, () => {
      enemies[i].drawSelf();
    });
  }

  foriin(towers, () => {
    towers[i].drawSelf();
    for (j = 0; j < towers[i].bullets.length; j++) {
      towers[i].bullets[j].drawSelf();
    }
  });

  if (mapEditMode == 1) {
    foriin(nodes, () => {
      context.fillRect(nodes[i].x, nodes[i].y, 5, 5);
    });
  }

  if (mapEditMode == 2) {
    foriin(grid, () => {
      for (j = 0; j < grid[i].length; j++) {
        context.strokeRect(j * 60, i * 60, 60, 60);
      }
    });
  }
  // foriin(bullets, () => {
  //   for (j = 0; j < bullets[i].length; j++) {
  //     bullets[i][j].drawSelf();
  //   }
  // });
  foriin(arcs, () => {
    arcs[i].drawSelf();
  });

  // context.drawImage(towerPic, tempTower.x, tempTower.y, 60, 60);
  foriin(spawners, () => {
    spawners[i].drawSelf();
  });

  context.font = "20px Ariel";
  context.fillText(money, 20, 20);
  if (selectedTower != -1) {
    for (i = 0; i < towers[selectedTower].price.length; i++) {
      context.fillText(towers[selectedTower].price[i], 700, i * 100 + 300);
    }
  }
  if (towers.length > 0) {
    context.fillText(
      "Target mode: " +
        towers[selectedTower].targetModes[towers[selectedTower].targetMode],
      650,
      20
    );
    foriin(upgradeboxes, () => {
      upgradeboxes[i].drawSelf();
    });
  }
  context.fillText(health, 20, 50);
  for (i = 0; i < otherTowers.length; i++) {
    drawTower(otherTowers[i]);
  }

  if (isGameOver) {
    context.fillStyle = "red";
    context.font = "50px Ariel";
    context.fillText("Game over!", 170, 250);
  }

  // tuk naprogramirai kakvo da se risuva
}
output = "";

function keyup(key) {
  // Show the pressed keycode in the console
  //test redirect
  //location.href = "https://www.google.com";

  console.log("Pressed", key);
  if (mapEditMode == 1) {
    if (key == 32) {
      nodes.push(new node(mouseX, mouseY));
      output = "[";
      foriin(nodes, () => {
        output += ", new node(" + nodes[i].x + "," + nodes[i].y + ")";
      });

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
  let numOfCurrentlydragging = 0;
  foriin(spawners, () => {
    if (spawners[i].currentlyDragging) {
      numOfCurrentlydragging++;
    }
  });
  if (numOfCurrentlydragging == 0) {
    foriin(spawners, () => {
      spawners[i].mouseDownUpdate();
    });
  }
}
function mouseup() {
  foriin(upgradeboxes, () => {
    upgradeboxes[i].checkMouseUpCollision(() => {
      if (selectedTower != -1) {
        if (money >= towers[selectedTower].price[i]) {
          if (i == 0) {
            towers[selectedTower].shootingSpeed = Math.floor(
              towers[selectedTower].shootingSpeed / 1.1
            );
          }

          if (i == 1) {
            towers[selectedTower].dmg += 5;
          }

          if (i == 2) {
            towers[selectedTower].range += 5;
          }
          if (i < 3) {
            money -= towers[selectedTower].price[i];

            towers[selectedTower].price[i] = Math.round(
              towers[selectedTower].price[i] * 1.4
            );
          }
        }
        if (i == 3) {
          if (towers[selectedTower].targetMode < 3) {
            towers[selectedTower].targetMode++;
          } else {
            towers[selectedTower].targetMode = 0;
          }
        }
      }
    });
  });
  foriin(spawners, () => {
    spawners[i].mouseUpUpdate();
  });

  numOfCollisions = 0;
  towerToBeSelected = 0;

  if (towers.length > 0) {
    foriin(towers, () => {
      if (
        areColliding(mouseX, mouseY, 10, 10, towers[i].x, towers[i].y, 64, 64)
      ) {
        numOfCollisions++;
        towerToBeSelected = i;
      }
    });

    if (numOfCollisions > 0) {
      foriin(towers, () => {
        towers[i].isSelected = 0;
      });

      towers[towerToBeSelected].isSelected = 1;
      selectedTower = towerToBeSelected;
    } else {
      /*
      foriin(towers, () => {
        towers[i].isSelected = 0;
      });*/
    }
  }

  // Show coordinates of mouse on click
  console.log("Mouse clicked at", mouseX, mouseY);
}
