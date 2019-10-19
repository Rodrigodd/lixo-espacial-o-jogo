let dt = 1 / 30.0;
let keys = {
  accel: 0,
  rot: 0,
  fire: false
};

class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.a = 0;
    this.va = 0;
  }

  update() {
    const ACCELL = 40;
    const TORQUE = 1.5;

    let fx = sin(this.a);
    let fy = -cos(this.a);

    if (keys.accel > 0) {
      this.vx += fx * ACCELL * dt;
      this.vy += fy * ACCELL * dt;
    }
    if (keys.rot != 0) {
      this.va += keys.rot * TORQUE * dt;
    }

    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.a += this.va * dt;

    this.va = this.va * 0.97;
  }

  draw() {
    let fx = sin(this.a) * 20;
    let fy = -cos(this.a) * 20;

    let sx = cos(this.a) * 15;
    let sy = sin(this.a) * 15;

    triangle(
      this.x + fx,
      this.y + fy,
      this.x - fx + sx,
      this.y - fy + sy,
      this.x - fx - sx,
      this.y - fy - sy
    );
  }
}

let player;

function setup() {
  createCanvas(800, 600);
  background(10);

  player = new Player(width / 2, height / 2);
  createLoop({
    duration:10,
    framesPerSecond: 30,
    gif:true
  })
}

function keyPressed() {
  switch (keyCode) {
    case 38: //UP_ARROW
      keys.accel = 1;
      break;
    case 37: //LEFT_ARROW
      keys.rot = -1;
      print(keys.rot);
      break;
    case 39: //RIGHT_ARROW
      keys.rot = 1;
      print(keys.rot);
      break;
    case 32: //ESPACE
      keys.fire = true;
      break;
  }
}

function keyReleased() {
  switch (keyCode) {
    case 38: //UP_ARROW
      keys.accel = 0;
      break;
    case 37: //LEFT_ARROW
      if (keys.rot == -1) {
        keys.rot = 0;
      }
      print(keys.rot);
      break;
    case 39: //RIGHT_ARROW
      if (keys.rot == 1) {
        keys.rot = 0;
      }
      print(keys.rot);
      break;
    case 32: //ESPACE
      keys.fire = false;
      break;
  }
}

function draw() {
  background(10);
  player.update();

  player.draw();
}
