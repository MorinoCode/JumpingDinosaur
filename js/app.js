// 📁 app.js

// Element references
const gameArea = document.getElementById("mainGame");
const dino = document.getElementById("dino");
const dinoHome = document.getElementById("dinoHome");
const cactusContainer = document.getElementById("cactuses");
const gameOverMessage = document.getElementById("gameOver");
const restartBtn = document.getElementById("restartBtn");
const playBtn = document.getElementById("playBtn");
const jumpSound = new Audio("sounds/jump.mp3");
const gameOverSound = new Audio("sounds/gameover.mp3");
const distanceMeter = document.getElementById("distanceMeter");

// Game state
let isGameOver = false;
let spawnIntervalId = null;
let collisionCheckId = null;
let gameStarted = false;
let distance = 0;
let distanceIntervalId = null;

// Function to make the dino jump
function jumpDino() {
  if (dino.classList.contains("jumping")) return;

  jumpSound.play();

  dino.classList.add("jumping");
  dino.style.bottom = "150px";

  setTimeout(() => {
    dino.style.bottom = "0px";
    dino.classList.remove("jumping");
  }, 600);
}

// Function to create a single cactus
function spawnCactus() {
  if (isGameOver) return;

  const newCactus = document.createElement("img");
  newCactus.src = "img/cactus.png";
  newCactus.classList.add("cactus");
  newCactus.style.right = "-50px";

  cactusContainer.appendChild(newCactus);
}

// Collision detection function
function checkCollision() {
  const allCactuses = document.querySelectorAll(".cactus");
  const dinoRect = dino.getBoundingClientRect();

  allCactuses.forEach((cactus) => {
    const cactusRect = cactus.getBoundingClientRect();

    const horizontalOverlap =
      cactusRect.left < dinoRect.right && cactusRect.right > dinoRect.left;

    const verticalOverlap =
      dinoRect.bottom > cactusRect.top && dinoRect.top < cactusRect.bottom;

    if (horizontalOverlap && verticalOverlap) {
      gameOver();
    }
  });
}

// Game over handler
function gameOver() {
  isGameOver = true;
  gameOverMessage.style.display = "block";
  gameOverSound.play();

  clearInterval(spawnIntervalId);
  clearInterval(collisionCheckId);
  clearInterval(distanceIntervalId);

  const allCactuses = document.querySelectorAll(".cactus");
  allCactuses.forEach((cactus) => {
    cactus.style.animationPlayState = "paused";
  });

  restartBtn.style.display = "block";
}

// Restart button handler
restartBtn.addEventListener("click", () => {
  isGameOver = false;
  gameOverMessage.style.display = "none";
  restartBtn.style.display = "none";
  cactusContainer.innerHTML = "";
  distance = 0;
  distanceMeter.textContent = `Distance: 0 m`;

  gameLoop();
});

// Play button handler
playBtn.addEventListener("click", () => {
  if (!gameStarted) {
    gameStarted = true;
    playBtn.style.display = "none";
    gameLoop();
  }
});

// Game loop to start cactus spawning and collision checks
function gameLoop() {
  if (isGameOver) return;

  // Spawn cactus at random intervals (4-10 seconds)
  spawnCactus();
  spawnIntervalId = setInterval(() => {
    spawnCactus();
  }, Math.floor(Math.random() * 7 + 4) * 1000);

  distance = 0;
  distanceMeter.textContent = `Distance: 0 m`;
  distanceIntervalId = setInterval(() => {
    if (!isGameOver) {
      distance++;
      distanceMeter.textContent = `Distance: ${distance} m`;
    }
  }, 100);

  // Check collision every 100ms
  collisionCheckId = setInterval(() => {
    if (!isGameOver) checkCollision();
  }, 100);

  // Dino jump handlers
  gameArea.addEventListener("click", jumpDino);
  window.addEventListener("keydown", (e) => {
    if (e.code === "Space") jumpDino();
  });
}
