let dt = 1 / 30.0;
let keys = {
  accel: 0,
  rot: 0,
  fire: false,
  restart: true,
  mouse_control: false,
};

let satelite_image;
let nave_image;
let lixo_images = [];
let terra_image;

class Satelite {
  constructor() {
    this.x = width/2;
    this.y = height/2;
    this.life = 15;
  }

  hit(bullet) {
    if (dist(this.x, this.y, bullet.x, bullet.y) < 32) {
      this.life -= 1;
      if (this.life < 0) this.life = 0;
      return true;
    }
    return false;
  }

  hit_l(lixo) {
    if (dist(this.x, this.y, lixo.x, lixo.y) < 32 + lixo.radius) {
      this.life -= 3;
      if (this.life < 0) this.life = 0;
      return true;
    }
    return false;
  }

  draw() {
    noStroke();
    
    image(
      satelite_image,
      this.x - 32, this.y - 32,
      64, 64,
      this.life>0?64*(floor(time*5)%4):0, 64*floor((1 - this.life/15)*3),
      64, 64
    );

    fill(255,0,0);
    rect(this.x - 24, this.y - 32 - 4, 48, 4);

    fill(0,255,0);
    rect(this.x - 24, this.y - 32 - 4, 48*this.life/15.0, 4);
  }
}

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

  is_out_of_bounds() {
    return this.x < -100 || this.x > width+100 || this.y < -100 || this.y > height+100;
  }
}

class Lixo {
  constructor(x,y, vx, vy) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.life = 3;
    this.sprite = floor(random(0, 4));
    this.radius = this.sprite!=2? 16 : 8;
    this.is_hit = 0;
  }

  update() {
    this.x += this.vx * dt;
    this.y += this.vy * dt;
  }

  draw() {
    // fill(100,50,0);
    // stroke(255);
    // ellipse(this.x, this.y, this.radius*2);
    image(
      lixo_images[this.sprite],
      this.x - this.radius, this.y - this.radius,
      this.radius*2, this.radius*2,
      this.radius*2*(3 - this.life),  this.radius*2*(this.is_hit>0?1:0),
      this.radius*2, this.radius*2
    );
    if(this.is_hit > 0) {
      this.is_hit -= 1;
    }
  }

  hit(bullet) {
    if (dist(bullet.x, bullet.y, this.x, this.y) < this.radius) {
      this.life-=1;
      const MASS_RATIO = 1/10;
      this.vx += bullet.vx*MASS_RATIO;
      this.vy += bullet.vy*MASS_RATIO;
      this.is_hit = 5;
      return true;
    }
    return false;
  }

  is_out_of_bounds() {
    return (this.vx < 0 && this.x < -this.radius)
      || (this.vx > 0 && this.x > width + this.radius)
      || (this.vy < 0 && this.y < -this.radius)
      || (this.vy > 0 && this.y > height + this.radius);
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
    this.life = 3;
  }

  update() {
    const ACCELL = 20;
    const TORQUE = 1.5;
    const ROT_LIMIT = 2.0

    let fx = sin(this.a);
    let fy = -cos(this.a);

    let sx = cos(this.a);
    let sy = sin(this.a);

    if (this.life > 0) {

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

          let px = this.x + fx*10 + 23.5*sx*(this.cannon==0? 1 : -1);
          let py = this.y + fy*10 + 23.5*sy*(this.cannon==0? 1 : -1);

          this.cannon = (this.cannon==0? 1 : 0);

          bullets.push(new Bullet(px ,py, fx*BULLET_VEL, fy*BULLET_VEL));
          this.fire_delay = FIRE_INT;
        }
      }
      this.fire_delay -= dt;
    }

    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.a += this.va * dt;

    this.va = this.va * 0.97;
    if (abs(this.va) > ROT_LIMIT) {
      this.va = this.va>0? ROT_LIMIT : -ROT_LIMIT;
    }
  }
  
  hit(lixo) {
    if(dist(lixo.x, lixo.y, this.x, this.y) < 32 + lixo.radius) {
      this.life -= 1;
      if (this.life <= 0) this.life = 0;

      let dx = this.x - lixo.x;
      let dy = this.y - lixo.y;

      let dvx = this.vx - lixo.vx;
      let dvy = this.vy - lixo.vy;

      let norm = sqrt(dx**2 + dy**2);

      dx = dx/norm;
      dy = dy/norm;

      let n = dvx*dx + dvy*dy;

      this.vx -= 1.0*n*dx;
      this.vy -= 1.0*n*dy;

      lixo.vx += 1.0*n*dx;
      lixo.vy += 1.0*n*dy;
    }
  }

  draw() {
    // fill(255);
    // stroke(0);
    // let fx = sin(this.a) * 20;
    // let fy = -cos(this.a) * 20;

    // let sx = cos(this.a) * 15;
    // let sy = sin(this.a) * 15;

    // triangle(
    //   this.x + fx,
    //   this.y + fy, 
    //   this.x - fx + sx,
    //   this.y - fy + sy,
    //   this.x - fx - sx,
    //   this.y - fy - sy
    // );

    let sx = (!keys.accel || this.life == 0)? 0 : 1 + (floor(time*5)%2);

    push();
    translate(floor(this.x), floor(this.y));
    rotate(this.a);
    translate(-32, -36);
    image(nave_image, 0, 0, 64, 72, 64*sx, 72*(3 - this.life), 64, 72);
    pop();
  }
}

let player;
let satelite;
let lixos = [];
let bullets = [];
let stars = [];

let lixo_delay = 0.0;
let time = 0.0;

function preload() {
  satelite_image = loadImage('assets/satelite.png');
  nave_image = loadImage('assets/nave.png');
  lixo_images[0] = loadImage('assets/lixo0.png');
  lixo_images[1] = loadImage('assets/lixo1.png');
  lixo_images[2] = loadImage('assets/lixo2.png');
  lixo_images[3] = loadImage('assets/lixo3.png');
  terra_image = loadImage('assets/terra.png');
}

function setup() {
  createCanvas(800, 600);

  document.exitPointerLock = document.exitPointerLock 
    || document.mozExitPointerLock
    || element.webkitRequestPointerLock;

  canvas.requestPointerLock = canvas.requestPointerLock 
    || canvas.mozRequestPointerLock
    || element.webkitRequestPointerLock;
  
  document.addEventListener("mousemove", moveCallback, false);


  background(10);

  for(let i = 0; i< 40; i++) {
    stars.push({x: random(width), y: random(height)});
  }

  init_new_game();
}

function moveCallback(e) {
  if (keys.mouse_control) {
    var movementX = e.movementX
      || e.mozMovementX
      || e.webkitMovementX
      || 0;
    var movementY = e.movementY
      || e.mozMovementY
      || e.webkitMovementY
      || 0;

    print(movementX);
    
    keys.accel = constrain(-movementY/12, 0, 1);
    keys.rot = constrain(movementX/12, -1, 1);
  }

}

var havePointerLock = 'pointerLockElement' in document
  || 'mozPointerLockElement' in document
  || 'webkitPointerLockElement' in document;

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
    case 82: //R
      keys.restart = true;
      break;
    case 77: //M
      if (havePointerLock) {
        keys.mouse_control = !keys.mouse_control;

        if(keys.mouse_control) {
          canvas.requestPointerLock()
        } else {
          document.exitPointerLock();
        }
      }

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

function init_new_game() {

  let teta = random(0, TWO_PI);
  let radius = min(height, width)/4.0;
  player = new Player(width / 2 + sin(teta)*radius, height / 2 + cos(teta)*radius);
  satelite = new Satelite();

  bullets = [];
  lixos = [];

  time = 0.0;
}

function draw() {

  const SPAWN_INT = 3.0;
  const LIXO_VEL = 20;
  if (lixo_delay > SPAWN_INT*random(0.95,1.05)){
    lixo_delay = 0.0;
    let dir = random(-0.3,0.3);
    let bottom = random()<0.5;
    lixos.push(new Lixo(
      random(width),
      bottom? height+200 : -200,
      LIXO_VEL*sin(dir),
      (bottom?-1:1)*LIXO_VEL*cos(dir))
    );
  }
  lixo_delay += dt;
  
  player.update();
  for (let i = lixos.length - 1; i >= 0; i--) {
    lixos[i].update();
    player.hit(lixos[i]);
    if (lixos[i].is_out_of_bounds()) {
      lixos.splice(i,1);
      continue;
    }

    if (satelite.hit_l(lixos[i])) {
      lixos.splice(i,1);
    }
  }
  for (let i = bullets.length - 1; i >= 0; i--) {
    bullets[i].update();
    if (bullets[i].is_out_of_bounds()) {
      bullets.splice(i,1);
      continue;
    }

    if (satelite.hit(bullets[i])) {
      bullets.splice(i,1);
      continue;
    }

    for (let j = lixos.length-1; j >= 0; j--) {
      let hit = false;
      if (lixos[j].hit(bullets[i])) {
        bullets.splice(i,1);
        hit = true;
      }
      if (lixos[j].life <= 0){
        lixos.splice(j,1);
      }
      if (hit) break;
    }
  }

  //>> DRAW

  background(10);

  // noStroke();
  // fill(255);
  stroke(255);

  for(let i = 0; i < stars.length; i++){
    // rect()
    point(stars[i].x, stars[i].y);
  }

  image(terra_image, floor(width/4) - 64, height/2 - 64, 128, 128, 128*(floor(time)%3), 0, 128, 128);

  for (let i = bullets.length - 1; i >= 0; i--) {
    bullets[i].draw();
  }
  strokeWeight(1);
  satelite.draw();
  player.draw();
  for (let i = 0; i < lixos.length; i++) {
    lixos[i].draw();
  }

  if (satelite.life <= 0 || player.life <= 0) {
    fill(0, 0, 0, 40);
    rect(0, 0, width, height);
    textAlign(CENTER,CENTER);
    textSize(64);
    fill(255,0,0);
    stroke(0);
    strokeWeight(3);
    text("YOU FAIL!!!!", width/2, height/3);
    textSize(32);
    text(`you protect the satellite for ${floor(time)} seconds`, width/2, height/2);
    textSize(16);
    text('press R to restart', width/2, height/2 + 64 + 32);
  } else {
    time += dt;
    textSize(32);
    textAlign(LEFT,TOP); 
    fill(255,255,0);
    stroke(0);
    text(`SCORE: ${floor(time)}`, 10, 10);
    textAlign(RIGHT,TOP); 
    text(`LIFES: ${floor(player.life-1)}x`, width - 10, 10);
  }
  strokeWeight(1);

  if (keys.restart) {
    keys.restart = false;
    init_new_game();
  }
}