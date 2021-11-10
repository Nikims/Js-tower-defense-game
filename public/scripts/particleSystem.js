updates = 0;
mousePositions = [];
clock = "tick";
class Particle {
  x = 0;
  y = 0;
  speedX = 0;
  speedY = 0;
  acellX = 0;
  acellY = 0;
  source = {};
  beenAliveFor = 0;
  applyMomentum(momx, momY) {
    this.speedX += momx;
    this.speedY += momY;
  }
  applyForce(forceX, forceY) {
    this.acellX += forceX;
    this.acellY += forceY;
  }
  constructor(source) {
    this.x = source.x;
    this.y = source.y;
    this.source = source;
    this.speedX = Math.random() * 5 - 2.5;
    this.speedY = Math.random() * 5 - 2.5;
    // this.applyForce(0, 0.1);
  }
  update() {
    this.beenAliveFor++;
    this.x += this.speedX;
    this.y += this.speedY;
    this.speedX += this.acellX;
    this.speedY += this.acellY;
    // if (this.y > this.source.y + 30) {
    //   this.speedY = 0;
    //   this.speedX = 0;
    // }
  }
  drawSelf() {
    context.fillRect(this.x, this.y, 5, 5);
  }
}

class ParticleSystem {
  source;
  particles = [];
  constructor(source) {
    this.source = source;
    for (let i = 0; i < 20 + Math.round(Math.random() * 80); i++) {
      this.particles.push(new Particle(this.source));
    }
  }
  updateParticles() {
    if (this.particles.length < 1) {
      particleSystems.splice(particleSystems.indexOf(this), 1);
    }
    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].update();

      if (
        this.particles[i].beenAliveFor >
        30 + Math.round(Math.random() * 20)
      ) {
        this.particles.splice(i, 1);
      }
    }
  }
  drawParticles() {
    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].drawSelf();
    }
  }
}
particleSystems = [];
