class bullet {
  dmg = 0;
  x = 0;
  y = 0;
  source = 0;
  target = 0;
  IremberTarget = {};
  bulletRotation;
  canTakeDamageTo = [];
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

    for (let i = 0; i < this.source.enemiesInRange.length; i++) {
      if (this.source.enemiesInRange[i].health > 0) {
        this.canTakeDamageTo[this.source.enemiesInRange[i].trueId] = true;
      }
    }
  }
  flyTo() {
    let xDistToNextNode = this.x - this.target.x;
    let yDistToNextNode = this.y - this.target.y;
    let dist = Math.sqrt(
      Math.pow(xDistToNextNode, 2) + Math.pow(yDistToNextNode, 2)
    );
    let speedX = 7 * Math.sin(xDistToNextNode / dist);
    let speedY = 7 * Math.cos(yDistToNextNode / dist);
    this.x -= 7 * Math.sin(xDistToNextNode / dist);
    this.y -= 7 * Math.sin(yDistToNextNode / dist);
    if (this.source.enemiesInRange.length != 0) {
      for (let i = 0; i < this.source.enemiesInRange.length; i++) {
        if (this.canTakeDamageTo[this.source.enemiesInRange[i].trueId]) {
          if (
            areColliding(
              this.x,
              this.y,
              5,
              5,
              this.source.enemiesInRange[i].x,
              this.source.enemiesInRange[i].y,
              30,
              30
            )
          ) {
            if (this.source.enemiesInRange[i].health - this.dmg > 0) {
              this.source.enemiesInRange[i].health -= this.dmg;
            } else {
              this.source.enemiesInRange[i].health = -1;
              money += 40;
              particleSystems.push(
                new ParticleSystem({ x: this.x, y: this.y })
              );
              for (
                let j = 0;
                j <
                particleSystems[particleSystems.length - 1].particles.length;
                j++
              ) {
                if (this.source.type == "shockwave") {
                  particleSystems[particleSystems.length - 1].particles[
                    j
                  ].applyMomentum(-1 * speedX, -1 * speedY);
                } else {
                  particleSystems[particleSystems.length - 1].particles[
                    j
                  ].applyMomentum(-1 * speedX, 1 * speedY);
                }
              }
            }

            // if (this.source.type == "shockwave") {
            //   //console.log("lmao" + this.dmg);
            //   // bullets[0].splice(bullets[0].indexOf(this));
            // } else if (
            //   this.source.type == "main" ||
            //   this.source.type == "sniper"
            // ) {
            this.canTakeDamageTo[enemies[i].trueId] = false;
            if (this.source.type == "shockwave") {
              for (let j = 0; j < this.source.bullets.length; j++) {
                this.source.bullets[j].canTakeDamageTo[
                  this.source.enemiesInRange[i].trueId
                ] = false;
              }
            }

            // bullets[1].splice(bullets[1].indexOf(this));

            break;
          }
        }
      }
    }

    if (
      areColliding(this.x, this.y, 5, 5, this.target.x, this.target.y, 30, 30)
    ) {
      this.source.bullets.splice(bullets[1].indexOf(this), 1);
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
