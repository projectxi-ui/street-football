const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const keys = {};

let blueScore = 0;
let redScore = 0;

const player = {
  x: 250,
  y: 300,
  radius: 18,
  speed: 4,
  color: "#2196f3"
};

const ball = {
  x: 500,
  y: 300,
  radius: 10,
  vx: 0,
  vy: 0
};

const bluePlayers = [
  player,
  { x: 150, y: 180, radius: 18, color: "#2196f3" },
  { x: 150, y: 420, radius: 18, color: "#2196f3" }
];

const redPlayers = [
  { x: 750, y: 180, radius: 18, color: "#f44336" },
  { x: 850, y: 300, radius: 18, color: "#f44336" },
  { x: 750, y: 420, radius: 18, color: "#f44336" }
];

document.addEventListener("keydown", (event) => {
  keys[event.key.toLowerCase()] = true;
});

document.addEventListener("keyup", (event) => {
  keys[event.key.toLowerCase()] = false;
});

function drawPitch() {
  ctx.fillStyle = "#3b873e";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "white";
  ctx.lineWidth = 5;

  ctx.strokeRect(20, 20, 960, 560);

  // Centre line
  ctx.beginPath();
  ctx.moveTo(500, 20);
  ctx.lineTo(500, 580);
  ctx.stroke();

  // Centre circle
  ctx.beginPath();
  ctx.arc(500, 300, 80, 0, Math.PI * 2);
  ctx.stroke();

  // Goals
  ctx.strokeRect(0, 220, 50, 160);
  ctx.strokeRect(950, 220, 50, 160);
}

function drawPlayer(p) {
  ctx.beginPath();
  ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);

  ctx.fillStyle = p.color;
  ctx.fill();

  ctx.strokeStyle = "white";
  ctx.lineWidth = 2;
  ctx.stroke();
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);

  ctx.fillStyle = "white";
  ctx.fill();

  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;
  ctx.stroke();
}

function movePlayer() {
  let speed = player.speed;

  if (keys["shift"]) {
    speed = 7;
  }

  if (keys["w"] || keys["arrowup"]) {
    player.y -= speed;
  }

  if (keys["s"] || keys["arrowdown"]) {
    player.y += speed;
  }

  if (keys["a"] || keys["arrowleft"]) {
    player.x -= speed;
  }

  if (keys["d"] || keys["arrowright"]) {
    player.x += speed;
  }

  // Keep player inside pitch
  player.x = Math.max(30, Math.min(970, player.x));
  player.y = Math.max(30, Math.min(570, player.y));
}

function updateBall() {

  // Player pushes ball
  const dx = ball.x - player.x;
  const dy = ball.y - player.y;

  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance < player.radius + ball.radius) {

    ball.vx += dx * 0.08;
    ball.vy += dy * 0.08;

    // Shoot
    if (keys[" "]) {
      ball.vx += dx * 0.4;
      ball.vy += dy * 0.4;
    }
  }

  ball.x += ball.vx;
  ball.y += ball.vy;

  ball.vx *= 0.96;
  ball.vy *= 0.96;

  // Top and bottom walls
  if (ball.y < ball.radius || ball.y > canvas.height - ball.radius) {
    ball.vy *= -0.8;
  }

  // Goal check
  if (ball.x < 20 && ball.y > 220 && ball.y < 380) {
    redScore++;
    resetBall();
  }

  if (ball.x > 980 && ball.y > 220 && ball.y < 380) {
    blueScore++;
    resetBall();
  }

  // Side walls
  if (ball.x < ball.radius) ball.vx *= -0.8;
  if (ball.x > canvas.width - ball.radius) ball.vx *= -0.8;
}

function resetBall() {
  ball.x = 500;
  ball.y = 300;
  ball.vx = 0;
  ball.vy = 0;

  document.getElementById("blueScore").textContent = blueScore;
  document.getElementById("redScore").textContent = redScore;
}

function update() {

  movePlayer();
  updateBall();

  // Draw everything
  drawPitch();

  bluePlayers.forEach(drawPlayer);
  redPlayers.forEach(drawPlayer);

  drawBall();

  requestAnimationFrame(update);
}

update();
