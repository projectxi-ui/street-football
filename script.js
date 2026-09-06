// WORLD FOOTBALL MANAGER
// Version 1

const openingScreen = document.getElementById("openingScreen");
const mainMenu = document.getElementById("mainMenu");
const careerScreen = document.getElementById("careerScreen");
const dashboardScreen = document.getElementById("dashboardScreen");

const startBtn = document.getElementById("startBtn");
const careerBtn = document.getElementById("careerBtn");
const backToMenu = document.getElementById("backToMenu");
const createCareerBtn = document.getElementById("createCareerBtn");

const managerInput = document.getElementById("managerInput");
const clubSelect = document.getElementById("clubSelect");
const difficultySelect = document.getElementById("difficulty");

const managerName = document.getElementById("managerName");
const clubName = document.getElementById("clubName");
const dashboardClubName = document.getElementById("dashboardClubName");
const homeTeam = document.getElementById("homeTeam");
const budget = document.getElementById("budget");

function showScreen(screen) {
  document.querySelectorAll(".screen").forEach((item) => {
    item.classList.remove("active");
  });

  screen.classList.add("active");
}

// OPENING → MAIN MENU

startBtn.addEventListener("click", () => {
  showScreen(mainMenu);
});

// MAIN MENU → CAREER

careerBtn.addEventListener("click", () => {
  showScreen(careerScreen);
});

// CAREER → MAIN MENU

backToMenu.addEventListener("click", () => {
  showScreen(mainMenu);
});

// CREATE CAREER

createCareerBtn.addEventListener("click", () => {

  let name = managerInput.value.trim();

  if (name === "") {
    name = "Manager";
  }

  const selectedClub = clubSelect.value;
  const difficulty = difficultySelect.value;

  managerName.textContent = name.toUpperCase();

  clubName.textContent = selectedClub.toUpperCase();
  dashboardClubName.textContent = selectedClub.toUpperCase();
  homeTeam.textContent = selectedClub.toUpperCase();

  // Starting budget based on difficulty
  if (difficulty === "easy") {
    budget.textContent = "€75M";
  } else if (difficulty === "hard") {
    budget.textContent = "€25M";
  } else {
    budget.textContent = "€50M";
  }

  showScreen(dashboardScreen);
});

// PLAY MATCH BUTTON

const playMatchBtn = document.getElementById("playMatchBtn");

playMatchBtn.addEventListener("click", () => {

  const opponent = "METRO UNITED";

  const homeScore = Math.floor(Math.random() * 4);
  const awayScore = Math.floor(Math.random() * 4);

  alert(
    `${homeTeam.textContent} ${homeScore} - ${awayScore} ${opponent}\n\n` +
    "Match simulation complete!"
  );
});

// DASHBOARD MENU

const dashboardMenuBtn = document.getElementById("dashboardMenuBtn");

dashboardMenuBtn.addEventListener("click", () => {
  showScreen(mainMenu);
});
