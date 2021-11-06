class arc {
  source = null;
  range = 0;
  nodes = [];
  updatesAtStart = updates;
  constructor(source, range) {
    this.source = source;
    this.range = range;
    this.nodes = source.enemiesInRange;
    this.nodes.unshift(source);
    console.log(source);
  }
  updateArc() {
    if (updates < this.updatesAtStart + 15) {
      for (let i = 1; i < this.nodes.length; i++) {
        this.nodes[i].health -= 1;
      }
    } else {
      arcs.splice(arcs.indexOf(this), 1);
    }
  }
  drawSelf() {
    context.lineWidth = 5;
    for (let i = 1; i < this.nodes.length; i++) {
      drawLine(
        this.nodes[i - 1].x,
        this.nodes[i - 1].y,
        this.nodes[i].x,
        this.nodes[i].y
      );
    }
  }
}
