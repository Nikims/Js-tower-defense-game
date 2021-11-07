class tower {
  shootingSpeed = 50;
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
  lowestHp = [];
  currentRotation = 0;
  dmg = 30;
  targetMode = "lowestHp";
  price = [100, 100, 100];

  constructor(x, y, type, id) {
    this.type = type;
    this.x = x;
    this.y = y;
    this.myId = id;
    if (this.type == "sniper") {
      this.range = 900;
      this.dmg = 30;
      this.shootingSpeed = 120;
    }
    if (this.type == "electric") {
      this.dmg = 1;
    }
    if (this.type == "shockwave") {
      this.dmg = 10;
      this.shootingSpeed = 100;
    }
    // drawCircle(this.range);

    // for (let i = 0; i < towers.length; i++) {
    //   towers[i].isSelected = 0;
    // }
    // this.isSelected = 1;
  }
  drawSelf() {
    // for (let i = 0; i < circlesCoords.get(this.range).length; i++) {
    //   context.fillRect(
    //     circlesCoords.get(this.range)[i].xCoords + this.x,
    //     circlesCoords.get(this.range)[i].yCoords + this.y,
    //     5,
    //     5
    //   );
    // }
    if (this.isSelected == 1 && this.type != "sniper") {
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
    if (this.type != "electric" && this.type != "shockwave") {
      context.save();
      context.translate(this.x + 20, this.y + 25);
      try {
        if (this.closestDistance[1] != 9999) {
          let nextRotaion =
            Math.atan2(
              this.y -
                (this.targetMode == "closest"
                  ? this.closestDistance[1].y
                  : this.lowestHp[1].y + 15),
              this.x -
                (this.targetMode == "closest"
                  ? this.closestDistance[1].x
                  : this.lowestHp[1].x + 15)
            ) -
            Math.PI / 2;
          if (
            !areColliding(
              this.currentRotation,
              1,
              0.1,
              0.1,
              nextRotaion,
              1,
              0.1,
              0,
              1
            )
          ) {
            if (this.currentRotation < nextRotaion) {
              this.currentRotation += 0.1;
            } else {
              this.currentRotation -= 0.1;
            }
          }
        }
      } catch (e) {
        //console.log("cope");
      }

      if (this.closestDistance[1] != undefined) {
        // console.log(enemies[towers[0].closestDistance[1]].x);
        try {
          context.rotate(this.currentRotation + (0 * Math.PI) / 180);
        } catch (e) {
          //console.log("cope");
        }
      }
    }
    if (this.type == "electric") {
      context.drawImage(electricTowerPic, this.x, this.y, 55, 64);
    } else if (this.type == "shockwave") {
      context.drawImage(shockWavePic, this.x, this.y, 64, 64);
    } else {
      context.drawImage(towerPic, -20, -25, 39, 50);
    }
    context.restore();

    context.fillStyle = "rgb(0,0,0,50)";
  }
  aim() {
    this.hasntShotIn++;
    if (this.hasntShotIn > this.shootingSpeed + 1) {
      this.hasntShotIn = 0;
    }
    this.closestDistance = [9999, 9999];
    this.lowestHp = [9999, 9999];

    this.enemiesInRange = [];
    for (let i = 0; i < enemies.length; i++) {
      let distanceToMe = Math.sqrt(
        Math.pow(this.x - enemies[i].x, 2) + Math.pow(this.y - enemies[i].y, 2)
      );
      if (distanceToMe < this.range) {
        this.enemiesInRange.push(enemies[i]);
      }
    }
    for (let i = 0; i < this.enemiesInRange.length; i++) {
      let distanceToMe = Math.sqrt(
        Math.pow(this.x - this.enemiesInRange[i].x, 2) +
          Math.pow(this.y - this.enemiesInRange[i].y, 2)
      );
      if (distanceToMe < this.closestDistance[0]) {
        this.closestDistance = [distanceToMe, this.enemiesInRange[i]];
      }
      if (this.enemiesInRange[i].health < this.lowestHp[0]) {
        this.lowestHp = [this.enemiesInRange[i].health, this.enemiesInRange[i]];
      }
    }

    try {
      if (
        this.hasntShotIn == this.shootingSpeed &&
        this.closestDistance[0] < this.range
      ) {
        //console.log(this.dmg);
        if (this.type == "main" || this.type == "sniper") {
          if (this.targetMode == "lowestHp") {
            bullets[0].push(new bullet(this, this.lowestHp[1], this.dmg));
          }
          if (this.targetMode == "closest") {
            bullets[0].push(
              new bullet(this, this.closestDistance[1], this.dmg)
            );
          }
        }
        if (this.type == "shockwave") {
          for (let i = 0; i < 370; i += 10) {
            bullets[1].push(
              new bullet(
                {
                  x: this.x,
                  y: this.y,
                  type: this.type,
                  range: this.range,
                  dmg: this.dmg,
                },
                {
                  x: this.x + this.range * Math.cos((i * Math.PI) / 180),
                  y: this.y + this.range * Math.sin((i * Math.PI) / 180),
                },
                this.dmg
              )
            );
          }
        }
        if (this.type == "electric") {
          arcs.push(new arc(this, this.range));
        }
      }
    } catch (e) {
      //console.log("cope");
    }
    //     enemies[closestDistance[1]].health -= 20;
  }
}
