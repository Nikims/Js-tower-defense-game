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
  dmg = 5;

  constructor(x, y, type, id) {
    this.type = type;
    this.x = x;
    this.y = y;
    this.myId = id;
    if (this.type == "sniper") {
      this.range = 900;
      this.dmg = 70;
      this.shootingSpeed = 40;
    }
    // drawCircle(this.range);

    // for (let i = 0; i < towers.length; i++) {
    //   towers[i].isSelected = 0;
    // }
    // this.isSelected = 1;
  }
  drawSelf() {
    if (!this.isSelected == 1 && towers.indexOf(this) == 1) {
      console.log("dob");
    }
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
    } catch (e) {
      //console.log("cope");
    }
    if (this.closestDistance[1] != undefined) {
      // console.log(enemies[towers[0].closestDistance[1]].x);
      try {
        context.rotate(this.currentRotation);
      } catch (e) {
        //console.log("cope");
      }
    }

    context.drawImage(towerPic, -32, -32, 64, 64);
    context.restore();
    context.fillStyle = "rgb(0,0,0,50)";
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
      if (distanceToMe < this.range + 15) {
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
      //console.log(this.dmg);
      if (this.type == "main" || this.type == "sniper") {
        bullets.push(
          new bullet(this, enemies[this.closestDistance[1]], this.dmg)
        );
      }
      if (this.type == "spike") {
        for (let i = 0; i < 360; i += 4) {
          bullets.push(
            new bullet(
              this,
              {
                x: this.x + this.range * Math.cos((i * Math.PI) / 180),
                y: this.y + this.range * Math.sin((i * Math.PI) / 180),
              },
              this.dmg
            )
          );
        }
      }
      //     enemies[closestDistance[1]].health -= 20;
    }
  }
}
