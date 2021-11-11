//a 2d vector class
class vector2d {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  //adds two vectors
  add(v) {
    return new vector2d(this.x + v.x, this.y + v.y);
  }
  //subtracts two vectors
  sub(v) {
    return new vector2d(this.x - v.x, this.y - v.y);
  }
  //multiplies two vectors
  mul(v) {
    return new vector2d(this.x * v.x, this.y * v.y);
  }
  //divides two vectors
  div(v) {
    return new vector2d(this.x / v.x, this.y / v.y);
  }
  //returns the magnitude of the vector
  mag() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
  //returns the angle of the vector
  angle() {
    return Math.atan2(this.y, this.x);
  }
  //normalizes the vector
  normalize() {
    var mag = this.mag();
    return new vector2d(this.x / mag, this.y / mag);
  }
}
