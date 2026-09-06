// WORLD FOOTBALL MANAGER
// Version 1 - Create Your Own Club

const openingScreen = document.getElementById("openingScreen");
const mainMenu = document.getElementById("mainMenu");
const careerScreen = document.getElementById("careerScreen");
const dashboardScreen = document.getElementById("dashboardScreen");

const startBtn = document.getElementById("startBtn");
const careerBtn = document.getElementById("careerBtn");
const backToMenu = document.getElementById("backToMenu");
const createCareerBtn = document.getElementById("createCareerBtn");

const managerInput = document.getElementById("managerInput");
const teamInput = document.getElementById("teamInput");
const teamColor = document.getElementById("teamColor");
const difficultySelect = document.getElementById("difficulty");

const managerName = document.getElementById("managerName");
const clubName = document.getElementById("clubName");
const dashboardClubName = document.getElementById("dashboardClubName");
const homeTeam = document.getElementById("homeTeam");
const budget = document.getElementById("budget");

const playMatchBtn = document.getElementById("playMatchBtn");
const dashboardMenuBtn = document.getElementById("dashboardMenuBtn");


// ================================
// SCREEN SYSTEM
// ================================

function showScreen(screen) {
  document.querySelectorAll(".screen").forEach((item) => {
    item.classList.remove("active");
  });

  screen.classList.add("active");
}


// ================================
// START GAME
// ================================

startBtn.addEventListener("click", () => {
  showScreen(mainMenu);
});


// ================================
// OPEN CAREER
// ================================

careerBtn.addEventListener("click", () => {
  showScreen(careerScreen);
});


// ================================
// BACK TO MENU
// ================================

backToMenu.addEventListener("click", () => {
  showScreen(mainMenu);
});


// ================================
// CREATE YOUR CLUB
// ================================

createCareerBtn.addEventListener("click", () => {

  let name = managerInput.value.trim();
  let team = teamInput.value.trim();

  // Default manager name
  if (name === "") {
    name = "Manager";
  }

  // Team name is required
  if (team === "") {
    alert("Please enter your team name!");
    teamInput.focus();
    return;
  }

  const difficulty = difficultySelect.value;

  // ==========================
  // MANAGER
  // ==========================

  managerName.textContent = name.toUpperCase();


  // ==========================
  // TEAM
  // ==========================

  clubName.textContent = team.toUpperCase();
  dashboardClubName.textContent = team.toUpperCase();
  homeTeam.textContent = team.toUpperCase();


  // ==========================
  // STARTING BUDGET
  // ==========================

  if (difficulty === "easy") {

    budget.textContent = "€75M";

  } else if (difficulty === "hard") {

    budget.textContent = "€25M";

  } else {

    budget.textContent = "€50M";

  }


  // ==========================
  // TEAM COLOR
  // ==========================

  if (teamColor) {
    document.documentElement.style.setProperty(
      "--accent",
      teamColor.value
    );
  }


  // ==========================
  // OPEN DASHBOARD
  // ==========================

  showScreen(dashboardScreen);

});


// ================================
// PLAY MATCH
// ================================

playMatchBtn.addEventListener("click", () => {

  const opponent = "METRO UNITED";

  const homeScore = Math.floor(Math.random() * 4);
  const awayScore = Math.floor(Math.random() * 4);

  let result;

  if (homeScore > awayScore) {
    result = "🏆 YOU WON!";
  } 
  else if (homeScore < awayScore) {
    result = "❌ YOU LOST!";
  } 
  else {
    result = "🤝 DRAW!";
  }

  alert(
    `${homeTeam.textContent} ${homeScore} - ${awayScore} ${opponent}\n\n${result}`
  );

});


// ================================
// DASHBOARD MENU
// ================================

dashboardMenuBtn.addEventListener("click", () => {
  showScreen(mainMenu);
});
