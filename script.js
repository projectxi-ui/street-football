const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let currentScreen = "startScreen";

let selectedTeam = "blue";

let blueScore = 0;
let redScore = 0;

let gameRunning = false;
let matchTime = 120;
let lastTime = 0;

const keys = {};

const player = {
  x: 250,
  y: 300,
  radius: 16,
  speed: 3.8,
  color: "#168cff",
  number: 10,
  facingX: 1,
  facingY: 0
};

const ball = {
  x: 500,
  y: 300,
  radius: 9,
  vx: 0,
  vy: 0
};

const bluePlayers = [
  player,

  {
    x: 175,
    y: 190,
    radius: 16,
    speed: 2.1,
    color: "#168cff",
    number: 7,
    facingX: 1,
    facingY: 0
  },

  {
    x: 175,
    y: 410,
    radius: 16,
    speed: 2.1,
    color: "#168cff",
    number: 11,
    facingX: 1,
    facingY: 0
  }
];

const redPlayers = [
  {
    x: 825,
    y: 190,
    radius: 16,
    speed: 2.15,
    color: "#ff3d48",
    number: 9,
    facingX: -1,
    facingY: 0
  },

  {
    x: 825,
    y: 300,
    radius: 16,
    speed: 2.3,
    color: "#ff3d48",
    number: 10,
    facingX: -1,
    facingY: 0
  },

  {
    x: 825,
    y: 410,
    radius: 16,
    speed: 2.15,
    color: "#ff3d48",
    number: 7,
    facingX: -1,
    facingY: 0
  }
];


/* =========================
   SCREEN SYSTEM
========================= */

function showScreen(id) {

  document.querySelectorAll(".screen").forEach(screen => {
    screen.classList.remove("active");
  });

  document.getElementById(id).classList.add("active");

  currentScreen = id;
}


/* =========================
   MENU BUTTONS
========================= */

document.getElementById("startBtn").onclick = () => {
  showScreen("mainMenu");
};

document.getElementById("playBtn").onclick = () => {
  showScreen("modeScreen");
};

document.getElementById("select3v3").onclick = () => {
  showScreen("teamScreen");
};

document.getElementById("practiceBtn").onclick = () => {
  showScreen("practiceScreen");
};

document.getElementById("settingsBtn").onclick = () => {
  showScreen("settingsScreen");
};


/* BACK BUTTONS */

document.querySelectorAll("[data-back]").forEach(button => {

  button.addEventListener("click", () => {

    const target = button.dataset.back;

    showScreen(target);

  });

});


/* =========================
   TEAM SELECT
========================= */

document.querySelectorAll(".team-card").forEach(card => {

  card.addEventListener("click", () => {

    document.querySelectorAll(".team-card").forEach(c => {
      c.classList.remove("selected");
    });

    card.classList.add("selected");

    selectedTeam = card.dataset.team;

  });

});


document.getElementById("continueTeam").onclick = () => {

  showScreen("introScreen");

};


/* =========================
   KICK OFF
========================= */

document.getElementById("kickOffBtn").onclick = () => {

  startMatch();

};


/* =========================
   SETTINGS
========================= */

let vibration = true;

document.getElementById("vibrationBtn").onclick = () => {

  vibration = !vibration;

  const button = document.getElementById("vibrationBtn");

  button.textContent = vibration ? "ON" : "OFF";

  button.classList.toggle("on", vibration);

};


/* =========================
   KEYBOARD
========================= */

document.addEventListener("keydown", event => {

  let key = event.key.toLowerCase();

  if (event.code === "Space") {
    key = "space";
    event.preventDefault();
  }

  keys[key] = true;

});


document.addEventListener("keyup", event => {

  let key = event.key.toLowerCase();

  if (event.code === "Space") {
    key = "space";
  }

  keys[key] = false;

});


/* =========================
   MOBILE BUTTONS
========================= */

document.querySelectorAll(".mobile-controls button").forEach(button => {

  const key = button.dataset.key;

  button.addEventListener("pointerdown", event => {

    event.preventDefault();

    keys[key] = true;

    if (vibration && navigator.vibrate) {
      navigator.vibrate(15);
    }

  });

  button.addEventListener("pointerup", event => {

    event.preventDefault();

    keys[key] = false;

  });

  button.addEventListener("pointercancel", () => {
    keys[key] = false;
  });

  button.addEventListener("pointerleave", () => {
    keys[key] = false;
  });

});


/* =========================
   CANVAS SIZE
========================= */

function resizeCanvas() {

  const rect = canvas.getBoundingClientRect();

  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;

  ctx.setTransform(
    dpr,
    0,
    0,
    dpr,
    0,
    0
  );

}

window.addEventListener("resize", resizeCanvas);


/* =========================
   COORDINATE SCALE
========================= */

function gameWidth() {
  return canvas.clientWidth;
}

function gameHeight() {
  return canvas.clientHeight;
}

function scaleX(x) {
  return x / 1000 * gameWidth();
}

function scaleY(y) {
  return y / 600 * gameHeight();
}


/* =========================
   PLAYER MOVEMENT
========================= */

function movePlayer() {

  let dx = 0;
  let dy = 0;

  if (keys.w || keys.arrowup || keys.up) {
    dy -= 1;
  }

  if (keys.s || keys.arrowdown || keys.down) {
    dy += 1;
  }

  if (keys.a || keys.arrowleft || keys.left) {
    dx -= 1;
  }

  if (keys.d || keys.arrowright || keys.right) {
    dx += 1;
  }

  const length = Math.hypot(dx, dy);

  if (length > 0) {

    dx /= length;
    dy /= length;

    const speed = keys.shift ? 6.5 : player.speed;

    player.x += dx * speed;
    player.y += dy * speed;

    player.facingX = dx;
    player.facingY = dy;
  }

  player.x = Math.max(40, Math.min(960, player.x));
  player.y = Math.max(40, Math.min(560, player.y));

}


/* =========================
   AI
========================= */

function moveAI(ai, targetX, targetY, speedMultiplier = 1) {

  const dx = targetX - ai.x;
  const dy = targetY - ai.y;

  const distance = Math.hypot(dx, dy);

  if (distance < 3) return;

  const nx = dx / distance;
  const ny = dy / distance;

  ai.x += nx * ai.speed * speedMultiplier;
  ai.y += ny * ai.speed * speedMultiplier;

  ai.facingX = nx;
  ai.facingY = ny;

}


function updateAI() {

  bluePlayers.slice(1).forEach((ai, index) => {

    const homePositions = [
      { x: 220, y: 190 },
      { x: 220, y: 410 }
    ];

    const distance = Math.hypot(
      ball.x - ai.x,
      ball.y - ai.y
    );

    if (distance < 280) {

      moveAI(
        ai,
        ball.x,
        ball.y,
        1
      );

    } else {

      moveAI(
        ai,
        homePositions[index].x,
        homePositions[index].y,
        .7
      );

    }

  });


  redPlayers.forEach((ai, index) => {

    const homePositions = [
      { x: 780, y: 190 },
      { x: 820, y: 300 },
      { x: 780, y: 410 }
    ];

    const distance = Math.hypot(
      ball.x - ai.x,
      ball.y - ai.y
    );

    if (distance < 450) {

      moveAI(
        ai,
        ball.x,
        ball.y,
        1
      );

    } else {

      moveAI(
        ai,
        homePositions[index].x,
        homePositions[index].y,
        .65
      );

    }

  });

}


/* =========================
   BALL COLLISION
========================= */

function playerBallCollision(p, power = .12) {

  const dx = ball.x - p.x;
  const dy = ball.y - p.y;

  const distance = Math.hypot(dx, dy);

  const minimum =
    p.radius + ball.radius;

  if (
    distance < minimum &&
    distance > 0
  ) {

    const nx = dx / distance;
    const ny = dy / distance;

    ball.x =
      p.x +
      nx *
      minimum;

    ball.y =
      p.y +
      ny *
      minimum;

    ball.vx += nx * power;
    ball.vy += ny * power;

    if (p === player && keys.space) {

      ball.vx += player.facingX * 7;
      ball.vy += player.facingY * 7;

    }

  }

}


/* =========================
   BALL
========================= */

function updateBall() {

  playerBallCollision(player, .2);

  bluePlayers.slice(1).forEach(ai => {
    playerBallCollision(ai, .13);
  });

  redPlayers.forEach(ai => {
    playerBallCollision(ai, .16);
  });


  ball.x += ball.vx;
  ball.y += ball.vy;

  ball.vx *= .985;
  ball.vy *= .985;


  /* TOP */

  if (ball.y < 30) {

    ball.y = 30;

    ball.vy =
      Math.abs(ball.vy) * .8;

  }


  /* BOTTOM */

  if (ball.y > 570) {

    ball.y = 570;

    ball.vy =
      -Math.abs(ball.vy) * .8;

  }


  const inGoal =
    ball.y > 220 &&
    ball.y < 380;


  /* LEFT */

  if (ball.x < 30) {

    if (inGoal) {

      redScore++;

      goalScored("RED STREETS");

    } else {

      ball.x = 30;

      ball.vx =
        Math.abs(ball.vx) * .8;

    }

  }


  /* RIGHT */

  if (ball.x > 970) {

    if (inGoal) {

      blueScore++;

      goalScored("BLUE CITY");

    } else {

      ball.x = 970;

      ball.vx =
        -Math.abs(ball.vx) * .8;

    }

  }

}


/* =========================
   GOAL
========================= */

function goalScored(team) {

  updateScore();

  const message =
    document.getElementById("gameMessage");

  message.textContent =
    `⚽ ${team} GOAL!`;

  setTimeout(() => {

    message.textContent = "";

  }, 1200);

  resetBall();

}


/* =========================
   RESET BALL
========================= */

function resetBall() {

  ball.x = 500;
  ball.y = 300;

  ball.vx = 0;
  ball.vy = 0;

}


/* =========================
   PITCH
========================= */

function drawPitch() {

  const w = gameWidth();
  const h = gameHeight();

  ctx.clearRect(0, 0, w, h);


  /* Grass */

  ctx.fillStyle = "#168044";
  ctx.fillRect(0, 0, w, h);


  /* Grass stripes */

  for (let i = 0; i < 10; i++) {

    if (i % 2 === 0) {

      ctx.fillStyle =
        "rgba(0,0,0,.06)";

      ctx.fillRect(
        i * w / 10,
        0,
        w / 10,
        h
      );

    }

  }


  ctx.strokeStyle = "rgba(255,255,255,.9)";
  ctx.lineWidth = 3;


  /* Outer lines */

  ctx.strokeRect(
    scaleX(25),
    scaleY(25),
    scaleX(950),
    scaleY(550)
  );


  /* Centre */

  ctx.beginPath();

  ctx.moveTo(
    scaleX(500),
    scaleY(25)
  );

  ctx.lineTo(
    scaleX(500),
    scaleY(575)
  );

  ctx.stroke();


  /* Circle */

  ctx.beginPath();

  ctx.arc(
    scaleX(500),
    scaleY(300),
    scaleX(75),
    0,
    Math.PI * 2
  );

  ctx.stroke();


  /* Centre dot */

  ctx.beginPath();

  ctx.arc(
    scaleX(500),
    scaleY(300),
    scaleX(4),
    0,
    Math.PI * 2
  );

  ctx.fillStyle = "white";
  ctx.fill();


  /* Goal boxes */

  ctx.strokeRect(
    scaleX(25),
    scaleY(215),
    scaleX(90),
    scaleY(170)
  );

  ctx.strokeRect(
    scaleX(885),
    scaleY(215),
    scaleX(90),
    scaleY(170)
  );


  /* Goals */

  ctx.strokeRect(
    scaleX(0),
    scaleY(245),
    scaleX(30),
    scaleY(110)
  );

  ctx.strokeRect(
    scaleX(970),
    scaleY(245),
    scaleX(30),
    scaleY(110)
  );

}


/* =========================
   FOOTBALLER DRAWING
========================= */

function drawFootballer(p) {

  const x = scaleX(p.x);
  const y = scaleY(p.y);

  const size =
    Math.min(
      gameWidth() / 1000,
      gameHeight() / 600
    );

  ctx.save();

  ctx.translate(x, y);


  /* Shadow */

  ctx.beginPath();

  ctx.ellipse(
    0,
    15 * size,
    15 * size,
    5 * size,
    0,
    0,
    Math.PI * 2
  );

  ctx.fillStyle =
    "rgba(0,0,0,.3)";

  ctx.fill();


  /* Legs */

  ctx.strokeStyle = "#171717";
  ctx.lineWidth = 5 * size;
  ctx.lineCap = "round";

  ctx.beginPath();

  ctx.moveTo(-5 * size, 8 * size);
  ctx.lineTo(-8 * size, 20 * size);

  ctx.moveTo(5 * size, 8 * size);
  ctx.lineTo(8 * size, 20 * size);

  ctx.stroke();


  /* Boots */

  ctx.strokeStyle = "#090909";
  ctx.lineWidth = 6 * size;

  ctx.beginPath();

  ctx.moveTo(-8 * size, 20 * size);
  ctx.lineTo(-13 * size, 21 * size);

  ctx.moveTo(8 * size, 20 * size);
  ctx.lineTo(13 * size, 21 * size);

  ctx.stroke();


  /* Body */

  ctx.fillStyle = p.color;

  ctx.beginPath();

  ctx.roundRect(
    -11 * size,
    -5 * size,
    22 * size,
    22 * size,
    4 * size
  );

  ctx.fill();


  /* Shorts */

  ctx.fillStyle = "#161a1f";

  ctx.fillRect(
    -10 * size,
    12 * size,
    20 * size,
    8 * size
  );


  /* Arms */

  ctx.strokeStyle = p.color;
  ctx.lineWidth = 5 * size;

  ctx.beginPath();

  ctx.moveTo(-10 * size, 0);
  ctx.lineTo(-16 * size, 10 * size);

  ctx.moveTo(10 * size, 0);
  ctx.lineTo(16 * size, 10 * size);

  ctx.stroke();


  /* Head */

  ctx.beginPath();

  ctx.arc(
    0,
    -15 * size,
    8 * size,
    0,
    Math.PI * 2
  );

  ctx.fillStyle = "#d99b72";
  ctx.fill();


  /* Hair */

  ctx.beginPath();

  ctx.arc(
    0,
    -18 * size,
    7 * size,
    Math.PI,
    Math.PI * 2
  );

  ctx.fillStyle = "#17120f";
  ctx.fill();


  /* Number */

  ctx.fillStyle = "white";
  ctx.font =
    `bold ${8 * size}px Arial`;

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.fillText(
    p.number,
    0,
    5 * size
  );


  /* Direction indicator */

  ctx.fillStyle =
    "rgba(255,255,255,.6)";

  ctx.beginPath();

  ctx.arc(
    p.facingX * 15 * size,
    p.facingY * 15 * size,
    2 * size,
    0,
    Math.PI * 2
  );

  ctx.fill();


  ctx.restore();

}


/* =========================
   BALL DRAW
========================= */

function drawBall() {

  const x = scaleX(ball.x);
  const y = scaleY(ball.y);

  const r =
    ball.radius *
    Math.min(
      gameWidth() / 1000,
      gameHeight() / 600
    );


  /* Shadow */

  ctx.beginPath();

  ctx.ellipse(
    x,
    y + r * .9,
    r * 1.2,
    r * .45,
    0,
    0,
    Math.PI * 2
  );

  ctx.fillStyle =
    "rgba(0,0,0,.3)";

  ctx.fill();


  /* Ball */

  ctx.beginPath();

  ctx.arc(
    x,
    y,
    r,
    0,
    Math.PI * 2
  );

  ctx.fillStyle = "white";
  ctx.fill();

  ctx.strokeStyle = "#222";
  ctx.lineWidth = 1;

  ctx.stroke();

}


/* =========================
   SCORE
========================= */

function updateScore() {

  document.getElementById(
    "blueScore"
  ).textContent = blueScore;

  document.getElementById(
    "redScore"
  ).textContent = redScore;

}


/* =========================
   TIMER
========================= */

function updateTimer(delta) {

  matchTime -= delta;

  if (matchTime < 0) {
    matchTime = 0;
  }

  const minutes =
    Math.floor(matchTime / 60);

  const seconds =
    Math.floor(matchTime % 60);

  document.getElementById(
    "timer"
  ).textContent =
    `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;


  if (matchTime <= 0) {

    endMatch();

  }

}


/* =========================
   START MATCH
========================= */

function startMatch() {

  blueScore = 0;
  redScore = 0;

  matchTime = 120;

  updateScore();

  resetBall();

  resetPlayers();

  showScreen("gameScreen");

  setTimeout(() => {
    resizeCanvas();
  }, 50);

  gameRunning = true;

  lastTime = performance.now();

}


/* =========================
   RESET PLAYERS
========================= */

function resetPlayers() {

  player.x = 250;
  player.y = 300;

  bluePlayers[1].x = 175;
  bluePlayers[1].y = 190;

  bluePlayers[2].x = 175;
  bluePlayers[2].y = 410;

  redPlayers[0].x = 825;
  redPlayers[0].y = 190;

  redPlayers[1].x = 825;
  redPlayers[1].y = 300;

  redPlayers[2].x = 825;
  redPlayers[2].y = 410;

}


/* =========================
   END MATCH
========================= */

function endMatch() {

  if (!gameRunning) return;

  gameRunning = false;

  document.getElementById(
    "finalBlue"
  ).textContent = blueScore;

  document.getElementById(
    "finalRed"
  ).textContent = redScore;


  let result;

  if (blueScore > redScore) {

    result = "BLUE CITY WINS!";

  } else if (redScore > blueScore) {

    result = "RED STREETS WINS!";

  } else {

    result = "IT'S A DRAW!";

  }

  document.getElementById(
    "winnerText"
  ).textContent = result;

  showScreen("gameOverScreen");

}


/* =========================
   REMATCH
========================= */

document.getElementById(
  "rematchBtn"
).onclick = () => {

  startMatch();

};


document.getElementById(
  "menuBtn"
).onclick = () => {

  gameRunning = false;

  showScreen("mainMenu");

};


/* =========================
   GAME LOOP
========================= */

function gameLoop(timestamp) {

  if (!lastTime) {
    lastTime = timestamp;
  }

  const delta =
    Math.min(
      (timestamp - lastTime) / 1000,
      .05
    );

  lastTime = timestamp;


  if (gameRunning) {

    movePlayer();

    updateAI();

    updateBall();

    updateTimer(delta);

    drawPitch();

    bluePlayers.forEach(
      drawFootballer
    );

    redPlayers.forEach(
      drawFootballer
    );

    drawBall();

  }


  requestAnimationFrame(gameLoop);

}


/* =========================
   INITIALIZE
========================= */

setTimeout(() => {
  resizeCanvas();
}, 100);

requestAnimationFrame(gameLoop);
