class bullet {
  dmg = 0;
  x = 0;
  y = 0;
  source = 0;
  target = 0;
  IremberTarget = {};
  bulletRotation;
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
    this.bulletRotation =
      Math.atan2(this.y - this.target.y, this.x - this.target.x) - Math.PI / 2;
  }
  flyTo() {
    let xDistToNextNode = this.x - this.target.x;
    let yDistToNextNode = this.y - this.target.y;
    let dist = Math.sqrt(
      Math.pow(xDistToNextNode, 2) + Math.pow(yDistToNextNode, 2)
    );
    this.x -= 6 * Math.sin(xDistToNextNode / dist);
    this.y -= 6 * Math.sin(yDistToNextNode / dist);
    if (enemies.length != 0) {
      for (let i = 0; i < enemies.length; i++) {
        if (
          areColliding(
            this.x,
            this.y,
            10,
            10,
            enemies[i].x,
            enemies[i].y,
            30,
            30
          )
        ) {
          if (enemies[i].health - this.dmg > 0) {
            money += this.dmg * 2;
            enemies[i].health -= this.dmg;
          } else {
            enemies[i].health = -1;
            money += enemies[i].health * 2;
          }
          //console.log("lmao" + this.dmg);
          bullets.splice(bullets.indexOf(this), 1);
        }
      }
    }

    if (
      areColliding(this.x, this.y, 5, 5, this.target.x, this.target.y, 30, 30)
    ) {
      bullets.splice(bullets.indexOf(this), 1);
    }

    // this.y += 5 * Math.sin(this.y / dist);
    else {
      //bullets.splice(bullets.indexOf(this), 1);
    }
  }
  drawSelf() {
    context.rotate(this.bulletRotation);
    context.drawImage(bulletPic, this.x, this.y, 31, 14);
    context.restore();
  }
}
