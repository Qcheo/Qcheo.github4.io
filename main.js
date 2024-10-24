const BALLS_COUNT = 25;
const BALL_SIZE_MIN = 10;
const BALL_SIZE_MAX = 20;
const BALL_SPEED_MAX = 7;

class Shape {
  constructor(x, y, velX, velY, exists) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.exists = exists;
  }
}

class Ball extends Shape {
  constructor(x, y, velX, velY, color, size, exists) {
    super(x, y, velX, velY, exists);
    this.color = color;
    this.size = size;
  }

  draw() {
    const ctx = myCanvas.getContext('2d');
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
  }

  update() {
    this.x += this.velX;
    this.y += this.velY;

    if (this.x + this.size >= canvas.width || this.x - this.size <= 0) {
      this.velX = -this.velX;
    }
    if (this.y + this.size >= canvas.height || this.y - this.size <= 0) {
      this.velY = -this.velY;
    }
  }

  collisionDetect() {
    for (let j = 0; j < balls.length; j++) {
      if (this !== balls[j] && balls[j].exists) {
        const dx = this.x - balls[j].x;
        const dy = this.y - balls[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < this.size + balls[j].size) {
          balls[j].color = this.color = randomColor();
        }
      }
    }
  }
}

class EvilCircle extends Shape {
  constructor(x, y, exists) {
    super(x, y, 20, 20, exists);
    this.color = "white";
    this.size = 10;
    this.setControls();
    this.addMouseEvents(); // 添加鼠标事件监听
  }

  draw() {
    const ctx = myCanvas.getContext('2d');
    ctx.beginPath();
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 3;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.stroke();
  }

  checkBounds() {
    if (this.x + this.size >= canvas.width) {
      this.x = canvas.width - this.size;
    } else if (this.x - this.size <= 0) {
      this.x = this.size;
    }
    if (this.y + this.size >= canvas.height) {
      this.y = canvas.height - this.size;
    } else if (this.y - this.size <= 0) {
      this.y = this.size;
    }
  }

  setControls() {
    window.onkeydown = (e) => {
      switch (e.key) {
        case "a":
        case "A":
        case "ArrowLeft":
          this.x -= 20;
          break;
        case "d":
        case "D":
        case "ArrowRight":
          this.x += 20;
          break;
        case "w":
        case "W":
        case "ArrowUp":
          this.y -= 20;
          break;
        case "s":
        case "S":
        case "ArrowDown":
          this.y += 20;
          break;
      }
    };
  }

  addMouseEvents() {
    canvas.addEventListener('mousedown', (e) => {
      this.mouseDown(e);
    });
    canvas.addEventListener('mousemove', (e) => {
      this.mouseMove(e);
    });
  }

  mouseDown(e) {
    const rect = canvas.getBoundingClientRect();
    this.x = e.clientX - rect.left;
    this.y = e.clientY - rect.top;
  }

  mouseMove(e) {
    const rect = canvas.getBoundingClientRect();
    this.x = e.clientX - rect.left;
    this.y = e.clientY - rect.top;
  }

  setColor(color) {
    this.color = color;
  }

  collisionDetect() {
    for (let j = 0; j < balls.length; j++) {
      if (balls[j].exists) {
        const dx = this.x - balls[j].x;
        const dy = this.y - balls[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < this.size + balls[j].size) {
          this.setColor(balls[j].color); // 更新恶魔圈的颜色
          balls[j].exists = false;
          count--;
          para.textContent = `还剩 ${count} 个球`;
        }
      }
    }
  }
}

const canvas = document.querySelector("canvas");
const myCanvas = canvas; // 兼容旧代码
const ctx = canvas.getContext("2d");
const para = document.querySelector("p");
const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;
const balls = [];
let count = 0;

const evilBall = new EvilCircle(random(0, width), random(0, height), true);

function loop() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
  ctx.fillRect(0, 0, width, height);

  while (balls.length < BALLS_COUNT) {
    const size = random(BALL_SIZE_MIN, BALL_SIZE_MAX);
    const ball = new Ball(
      random(0 + size, width - size),
      random(0 + size, height - size),
      random(-BALL_SPEED_MAX, BALL_SPEED_MAX),
      random(-BALL_SPEED_MAX, BALL_SPEED_MAX),
      randomColor(),
      size,
      true
    );
    balls.push(ball);
    count++;
    para.textContent = `还剩 ${count} 个球`;
  }

  for (let i = 0; i < balls.length; i++) {
    if (balls[i].exists) {
      balls[i].draw();
      balls[i].update();
      balls[i].collisionDetect();
    }
  }

  evilBall.draw();
  evilBall.checkBounds();
  evilBall.collisionDetect();

  requestAnimationFrame(loop);
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function randomColor() {
  return (
    "rgb(" +
    random(0, 255) +
    ", " +
    random(0, 255) +
    ", " +
    random(0, 255) +
    ")"
  );
}

loop();