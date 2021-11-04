class enemy {
  x = 0;
  y = 0;
  currentlyFollowing = 0;
  myId = 0;
  health = 100;
  speed = 1;
  trueId = 0;
  didSomeoneTellMeToDrawMyselfRed = 0;
  rotation = 180;
  maxHealth = 100;
  constructor(x, y, id, health) {
    this.x = x;
    this.y = y;
    this.myId = id;
    this.maxHealth = health;
    this.health = this.maxHealth;
  }
  followNext() {
    let xDistToNextNode = this.x - nodes[this.currentlyFollowing].x;
    let yDistToNextNode = this.y - nodes[this.currentlyFollowing].y;
    let dist = Math.sqrt(
      Math.pow(xDistToNextNode, 2) + Math.pow(yDistToNextNode, 2)
    );
    this.x -= this.speed * Math.sin(xDistToNextNode / dist);
    this.y -= this.speed * Math.sin(yDistToNextNode / dist);
    if (
      areColliding(
        this.x,
        this.y,
        2,
        2,
        nodes[this.currentlyFollowing].x,
        nodes[this.currentlyFollowing].y,
        2,
        2
      )
    ) {
      if (this.currentlyFollowing < nodes.length - 1) {
        this.currentlyFollowing++;
        if (
          this.currentlyFollowing == 1 ||
          this.currentlyFollowing == 5 ||
          this.currentlyFollowing == 6
        ) {
          this.rotation -= 90;
        }
        if (
          this.currentlyFollowing == 2 ||
          this.currentlyFollowing == 3 ||
          this.currentlyFollowing == 4
        ) {
          this.rotation += 90;
        }
      } else {
        this.killSelf();
        health -= 20;
      }
    }
  }
  drawSelf() {
    if (this.health < 0) {
      this.money += 20;
      this.killSelf();
    }

    //context.filter = "none";

    context.save();
    context.translate(this.x, this.y);
    context.rotate(this.rotation * (Math.PI / 180));
    context.drawImage(robotPic, -15, -15, 30, 30);
    context.restore();
    if (this.didSomeoneTellMeToDrawMyselfRed == 1) {
      context.fillStyle = "red";
      context.globalAlpha = 0.2;
      context.fillRect(this.x - 15, this.y - 15, 30, 30);
      context.globalAlpha = 1;

      this.didSomeoneTellMeToDrawMyselfRed = 0;
    } else {
      context.fillStyle = "black";
    }

    if (this.health < this.maxHealth) {
      context.fillStyle = "rgb(5, 5, 5)";
      context.fillRect(this.x - 2.5, this.y - 22, 55, 15);
      context.fillStyle = "green";
      context.fillRect(
        this.x,
        this.y - 20,
        (this.health / this.maxHealth) * 50,
        10
      );
      context.fillStyle = "black";
    }
  }
  killSelf() {
    enemies.splice(enemies.indexOf(this), 1);
  }
}
