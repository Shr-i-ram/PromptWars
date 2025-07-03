document.addEventListener("DOMContentLoaded", () => {
  fetch("locations.json")
    .then(res => res.json())
    .then(allLocations => startGame(allLocations))
    .catch(err => console.error("Failed to load locations.json:", err));
});

function startGame(allLocations) {
  let selectedLocations = [];
  let current;
  let score = 0;
  let questionNumber = 0;
  const maxQuestions = 5;
  const levels = [
    "Youngling",
    "Apprentice",
    "Sith Acolyte",
    "Sith Warrior",
    "Sith Lord",
    "Sith Master"
  ];

  const hint = document.getElementById("hint");
  const optionsDiv = document.getElementById("options");
  const feedback = document.getElementById("feedback");
  const scoreDisplay = document.getElementById("score");
  const levelDisplay = document.getElementById("level");
  const loginDiv = document.getElementById("login");
  const gameDiv = document.getElementById("game");
  const startBtn = document.getElementById("startBtn");
  const mapContainer = document.getElementById("map");
  const leaderboardDiv = document.getElementById("leaderboard");

  let map;

  function initializeMap() {
    if (mapContainer._leaflet_id) {
      mapContainer._leaflet_id = null;
    }

    map = L.map(mapContainer).setView([0, 0], 2);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18
    }).addTo(map);
  }

  function shuffle(array) {
    let currentIndex = array.length,
      randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[currentIndex]] = [
        array[randomIndex],
        array[currentIndex]
      ];
    }
    return array;
  }

  function newRound() {
    if (questionNumber >= maxQuestions) {
      feedback.textContent = `Game Over! Final Score: ${score} / ${maxQuestions}`;
      optionsDiv.innerHTML = "";
      updateLeaderboard();
      return;
    }

    feedback.textContent = "";
    optionsDiv.innerHTML = "";
    map.setView([0, 0], 2);

    map.eachLayer(layer => {
      if (layer instanceof L.Marker) map.removeLayer(layer);
    });

    current = selectedLocations[questionNumber];
    hint.textContent = current.hint;

    const incorrectChoices = shuffle(
      allLocations.filter(l => l.planet !== current.planet)
    ).slice(0, 3);
    const allChoices = shuffle([...incorrectChoices, current]);

    allChoices.forEach(opt => {
      const btn = document.createElement("button");
      btn.textContent = opt.planet;
      btn.onclick = () => guess(opt.planet);
      optionsDiv.appendChild(btn);
    });
  }

  function updateScore(correct) {
    if (correct) score++;
    scoreDisplay.textContent = score;
    const levelIndex = Math.min(
      Math.floor((score / maxQuestions) * levels.length),
      levels.length - 1
    );
    levelDisplay.textContent = levels[levelIndex];
  }

  function updateLeaderboard() {
    const playerName = document.getElementById("username").value.trim();
    if (!playerName) return;

    let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
    leaderboard.push({ name: playerName, score });
    leaderboard.sort((a, b) => b.score - a.score);
    leaderboard = leaderboard.slice(0, 5);
    localStorage.setItem("leaderboard", JSON.stringify(leaderboard));

    leaderboardDiv.innerHTML =
      "<h3>Leaderboard</h3><ul>" +
      leaderboard.map(player => `<li>${player.name}: ${player.score}</li>`).join("") +
      "</ul>";
  }

  function guess(planet) {
  if (planet === current.planet) {
    feedback.textContent = `Correct! This was ${current.planet} \n(${current.real_location})`;
    setTimeout(() => {
      map.setView([current.lat, current.lng], 5);
      L.marker([current.lat, current.lng]).addTo(map)
        .bindPopup(current.real_location).openPopup();
    }, 200); // delay added for proper render
    updateScore(true);
  } else {
    feedback.textContent = "Incorrect. Sith apprentice, onward to the next!";
    updateScore(false);
  }
  questionNumber++;
  setTimeout(() => newRound(), 1500); // slight delay before next question
}


  const homeBtn = document.getElementById("homeBtn");
homeBtn.addEventListener("click", () => {
  gameDiv.style.display = "none";
  loginDiv.style.display = "flex";
});

  startBtn.addEventListener("click", () => {
    const name = document.getElementById("username").value.trim();
    if (!name) return alert("Enter a Sith name to continue");

    loginDiv.style.display = "none";
    gameDiv.style.display = "block";
    score = 0;
    questionNumber = 0;
    scoreDisplay.textContent = score;
    levelDisplay.textContent = levels[0];
    selectedLocations = shuffle([...allLocations]).slice(0, maxQuestions);

    initializeMap();
    newRound();
  });

  const aiBtn = document.getElementById("sithAiBtn");
  if (aiBtn) {
    aiBtn.addEventListener("click", () => {
      window.open("sith_ai.html", "_blank");
    });
  }
}
