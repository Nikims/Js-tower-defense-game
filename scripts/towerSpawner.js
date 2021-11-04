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
      console.log(mouseX - this.x);
      this.x = mouseX - 30;
      this.y = mouseY - 30;

      //this.y = deltaMouseY +  (deltaMouseY - this.y);
      deltaMouseX = mouseX;
      deltaMouseY = mouseY;
    }
  }
  mouseDownUpdate() {
    if (areColliding(this.x, this.y, 100, 100, mouseX, mouseY, 5, 5)) {
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
        foriin(towers, () => {
          if (
            Math.sqrt(
              Math.pow(mouseX - 10 - towers[i].x, 2) +
                Math.pow(mouseY - 30 - towers[i].y, 2)
            ) <
            towers[i].range / 3
          ) {
            numOfCollisions++;
          }
        });
        if (numOfCollisions == 0) {
          towers.push(
            new tower(mouseX - 7, mouseY - 15, this.type, towers.length)
          );
          if (this.type == "spike") {
            towers[towers.length - 1].dmg = 2;
          }
          money -= 200;
        }
      }
    }
    this.currentlyDragging = false;
  }
}
