class button {
  x = 0;
  y = 0;
  sizeX = 0;
  sizeY = 0;
  text = "";
  isSelected = false;
  constructor(x, y, sizex, sizey, text) {
    this.x = x;
    this.y = y;
    this.sizeX = sizex;
    this.sizeY = sizey;
    this.text = text;
  }
  drawSelf() {
    context.fillStyle = "black";
    if (this.isSelected) {
      context.fillRect(
        this.x - 15,
        this.y - 15,
        this.sizeX + 30,
        this.sizeY + 30
      );
    } else {
      context.fillRect(this.x, this.y, this.sizeX, this.sizeY);
    }
    context.fillStyle = "white";
    context.font = "20px Ariel";
    context.fillText(
      this.text,
      this.x + this.sizeX / 3,
      this.y + this.sizeY / 2
    );
  }
  update() {
    if (
      areColliding(mouseX, mouseY, 1, 1, this.x, this.y, this.sizeX, this.sizeY)
    ) {
      this.isSelected = true;
    } else {
      this.isSelected = false;
    }
  }
  onMouseClick(action) {
    if (
      areColliding(mouseX, mouseY, 1, 1, this.x, this.y, this.sizeX, this.sizeY)
    ) {
      action();
    }
  }
}
buttons = [];
buttons.push(new button(300, 100, 200, 90, "start game"));
function update() {}

function draw() {
  for (i = 0; i < buttons.length; i++) {
    buttons[i].drawSelf();
    buttons[i].update();
  }
  context.fillStyle = "black";
  context.fillText(
    `This is still a prototype. \n Drag and drop the tower spawner on the right to make a new tower, press the upgrade buttons to upgrade the speed,damage, or range of a selected tower.`,
    0,
    300,
    1200
  );
}
function mouseup() {
  buttons[0].onMouseClick(() => {
    location.href = "gameStart.html";
  });
}
function keyup(key) {}
