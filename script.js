// ======================================================
// WORLD FOOTBALL MANAGER
// V2
// ======================================================


// ================= GAME STATE =================

let game = {
  manager: "",
  club: "",
  difficulty: "normal",

  budget: 50,

  leaguePosition: 10,
  managerReputation: 50,
  morale: 85,

  season: 1,
  week: 4,
  day: 1,

  wins: 0,
  draws: 0,
  losses: 0,
  points: 0,

  opponent: "METRO UNITED",

  transferMarket: [],

  squad: [
    {
      name: "Alex Morgan",
      position: "GK",
      rating: 72
    },
    {
      name: "Daniel Silva",
      position: "CB",
      rating: 70
    },
    {
      name: "Ryan Carter",
      position: "CB",
      rating: 68
    },
    {
      name: "Leo Santos",
      position: "CM",
      rating: 74
    },
    {
      name: "Kai Wilson",
      position: "RW",
      rating: 76
    },
    {
      name: "Noah Adams",
      position: "ST",
      rating: 75
    }
  ]
};


// ================= SCREEN ELEMENTS =================

const openingScreen =
  document.getElementById("openingScreen");

const mainMenu =
  document.getElementById("mainMenu");

const careerScreen =
  document.getElementById("careerScreen");

const dashboardScreen =
  document.getElementById("dashboardScreen");

const managementScreen =
  document.getElementById("managementScreen");

const resultScreen =
  document.getElementById("resultScreen");


// ================= INPUTS =================

const managerInput =
  document.getElementById("managerInput");

const teamInput =
  document.getElementById("teamInput");

const difficultySelect =
  document.getElementById("difficulty");


// ================= DASHBOARD =================

const managerName =
  document.getElementById("menuManagerName");

const menuReputation =
  document.getElementById("menuReputation");

const clubName =
  document.getElementById("clubName");

const dashboardClubName =
  document.getElementById("dashboardClubName");

const homeTeam =
  document.getElementById("homeTeam");

const opponentTeam =
  document.getElementById("opponentTeam");

const budgetElement =
  document.getElementById("budget");

const leaguePositionElement =
  document.getElementById("leaguePosition");

const reputationElement =
  document.getElementById("managerReputation");

const moraleElement =
  document.getElementById("morale");


// ================= BUTTONS =================

document
  .getElementById("startBtn")
  .addEventListener("click", () => {

    showScreen(mainMenu);

  });


document
  .getElementById("careerBtn")
  .addEventListener("click", () => {

    showScreen(careerScreen);

  });


document
  .getElementById("backToMenu")
  .addEventListener("click", () => {

    showScreen(mainMenu);

  });


document
  .getElementById("dashboardMenuBtn")
  .addEventListener("click", () => {

    showScreen(mainMenu);

  });


// ================= CREATE CAREER =================

document
  .getElementById("createCareerBtn")
  .addEventListener("click", () => {

    let manager = managerInput.value.trim();

    let club = teamInput.value.trim();

    if (manager === "") {
      manager = "Manager";
    }

    if (club === "") {

      alert("Please enter your team name!");

      teamInput.focus();

      return;

    }


    game.manager = manager;

    game.club = club;

    game.difficulty =
      difficultySelect.value;


    if (game.difficulty === "easy") {

      game.budget = 75;

      game.managerReputation = 60;

    }

    else if (game.difficulty === "hard") {

      game.budget = 25;

      game.managerReputation = 40;

    }

    else {

      game.budget = 50;

      game.managerReputation = 50;

    }


    game.leaguePosition = 10;

    game.points = 0;

    game.wins = 0;

    game.draws = 0;

    game.losses = 0;

    game.week = 4;

    game.day = 1;


    generateTransferMarket();

    updateDashboard();

    showScreen(dashboardScreen);

  });


// ======================================================
// SCREEN SYSTEM
// ======================================================

function showScreen(screen) {

  document
    .querySelectorAll(".screen")
    .forEach(s => {

      s.classList.remove("active");

    });

  screen.classList.add("active");

}


// ======================================================
// DASHBOARD
// ======================================================

function updateDashboard() {

  const club =
    game.club.toUpperCase();


  managerName.textContent =
    game.manager.toUpperCase();

  menuReputation.textContent =
    game.managerReputation;


  clubName.textContent =
    club;

  dashboardClubName.textContent =
    club;

  homeTeam.textContent =
    club;

  opponentTeam.textContent =
    game.opponent;


  budgetElement.textContent =
    "€" + game.budget + "M";


  leaguePositionElement.textContent =
    ordinal(game.leaguePosition);


  reputationElement.textContent =
    game.managerReputation;


  moraleElement.textContent =
    game.morale + "%";

}


// ======================================================
// ORDINAL NUMBERS
// ======================================================

function ordinal(number) {

  const suffix =
    ["th","st","nd","rd"];

  const value =
    number % 100;

  return number +
    (suffix[(value - 20) % 10] ||
     suffix[value] ||
     suffix[0]);

}


// ======================================================
// RANDOM OPPONENTS
// ======================================================

const opponents = [

  "METRO UNITED",
  "SILVERGATE ATHLETIC",
  "PARIS ROYALE",
  "NORTH CITY",
  "ROYAL MADRID",
  "LONDON TITANS",
  "BERLIN FC",
  "MILANO STARS",
  "TOKYO WARRIORS",
  "RIO UNITED",
  "MADRID ATHLETIC",
  "MANCHESTER ROYALS"

];


function getRandomOpponent() {

  return opponents[
    Math.floor(
      Math.random() * opponents.length
    )
  ];

}


// ======================================================
// MATCH
// ======================================================

document
  .getElementById("playMatchBtn")
  .addEventListener("click", playMatch);


function playMatch() {

  const homeScore =
    Math.floor(Math.random() * 5);

  const awayScore =
    Math.floor(Math.random() * 5);


  let result;

  if (homeScore > awayScore) {

    result = "win";

  }

  else if (homeScore < awayScore) {

    result = "loss";

  }

  else {

    result = "draw";

  }


  processMatchResult(
    result,
    homeScore,
    awayScore
  );

}


// ======================================================
// MATCH RESULT
// ======================================================

function processMatchResult(
  result,
  homeScore,
  awayScore
) {

  let pointsChange = 0;

  let reputationChange = 0;


  if (result === "win") {

    game.wins++;

    game.points += 3;

    pointsChange = 3;

    reputationChange =
      Math.floor(
        Math.random() * 3
      ) + 2;

    game.managerReputation +=
      reputationChange;


    game.morale =
      Math.min(
        100,
        game.morale + 5
      );


    if (game.leaguePosition > 1) {

      game.leaguePosition--;

    }


    document.getElementById(
      "resultTitle"
    ).textContent =
      "🏆 YOU WON THE GAME!";

  }


  else if (result === "loss") {

    game.losses++;

    pointsChange = 0;

    reputationChange =
      -(Math.floor(
        Math.random() * 3
      ) + 1);

    game.managerReputation =
      Math.max(
        0,
        game.managerReputation +
        reputationChange
      );


    game.morale =
      Math.max(
        40,
        game.morale - 5
      );


    if (game.leaguePosition < 20) {

      game.leaguePosition++;

    }


    document.getElementById(
      "resultTitle"
    ).textContent =
      "❌ YOU LOST THE GAME";

  }


  else {

    game.draws++;

    game.points++;

    pointsChange = 1;

    reputationChange = 0;


    document.getElementById(
      "resultTitle"
    ).textContent =
      "🤝 THE GAME ENDED IN A DRAW";

  }


  // RANDOM GOALSCORER

  const scorer =
    game.squad[
      Math.floor(
        Math.random() *
        game.squad.length
      )
    ];


  document.getElementById(
    "resultHome"
  ).textContent =
    game.club.toUpperCase();


  document.getElementById(
    "resultAway"
  ).textContent =
    game.opponent;


  document.getElementById(
    "resultHomeScore"
  ).textContent =
    homeScore;


  document.getElementById(
    "resultAwayScore"
  ).textContent =
    awayScore;


  document.getElementById(
    "goalscorer"
  ).textContent =
    scorer.name;


  document.getElementById(
    "pointsChange"
  ).textContent =
    pointsChange >= 0
      ? "+" + pointsChange
      : pointsChange;


  document.getElementById(
    "repChange"
  ).textContent =
    reputationChange >= 0
      ? "+" + reputationChange
      : reputationChange;


  // AFTER MATCH:
  // NEW TRANSFER MARKET

  generateTransferMarket();


  // NEW OPPONENT

  game.opponent =
    getRandomOpponent();


  // WEEK ADVANCES

  advanceDay();


  updateDashboard();

  showScreen(resultScreen);

}


// ======================================================
// CONTINUE AFTER MATCH
// ======================================================

document
  .getElementById("continueBtn")
  .addEventListener("click", () => {

    showScreen(dashboardScreen);

  });


// ======================================================
// TRANSFER MARKET
// EXACTLY 5 RANDOM PLAYERS
// ======================================================

const realPlayers = [

  {
    name: "Lionel Messi",
    position: "RW",
    rating: 99,
    age: 39,
    tier: "ICON",
    value: 70,
    price: 90
  },

  {
    name: "Cristiano Ronaldo",
    position: "ST",
    rating: 99,
    age: 41,
    tier: "ICON",
    value: 65,
    price: 85
  },

  {
    name: "Neymar Jr",
    position: "LW",
    rating: 96,
    age: 34,
    tier: "ICON",
    value: 60,
    price: 75
  },

  {
    name: "Kylian Mbappé",
    position: "ST",
    rating: 97,
    age: 27,
    tier: "SUPERSTAR",
    value: 180,
    price: 220
  },

  {
    name: "Erling Haaland",
    position: "ST",
    rating: 97,
    age: 26,
    tier: "SUPERSTAR",
    value: 170,
    price: 210
  },

  {
    name: "Lamine Yamal",
    position: "RW",
    rating: 96,
    age: 19,
    tier: "RARE",
    value: 150,
    price: 190
  },

  {
    name: "Jude Bellingham",
    position: "CM",
    rating: 95,
    age: 23,
    tier: "SUPERSTAR",
    value: 140,
    price: 175
  },

  {
    name: "Vinícius Júnior",
    position: "LW",
    rating: 95,
    age: 26,
    tier: "SUPERSTAR",
    value: 150,
    price: 185
  },

  {
    name: "Mohamed Salah",
    position: "RW",
    rating: 94,
    age: 34,
    tier: "STAR",
    value: 55,
    price: 70
  },

  {
    name: "Kevin De Bruyne",
    position: "CM",
    rating: 93,
    age: 35,
    tier: "STAR",
    value: 35,
    price: 48
  },

  {
    name: "Rodri",
    position: "CDM",
    rating: 94,
    age: 30,
    tier: "STAR",
    value: 110,
    price: 135
  },

  {
    name: "Bukayo Saka",
    position: "RW",
    rating: 92,
    age: 25,
    tier: "STAR",
    value: 100,
    price: 125
  },

  {
    name: "Pedri",
    position: "CM",
    rating: 91,
    age: 23,
    tier: "RARE",
    value: 90,
    price: 115
  },

  {
    name: "Virgil van Dijk",
    position: "CB",
    rating: 90,
    age: 35,
    tier: "STAR",
    value: 25,
    price: 35
  },

  {
    name: "Harry Kane",
    position: "ST",
    rating: 93,
    age: 33,
    tier: "STAR",
    value: 45,
    price: 60
  },

  {
    name: "Robert Lewandowski",
    position: "ST",
    rating: 91,
    age: 38,
    tier: "STAR",
    value: 20,
    price: 28
  }

];


const fictionalPlayers = [

  {
    name: "Luca Bennett",
    position: "CM",
    rating: 64,
    age: 20,
    tier: "NORMAL",
    value: 4,
    price: 6
  },

  {
    name: "Daniel Costa",
    position: "CB",
    rating: 67,
    age: 21,
    tier: "NORMAL",
    value: 6,
    price: 8
  },

  {
    name: "Marco Silva",
    position: "RW",
    rating: 70,
    age: 19,
    tier: "STAR",
    value: 12,
    price: 16
  },

  {
    name: "Ethan Cole",
    position: "ST",
    rating: 62,
    age: 22,
    tier: "NORMAL",
    value: 3,
    price: 5
  },

  {
    name: "Adam Brooks",
    position: "GK",
    rating: 65,
    age: 20,
    tier: "NORMAL",
    value: 3,
    price: 5
  },

  {
    name: "Mikael Rossi",
    position: "LW",
    rating: 73,
    age: 19,
    tier: "RARE",
    value: 18,
    price: 25
  },

  {
    name: "Yuki Tanaka",
    position: "CAM",
    rating: 69,
    age: 18,
    tier: "RARE",
    value: 10,
    price: 14
  },

  {
    name: "Sam Wilson",
    position: "LB",
    rating: 61,
    age: 23,
    tier: "NORMAL",
    value: 2,
    price: 4
  },

  {
    name: "Noah King",
    position: "ST",
    rating: 72,
    age: 20,
    tier: "STAR",
    value: 14,
    price: 19
  }

];


const freeAgents = [

  {
    name: "Diego Marquez",
    position: "CM",
    rating: 63,
    age: 28,
    tier: "FREE AGENT",
    value: 2,
    price: 0
  },

  {
    name: "Alex Turner",
    position: "RW",
    rating: 65,
    age: 26,
    tier: "FREE AGENT",
    value: 2,
    price: 0
  },

  {
    name: "Rafael Costa",
    position: "CB",
    rating: 62,
    age: 30,
    tier: "FREE AGENT",
    value: 1,
    price: 0
  },

  {
    name: "Lucas Martin",
    position: "ST",
    rating: 66,
    age: 25,
    tier: "FREE AGENT",
    value: 3,
    price: 0
  }

];


// ======================================================
// GENERATE EXACTLY 5
// ======================================================

function generateTransferMarket() {

  const allPlayers = [
    ...realPlayers,
    ...fictionalPlayers,
    ...freeAgents
  ];


  const shuffled =
    [...allPlayers].sort(
      () => Math.random() - 0.5
    );


  game.transferMarket =
    shuffled.slice(0,5);

}


// ======================================================
// TRANSFER MARKET UI
// ======================================================

function showTransfers() {

  const content =
    document.getElementById(
      "pageContent"
    );


  let html = `

    <div class="content-box">

      <h2>
        TRANSFER MARKET
      </h2>

      <p class="description">
        5 new players are available after every match.
      </p>

      <p style="margin-top:15px;color:var(--accent);font-weight:bold;">
        CURRENT BUDGET: €${game.budget}M
      </p>

      <div class="transfer-grid">

  `;


  game.transferMarket.forEach(
    (player,index) => {

      const tierClass =
        player.tier === "FREE AGENT"
          ? "tier-free"
          : player.tier === "NORMAL"
          ? "tier-normal"
          : player.tier === "STAR"
          ? "tier-star"
          : player.tier === "SUPERSTAR"
          ? "tier-super"
          : player.tier === "ICON"
          ? "tier-icon"
          : "tier-rare";


      html += `

        <div class="transfer-card">

          <div class="transfer-top">

            <strong>
              ${player.position}
            </strong>

            <span class="tier ${tierClass}">
              ${player.tier}
            </span>

          </div>

          <h3>
            ${player.name}
          </h3>

          <div class="transfer-info">
            ⭐ Rating ${player.rating}
            · Age ${player.age}
          </div>

          <div class="transfer-info">
            💰 Market Value:
            €${player.value}M
          </div>

          <div class="transfer-price">

            <strong>
              ${
                player.price === 0
                ? "FREE"
                : "€" + player.price + "M"
              }
            </strong>

            <button
              class="buy-btn"
              onclick="buyPlayer(${index})"
            >
              ${player.price === 0
                ? "SIGN"
                : "BUY"}
            </button>

          </div>

        </div>

      `;

    });


  html += `

      </div>

    </div>

  `;


  content.innerHTML = html;

}


// ======================================================
// BUY PLAYER
// ======================================================

function buyPlayer(index) {

  const player =
    game.transferMarket[index];


  if (!player) return;


  if (player.price > game.budget) {

    alert(
      "❌ NOT ENOUGH MONEY!\n\n" +
      "You need €" +
      player.price +
      "M."
    );

    return;

  }


  game.budget -= player.price;


  game.squad.push({
    name: player.name,
    position: player.position,
    rating: player.rating
  });


  alert(
    "✅ PLAYER SIGNED!\n\n" +
    player.name +
    " has joined " +
    game.club + "!"
  );


  // Remove purchased player

  game.transferMarket.splice(
    index,
    1
  );


  updateDashboard();

  showTransfers();

}


// ======================================================
// SQUAD
// ======================================================

function showSquad() {

  const content =
    document.getElementById(
      "pageContent"
    );


  let html = `

    <div class="content-box">

      <h2>
        YOUR SQUAD
      </h2>

      <div class="player-list">

  `;


  game.squad.forEach(player => {

    html += `

      <div class="player-card">

        <div>

          <div class="player-name">
            ${player.name}
          </div>

          <div class="player-meta">
            ${player.position}
          </div>

        </div>

        <div class="player-rating">
          ${player.rating}
        </div>

      </div>

    `;

  });


  html += `

      </div>

    </div>

  `;


  content.innerHTML = html;

}


// ======================================================
// TACTICS
// ======================================================

function showTactics() {

  document.getElementById(
    "pageContent"
  ).innerHTML = `

    <div class="content-box">

      <h2>FORMATION</h2>

      <p class="description">
        Choose how your club plays.
      </p>

      <div class="player-list">

        <button class="management-grid button"
          onclick="setFormation('4-3-3')">
          ⚽ 4-3-3
        </button>

        <button
          class="advance-btn"
          onclick="setFormation('4-4-2')">
          ⚽ 4-4-2
        </button>

        <button
          class="advance-btn"
          onclick="setFormation('3-5-2')">
          ⚽ 3-5-2
        </button>

      </div>

    </div>

  `;

}


function setFormation(
  formation
) {

  alert(
    "TACTICS UPDATED!\n\nFormation: " +
    formation
  );

}


// ======================================================
// TRAINING
// ======================================================

function showTraining() {

  document.getElementById(
    "pageContent"
  ).innerHTML = `

    <div class="content-box">

      <h2>TRAINING CENTER</h2>

      <p class="description">
        Develop your players before the next match.
      </p>

      <button
        class="advance-btn"
        onclick="training('Technical')">
        ⚽ TECHNICAL TRAINING
      </button>

      <button
        class="advance-btn"
        onclick="training('Fitness')">
        🏃 FITNESS TRAINING
      </button>

      <button
        class="advance-btn"
        onclick="training('Tactical')">
        📋 TACTICAL TRAINING
      </button>

    </div>

  `;

}


function training(type) {

  game.morale =
    Math.min(
      100,
      game.morale + 3
    );


  alert(
    "🏋️ TRAINING COMPLETED!\n\n" +
    type +
    " session finished."
  );


  updateDashboard();

}


// ======================================================
// CALENDAR
// ======================================================

function showCalendar() {

  const days = [

    [
      "MON",
      "Monday",
      "TRAINING — Technical Session",
      "SCHEDULED"
    ],

    [
      "TUE",
      "Tuesday",
      "TRAINING — Tactical Session",
      "SCHEDULED"
    ],

    [
      "WED",
      "Wednesday",
      "RECOVERY — Fitness & Recovery",
      "SCHEDULED"
    ],

    [
      "THU",
      "Thursday",
      "TRAINING — Position Training",
      "SCHEDULED"
    ],

    [
      "FRI",
      "Friday",
      "REST — Prepare for the weekend",
      "SCHEDULED"
    ],

    [
      "SAT",
      "Saturday",
      "MATCH — " +
      game.club.toUpperCase() +
      " vs " +
      game.opponent,
      "NEXT MATCH"
    ],

    [
      "SUN",
      "Sunday",
      "REST — Weekly Recovery",
      "TODAY"
    ]

  ];


  let html = `

    <div class="calendar-header">

      <div class="week-title">
        YOUR WEEK
      </div>

      <h2 style="margin-top:8px;">
        CAREER CALENDAR
      </h2>

      <p class="description">
        SEASON ${game.season}
        · WEEK ${String(game.week).padStart(2,"0")}
      </p>

    </div>

    <div class="calendar-days">

  `;


  days.forEach(day => {

    html += `

      <div class="day-card">

        <div class="day-name">

          ${day[0]}

          <span>
            ${day[1]}
          </span>

        </div>

        <div class="day-event">
          ${day[2]}
        </div>

        <div class="day-status">
          ${day[3]}
        </div>

      </div>

    `;

  });


  html += `

    </div>

    <button
      class="advance-btn"
      onclick="advanceDay()">

      ADVANCE DAY

    </button>

    <div class="content-box">

      <strong>
        DAY ${game.day} •
        ${getDayName()} —
        ${getCurrentActivity()}
      </strong>

    </div>

  `;


  document.getElementById(
    "pageContent"
  ).innerHTML = html;

}


// ======================================================
// ADVANCE DAY
// ======================================================

function advanceDay() {

  game.day++;


  if (game.day > 7) {

    game.day = 1;

    game.week++;

  }


  if (
    game.day === 7 &&
    game.week > 38
  ) {

    game.season++;

    game.week = 1;

  }


  updateDashboard();

}


// ======================================================
// DAY HELPERS
// ======================================================

function getDayName() {

  const names = [
    "",
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
    "SUNDAY"
  ];

  return names[game.day];

}


function getCurrentActivity() {

  const activities = [
    "",
    "TRAINING — TECHNICAL SESSION",
    "TRAINING — TACTICAL SESSION",
    "RECOVERY — FITNESS & RECOVERY",
    "TRAINING — POSITION TRAINING",
    "REST — PREPARE FOR THE WEEKEND",
    "MATCHDAY",
    "REST — WEEKLY RECOVERY"
  ];

  return activities[game.day];

}


// ======================================================
// LEAGUE TABLE
// ======================================================

const leagueTeams = [

  "Royal Madrid",
  "London Titans",
  "Berlin FC",
  "Milano Stars",
  "Tokyo Warriors",
  "Rio United",
  "Paris Royale",
  "North City",
  "Metro United",
  "YOUR CLUB",
  "Silvergate Athletic",
  "Manchester Royals",
  "Madrid Athletic",
  "Lisbon Kings",
  "Amsterdam FC",
  "Seoul United",
  "Dubai Stars",
  "Barcelona City",
  "Munich Reds",
  "Istanbul FC"

];


function showLeague() {

  const sorted =
    [...leagueTeams]
      .sort(() => Math.random() - 0.5);


  const clubUpper =
    game.club.toUpperCase();


  let html = `

    <div class="content-box">

      <h2>
        LEAGUE TABLE
      </h2>

      <div class="table-wrap">

        <table class="league-table">

          <thead>

            <tr>
              <th>#</th>
              <th>CLUB</th>
              <th>PTS</th>
              <th>W</th>
              <th>D</th>
              <th>L</th>
            </tr>

          </thead>

          <tbody>

  `;


  for (
    let i = 0;
    i < sorted.length;
    i++
  ) {

    const name =
      sorted[i] === "YOUR CLUB"
        ? clubUpper
        : sorted[i];


    const isUser =
      sorted[i] === "YOUR CLUB";


    let pts =
      isUser
        ? game.points
        : Math.floor(
            Math.random() * 25
          );


    html += `

      <tr class="${isUser ? "highlight" : ""}">

        <td>${i + 1}</td>

        <td>
          ${isUser ? "⚽ " : ""}
          ${name}
        </td>

        <td>${pts}</td>

        <td>
          ${isUser ? game.wins : "-"}
        </td>

        <td>
          ${isUser ? game.draws : "-"}
        </td>

        <td>
          ${isUser ? game.losses : "-"}
        </td>

      </tr>

    `;

  }


  html += `

          </tbody>

        </table>

      </div>

    </div>

  `;


  document.getElementById(
    "pageContent"
  ).innerHTML = html;

}


// ======================================================
// CUSTOMIZE CLUB
// ======================================================

function showCustomize() {

  document.getElementById(
    "pageContent"
  ).innerHTML = `

    <div class="content-box">

      <h2>
        🎨 CUSTOMIZE YOUR CLUB
      </h2>

      <p class="description">
        Make your club yours.
      </p>

      <button
        class="advance-btn"
        onclick="changeBadge()">

        🏆 CHANGE CLUB BADGE

      </button>

      <button
        class="advance-btn"
        onclick="changeClubName()">

        ✏️ CHANGE CLUB NAME

      </button>

      <button
        class="advance-btn"
        onclick="changeKit()">

        👕 CHANGE KIT

      </button>

      <button
        class="advance-btn"
        onclick="changeStadium()">

        🏟️ CHANGE STADIUM

      </button>

    </div>

  `;

}


function changeBadge() {

  const badges =
    ["⚽","🦁","🐺","🦅","🔥","👑","⭐"];

  const badge =
    badges[
      Math.floor(
        Math.random() * badges.length
      )
    ];


  document.getElementById(
    "clubBadge"
  ).textContent = badge;

}


// ======================================================
// CHANGE CLUB NAME
// ======================================================

function changeClubName() {

  const newName =
    prompt(
      "Enter your new club name:"
    );


  if (
    newName &&
    newName.trim() !== ""
  ) {

    game.club =
      newName.trim();

    updateDashboard();

    alert(
      "✅ Club name updated!"
    );

    showCustomize();

  }

}


// ======================================================
// KIT
// ======================================================

function changeKit() {

  const kits = [
    "HOME KIT",
    "AWAY KIT",
    "THIRD KIT",
    "SPECIAL KIT"
  ];


  const kit =
    kits[
      Math.floor(
        Math.random() * kits.length
      )
    ];


  alert(
    "👕 " +
    kit +
    " selected!"
  );

}


// ======================================================
// STADIUM
// ======================================================

function changeStadium() {

  const stadiums = [

    "WFM Arena",
    "Football City Stadium",
    "Royal Park",
    "Champions Ground",
    "Victory Stadium"

  ];


  const stadium =
    stadiums[
      Math.floor(
        Math.random() *
        stadiums.length
      )
    ];


  alert(
    "🏟️ Stadium selected:\n\n" +
    stadium
  );

}


// ======================================================
// MANAGEMENT NAVIGATION
// ======================================================

document
  .querySelectorAll(
    ".management-grid button"
  )
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        const page =
          button.dataset.page;

        openManagementPage(page);

      }
    );

  });


function openManagementPage(page) {

  const title =
    document.getElementById(
      "pageTitle"
    );

  const category =
    document.getElementById(
      "pageCategory"
    );


  category.textContent =
    "MANAGEMENT";


  if (page === "squad") {

    title.textContent =
      "SQUAD";

    showSquad();

  }

  else if (page === "tactics") {

    title.textContent =
      "TACTICS";

    showTactics();

  }

  else if (page === "transfers") {

    title.textContent =
      "TRANSFERS";

    showTransfers();

  }

  else if (page === "training") {

    title.textContent =
      "TRAINING";

    showTraining();

  }

  else if (page === "calendar") {

    title.textContent =
      "CAREER CALENDAR";

    showCalendar();

  }

  else if (page === "league") {

    title.textContent =
      "LEAGUE TABLE";

    showLeague();

  }

  else if (page === "customize") {

    title.textContent =
      "CUSTOMIZE YOUR CLUB";

    showCustomize();

  }


  showScreen(managementScreen);

}


// ======================================================
// BACK TO DASHBOARD
// ======================================================

document
  .getElementById("backDashboard")
  .addEventListener(
    "click",
    () => {

      updateDashboard();

      showScreen(dashboardScreen);

    }
  );


// ======================================================
// QUICK MATCH
// ======================================================

document
  .getElementById("quickMatchBtn")
  .addEventListener(
    "click",
    () => {

      alert(
        "⚽ QUICK MATCH\n\n" +
        "Quick Match mode is coming next!"
      );

    }
  );


// ======================================================
// TOURNAMENT
// ======================================================

document
  .getElementById("tournamentBtn")
  .addEventListener(
    "click",
    () => {

      alert(
        "🌍 TOURNAMENTS\n\n" +
        "Tournament mode is coming next!"
      );

    }
  );


// ======================================================
// SETTINGS
// ======================================================

document
  .getElementById("settingsBtn")
  .addEventListener(
    "click",
    () => {

      alert(
        "⚙️ SETTINGS\n\n" +
        "WFM Career Mode\n" +
        "Version 2.0"
      );

    }
  );
