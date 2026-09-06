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
  { x: 150, y: 180, radius: 18, color: "#2196f3", speed: 2 },
  { x: 150, y: 420, radius: 18, color: "#2196f3", speed: 2 }
];

const redPlayers = [
  { x: 750, y: 180, radius: 18, color: "#f44336", speed: 2 },
  { x: 850, y: 300, radius: 18, color: "#f44336", speed: 2 },
  { x: 750, y: 420, radius: 18, color: "#f44336", speed: 2 }
];

document.addEventListener("keydown", (event) => {
  keys[event.key.toLowerCase()] = true;

  if (event.code === "Space") {
    keys.space = true;
    event.preventDefault();
  }
});

document.addEventListener("keyup", (event) => {
  keys[event.key.toLowerCase()] = false;

  if (event.code === "Space") {
    keys.space = false;
  }
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
  let speed = keys.shift ? 7 : player.speed;

  if (keys.w || keys.arrowup) player.y -= speed;
  if (keys.s || keys.arrowdown) player.y += speed;
  if (keys.a || keys.arrowleft) player.x -= speed;
  if (keys.d || keys.arrowright) player.x += speed;

  player.x = Math.max(38, Math.min(canvas.width - 38, player.x));
  player.y = Math.max(38, Math.min(canvas.height - 38, player.y));
}

function moveAI(ai, targetX, targetY) {
  const dx = targetX - ai.x;
  const dy = targetY - ai.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance > 1) {
    ai.x += (dx / distance) * ai.speed;
    ai.y += (dy / distance) * ai.speed;
  }

  ai.x = Math.max(38, Math.min(canvas.width - 38, ai.x));
  ai.y = Math.max(38, Math.min(canvas.height - 38, ai.y));
}

function updateAI() {
  // Blue teammates move towards the ball when it is nearby
  bluePlayers.slice(1).forEach((ai, index) => {
    const distance = Math.hypot(ball.x - ai.x, ball.y - ai.y);

    if (distance < 350) {
      moveAI(ai, ball.x, ball.y);
    } else {
      // Return to formation
      const positions = [
        { x: 200, y: 180 },
        { x: 200, y: 420 }
      ];

      moveAI(ai, positions[index].x, positions[index].y);
    }
  });

  // Red team chases the ball
  redPlayers.forEach((ai, index) => {
    const distance = Math.hypot(ball.x - ai.x, ball.y - ai.y);

    if (distance < 500) {
      moveAI(ai, ball.x, ball.y);
    } else {
      const positions = [
        { x: 750, y: 180 },
        { x: 850, y: 300 },
        { x: 750, y: 420 }
      ];

      moveAI(ai, positions[index].x, positions[index].y);
    }
  });
}

function handlePlayerBallCollision(p, power = 0.12) {
  const dx = ball.x - p.x;
  const dy = ball.y - p.y;
  const distance = Math.hypot(dx, dy);
  const minDistance = p.radius + ball.radius;

  if (distance < minDistance && distance > 0) {
    const nx = dx / distance;
    const ny = dy / distance;

    // Push the ball outside the player
    ball.x = p.x + nx * minDistance;
    ball.y = p.y + ny * minDistance;

    ball.vx += nx * power;
    ball.vy += ny * power;

    // User shooting
    if (p === player && keys.space) {
      ball.vx += nx * 8;
      ball.vy += ny * 8;
    }
  }
}

function updateBall() {
  // Player and AI collisions
  handlePlayerBallCollision(player, 0.2);

  bluePlayers.slice(1).forEach((ai) => {
    handlePlayerBallCollision(ai, 0.15);
  });

  redPlayers.forEach((ai) => {
    handlePlayerBallCollision(ai, 0.18);
  });

  ball.x += ball.vx;
  ball.y += ball.vy;

  // Slow the ball down gradually
  ball.vx *= 0.985;
  ball.vy *= 0.985;

  // Stop tiny movements
  if (Math.abs(ball.vx) < 0.02) ball.vx = 0;
  if (Math.abs(ball.vy) < 0.02) ball.vy = 0;

  // TOP AND BOTTOM WALLS
  if (ball.y <= ball.radius + 20) {
    ball.y = ball.radius + 20;
    ball.vy = Math.abs(ball.vy) * 0.8;
  }

  if (ball.y >= canvas.height - ball.radius - 20) {
    ball.y = canvas.height - ball.radius - 20;
    ball.vy = -Math.abs(ball.vy) * 0.8;
  }

  const insideGoal = ball.y > 220 && ball.y < 380;

  // LEFT GOAL
  if (ball.x <= ball.radius) {
    if (insideGoal) {
      redScore++;
      updateScore();
      resetBall();
    } else {
      ball.x = ball.radius + 20;
      ball.vx = Math.abs(ball.vx) * 0.8;
    }
  }

  // RIGHT GOAL
  if (ball.x >= canvas.width - ball.radius) {
    if (insideGoal) {
      blueScore++;
      updateScore();
      resetBall();
    } else {
      ball.x = canvas.width - ball.radius - 20;
      ball.vx = -Math.abs(ball.vx) * 0.8;
    }
  }
}

function updateScore() {
  document.getElementById("blueScore").textContent = blueScore;
  document.getElementById("redScore").textContent = redScore;
}

function resetBall() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.vx = 0;
  ball.vy = 0;
}

function update() {
  movePlayer();
  updateAI();
  updateBall();

  drawPitch();

  bluePlayers.forEach(drawPlayer);
  redPlayers.forEach(drawPlayer);

  drawBall();

  requestAnimationFrame(update);
}

update();
