const symbols = ["🍎","🍌","🍇","🍒","🥝","🍉","🍍","🍑"];
let cards = [...symbols, ...symbols];
let flippedCards = [];
let matchedCards = 0;
let moves = 0;
let timer = 0;
let interval;
let bgMusic;
let isMuted = false;

// Start Game
document.getElementById("start-btn").addEventListener("click", function() {
  document.getElementById("start-screen").style.display = "none";
  document.getElementById("game-container").style.display = "block";

  let startSound = new Audio("Sounds/start-sound.mp3");
  startSound.play();

  bgMusic = new Audio("Sounds/bg-music.mp3");
  bgMusic.loop = true;
  bgMusic.volume = 0.5;
  bgMusic.play();

  startGame();
});

function startGame() {
  shuffle(cards);
  const board = document.getElementById("game-board");
  board.innerHTML = "";
  cards.forEach(symbol => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <div class="card-inner">
        <div class="card-front"></div>
        <div class="card-back">${symbol}</div>
      </div>
    `;
    board.appendChild(card);

    card.addEventListener("click", () => flipCard(card, symbol));
  });

  moves = 0;
  matchedCards = 0;
  timer = 0;
  document.getElementById("moves").innerText = moves;
  document.getElementById("time").innerText = timer;
  clearInterval(interval);
  interval = setInterval(() => {
    timer++;
    document.getElementById("time").innerText = timer;
  }, 1000);
}

// Flip logic
function flipCard(card, symbol) {
  if (flippedCards.length < 2 && !card.classList.contains("flip")) {
    card.classList.add("flip");
    flippedCards.push({card, symbol});

    playSound("Sounds/flip.mp3");

    if (flippedCards.length === 2) {
      moves++;
      document.getElementById("moves").innerText = moves;

      if (flippedCards[0].symbol === flippedCards[1].symbol) {
        matchedCards += 2;
        playSound("Sounds/match.mp3", 0.5); // play only 0.5 sec of match sound
        flippedCards = [];
        if (matchedCards === cards.length) {
          setTimeout(() => {
            clearInterval(interval);
            showVictoryScreen(moves, timer);
          }, 500);
        }
      } else {
        setTimeout(() => {
          flippedCards[0].card.classList.remove("flip");
          flippedCards[1].card.classList.remove("flip");
          flippedCards = [];
        }, 1000);
      }
    }
  }
}

// Shuffle
function shuffle(array) {
  array.sort(() => 0.5 - Math.random());
}

// Victory
function showVictoryScreen(moves, time) {
  document.getElementById("final-moves").innerText = moves;
  document.getElementById("final-time").innerText = time;
  document.getElementById("victory-screen").style.display = "flex";

  playSound("Sounds/win.mp3");
}

// Restart
document.getElementById("restart-btn").addEventListener("click", startGame);
document.getElementById("play-again").addEventListener("click", () => {
  document.getElementById("victory-screen").style.display = "none";
  startGame();
});

// Background Music Mute/Unmute
document.getElementById("mute-btn").addEventListener("click", function() {
  if (bgMusic) {
    if (isMuted) {
      bgMusic.play();
      this.innerText = "🔊";
    } else {
      bgMusic.pause();
      this.innerText = "🔇";
    }
    isMuted = !isMuted;
  }
});

// Play Sound Helper
function playSound(file, cutDuration = null) {
  if (!isMuted) {
    let sound = new Audio(file);
    sound.play();

    // If cutDuration is provided, stop the sound after that time
    if (cutDuration) {
      setTimeout(() => {
        sound.pause();
        sound.currentTime = 0;
      }, cutDuration * 1000); // convert sec → ms
    }
  }
}
