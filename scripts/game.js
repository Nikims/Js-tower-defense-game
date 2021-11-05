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
health = 200;
waves = [];
currentLevel = 0;
isGameOver = false;
deltaMouseX = 0;
deltaMouseY = 0;

waves.push({ time: 100, number: 20, health: 100 });
waves.push({ time: 1000, number: 0, health: 100 });
waves.push({ time: 40, number: 40, health: 200 });
waves.push({ time: 1000, number: 0, health: 100 });
waves.push({ time: 30, number: 70, health: 300 });
waves.push({ time: 1000, number: 0, health: 100 });
waves.push({ time: 20, number: 100, health: 400 });
waves.push({ time: 4, number: Infinity, health: 500 });
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

testSpawner = new towerSpawner(700, 100, "main");
spikeTowerSpawner = new towerSpawner(800, 100, "spike");
sniperSpawner = new towerSpawner(900, 100, "sniper");
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
  if (!isGameOver) {
    testSpawner.updatePos();
    spikeTowerSpawner.updatePos();
    sniperSpawner.updatePos();

    updates++;
    foriin(bullets, () => {
      bullets[i].flyTo();
    });

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

    // for (i = 0; i < towers.length; i++) {
    //   towers[i].aimAt();
    // }
    // Napisanoto tuk se izpulnqva otnovo i otnovo mnogo puti v sekunda
  }
}
function draw() {
  context.drawImage(mapImgs[currentLevel], 0, 0, 600, 600);
  if (enemies.length > 0) {
    foriin(enemies, () => {
      enemies[i].drawSelf();
    });
  }
  foriin(towers, () => {
    towers[i].drawSelf();
    towers[i].aim();
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
    x;
  }
  foriin(bullets, () => {
    bullets[i].drawSelf();
  });
  // context.drawImage(towerPic, tempTower.x, tempTower.y, 60, 60);
  testSpawner.drawSelf();
  spikeTowerSpawner.drawSelf();
  sniperSpawner.drawSelf();

  context.font = "20px Ariel";
  context.fillText(money, 20, 20);
  if (towers.length > 0) {
    context.fillText(
      "Target mode: " + towers[selectedTower].targetMode,
      650,
      20
    );
    foriin(upgradeboxes, () => {
      upgradeboxes[i].drawSelf();
    });
  }
  context.fillText(health, 20, 50);

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
  testSpawner.mouseDownUpdate();
  spikeTowerSpawner.mouseDownUpdate();
  sniperSpawner.mouseDownUpdate();
}
function mouseup() {
  foriin(upgradeboxes, () => {
    upgradeboxes[i].checkMouseUpCollision(() => {
      if (selectedTower != -1) {
        if (i == 0) {
          if (money > 60) {
            towers[selectedTower].shootingSpeed = Math.floor(
              towers[selectedTower].shootingSpeed / 1.5
            );

            money -= 60;
          }
        }
        if (i == 1) {
          if (money > 60) {
            money -= 60;

            towers[selectedTower].dmg += 5;
          }
        }
        if (i == 2) {
          if (money > 60) {
            money -= 60;

            towers[selectedTower].range += 5;
          }
        }
        if (i == 3) {
          if (towers[selectedTower].targetMode == "closest") {
            towers[selectedTower].targetMode = "lowestHp";
          } else {
            towers[selectedTower].targetMode = "closest";
          }
        }
      }
    });
  });
  spikeTowerSpawner.mouseUpUpdate();
  testSpawner.mouseUpUpdate();
  sniperSpawner.mouseUpUpdate();

  numOfCollisions = 0;
  towerToBeSelected = 0;

  if (towers.length > 0) {
    foriin(towers, () => {
      if (
        areColliding(mouseX, mouseY, 10, 10, towers[i].x, towers[i].y, 20, 50)
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
