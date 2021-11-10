lightingPic = new Image();
lightingPic.src = "lighting.png";
class arc {
  source = null;
  range = 0;
  nodes = [];
  updatesAtStart = updates;
  damage = 0;
  constructor(source, range) {
    this.source = source;
    this.range = range;
    this.nodes = source.enemiesInRange;
    this.nodes.unshift({ x: source.x + 15, y: source.y + 10 });
    this.damage = source.dmg;
  }
  updateArc() {
    if (updates < this.updatesAtStart + 15) {
      for (let i = 1; i < this.nodes.length; i++) {
        if (this.nodes[i].health - this.damage < 0) {
          this.nodes[i].health = -1;
          arcs.splice(arcs.indexOf(this), 1);

          money += 200;
        } else {
          this.nodes[i].health -= this.damage;
        }
      }
    } else {
      arcs.splice(arcs.indexOf(this), 1);
    }
  }
  drawSelf() {
    for (let i = 1; i < this.nodes.length; i++) {
      let rotationToNext = Math.atan2(
        this.nodes[i].y - this.nodes[i - 1].y,
        this.nodes[i].x - this.nodes[i - 1].x
      );
      let distToNext = Math.sqrt(
        Math.pow(this.nodes[i - 1].x - this.nodes[i].x, 2) +
          Math.pow(this.nodes[i - 1].y - this.nodes[i].y, 2)
      );
      context.save();
      context.translate(this.nodes[i - 1].x, this.nodes[i - 1].y);
      context.rotate(rotationToNext);
      context.drawImage(lightingPic, 0, 0, distToNext, 10);
      context.restore();
    }
  }
}
