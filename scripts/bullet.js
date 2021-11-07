class bullet {
  dmg = 0;
  x = 0;
  y = 0;
  source = 0;
  target = 0;
  IremberTarget = {};
  bulletRotation;
  canTakeDamage = true;
  constructor(source, target, dmg) {
    this.x = source.x + 20;
    this.y = source.y + 30;
    this.source = source;
    this.dmg = source.dmg;
    this.target = target;
    this.IremberTarget.x = target.x;
    this.IremberTarget.y = target.y;
    this.IremberTarget.x -= (this.x - this.target.x) * 4;
    this.IremberTarget.y -= (this.y - this.target.y) * 4;
    this.bulletRotation =
      Math.atan2(this.y - this.target.y, this.x - this.target.x) - Math.PI / 2;
  }
  flyTo() {
    let xDistToNextNode = this.x - this.target.x;
    let yDistToNextNode = this.y - this.target.y;
    let dist = Math.sqrt(
      Math.pow(xDistToNextNode, 2) + Math.pow(yDistToNextNode, 2)
    );
    this.x -= 7 * Math.sin(xDistToNextNode / dist);
    this.y -= 7 * Math.sin(yDistToNextNode / dist);
    if (enemies.length != 0) {
      for (let i = 0; i < enemies.length; i++) {
        if (this.canTakeDamage) {
          if (
            areColliding(
              this.x,
              this.y,
              5,
              5,
              enemies[i].x,
              enemies[i].y,
              30,
              30
            )
          ) {
            if (enemies[i].health - this.dmg > 0) {
              enemies[i].health -= this.dmg;
            } else {
              enemies[i].health = -1;
              money += 40;
              particleSystems.push(
                new ParticleSystem({ x: this.x, y: this.y })
              );
            }

            // if (this.source.type == "shockwave") {
            //   //console.log("lmao" + this.dmg);
            //   // bullets[0].splice(bullets[0].indexOf(this));
            // } else if (
            //   this.source.type == "main" ||
            //   this.source.type == "sniper"
            // ) {
            if (this.canTakeDamage == false) {
              console.log("shit");
            }
            if (this.canTakeDamage) {
              this.canTakeDamage = false;
              if (this.type != "shockwave") {
                bullets[1].splice(bullets.indexOf(this), 1);
              }
              // bullets[1].splice(bullets[1].indexOf(this));
            }
            break;
          }
        }
      }
    }

    if (
      areColliding(this.x, this.y, 5, 5, this.target.x, this.target.y, 30, 30)
    ) {
      if (this.source.type == "shockwave") {
        bullets[1].splice(bullets[1].indexOf(this), 1);
      } else if (this.source.type == "sniper" || this.source.type == "main") {
        bullets[0].splice(bullets[0].indexOf(this), 1);
      }
    }
    // this.y += 5 * Math.sin(this.y / dist);
    else {
      //bullets.splice(bullets.indexOf(this), 1);
    }
  }
  drawSelf() {
    context.save();
    context.translate(this.x, this.y);
    context.rotate(this.bulletRotation - 45 * (Math.PI / 2));
    context.drawImage(
      this.source.type == "shockwave" ? plasmabulletPic : bulletPic,
      0,
      0,
      this.source.type == "shockwave" ? 40 : 20,
      this.source.type == "shockwave" ? 20 : 10
    );
    context.restore();
  }
}
