let dt = 1 / 30.0;
let keys = {
  accel: 0,
  rot: 0,
  fire: false
};

class Bullet {
  constructor(x,y, vx, vy) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
  }

  update() {
    this.x += this.vx * dt;
    this.y += this.vy * dt;
  }

  draw() {
    stroke(0,255,0);
    strokeWeight(2);

    let norm = sqrt(this.vx**2 + this.vy**2);
    let fx = 15*this.vx/norm;
    let fy = 15*this.vy/norm;

    line(this.x, this.y, this.x - fx, this.y - fy);
  }
}

const LIXO_RADIUS = 15;

class Lixo {
  constructor(x,y, vx, vy) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
  }

  update() {
    this.x += this.vx * dt;
    this.y += this.vy * dt;
  }

  draw() {
    fill(100,50,0);
    stroke(255);
    ellipse(this.x, this.y, LIXO_RADIUS*2);
  }

  is_out_of_bounds() {
    return (this.vx < 0 && this.x < -LIXO_RADIUS)
      || (this.vx > 0 && this.x > width + LIXO_RADIUS)
      || (this.vy < 0 && this.y < -LIXO_RADIUS)
      || (this.vy > 0 && this.y > height + LIXO_RADIUS);

  }
}

const FIRE_INT = 0.25;

class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.a = 0;
    this.va = 0;
    this.fire_delay = 0.0;
    this.cannon = 0;
  }

  update() {
    const ACCELL = 40;
    const TORQUE = 1.5;
    const ROT_LIMIT = 2.0

    let fx = sin(this.a);
    let fy = -cos(this.a);

    let sx = cos(this.a);
    let sy = sin(this.a);

    if (keys.accel > 0) {
      this.vx += fx * ACCELL * dt;
      this.vy += fy * ACCELL * dt;
    }
    if (keys.rot != 0) {
      this.va += keys.rot * TORQUE * dt;
    }
    if (keys.fire) {
      if (this.fire_delay <= 0.0) {
        const BULLET_VEL = 120;

        let px = this.x + fx*10 + 10*sx*(this.cannon==0? 1 : -1);
        let py = this.y + fy*10 + 10*sy*(this.cannon==0? 1 : -1);

        this.cannon = (this.cannon==0? 1 : 0);

        bullets.push(new Bullet(px ,py, fx*BULLET_VEL, fy*BULLET_VEL));
        this.fire_delay = FIRE_INT;
        print("FIRE!!");
      }
    }
    this.fire_delay -= dt;

    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.a += this.va * dt;

    this.va = this.va * 0.97;
    if (abs(this.va) > ROT_LIMIT) {
      this.va = this.va>0? ROT_LIMIT : -ROT_LIMIT;
    }
  }

  draw() {
    fill(255);
    stroke(0);
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
let lixos = [];
let bullets = [];

let time = 0.0;

function setup() {
  createCanvas(800, 600);
  background(10);

  player = new Player(width / 2, height / 2);
  // createLoop({
  //   duration:10,
  //   framesPerSecond: 30,
  //   gif:true
  // })
}

function keyPressed() {
  switch (keyCode) {
    case 38: //UP_ARROW
      keys.accel = 1;
      break;
    case 37: //LEFT_ARROW
      keys.rot = -1;
      break;
    case 39: //RIGHT_ARROW
      keys.rot = 1;
      break;
    case 32: //ESPACE
      keys.fire = true;
      break;

    case 80: //P
      saveCanvas();
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
      break;
    case 39: //RIGHT_ARROW
      if (keys.rot == 1) {
        keys.rot = 0;
      }
      break;
    case 32: //ESPACE
      keys.fire = false;
      break;
  }
}

function draw() {
  background(10);

  const SPAWN_INT = 3.0;
  const LIXO_VEL = 20;
  if (time > SPAWN_INT*random(0.95,1.05)){
    time = 0.0;
    let dir = random(-0.3,0.3);
    lixos.push(new Lixo(random(width),-100, LIXO_VEL*sin(dir), LIXO_VEL*cos(dir)));
  }
  time += dt;
  
  player.update();
  for (let i = lixos.length - 1; i >= 0; i--) {
    lixos[i].update();
    if (lixos[i].is_out_of_bounds()) {
      lixos.splice(i,1);
    }
  }
  for (let i = bullets.length - 1; i >= 0; i--) {
    bullets[i].update();
  }


  for (let i = bullets.length - 1; i >= 0; i--) {
    bullets[i].draw();
  }
  strokeWeight(1);
  player.draw();
  for (let i = 0; i < lixos.length; i++) {
    lixos[i].draw();
  }
}
