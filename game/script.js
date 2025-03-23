const emojis = ["🐱", "🐶", "🐹", "🐸", "🐼", "🐵", "🦁", "🐯"];
const gameBoard = document.getElementById("game-board");
const startBtn = document.getElementById("start-btn");
const cardCountInput = document.getElementById("card-count");
const setup = document.getElementById("setup");
const resultModal = document.getElementById("result-modal");
const resultText = document.getElementById("result-text");
const playAgainBtn = document.getElementById("play-again");
const errorModal = document.getElementById("error-modal");
const errorText = document.getElementById("error-text");
const closeErrorBtn = document.getElementById("close-error");

let flippedCards = [];
let lockBoard = false;
let attempts = 0;
let matches = 0;
let totalPairs = 0;

startBtn.addEventListener("click", startGame);
playAgainBtn.addEventListener("click", resetToSetup);

closeErrorBtn.addEventListener("click", () => {
  errorModal.style.display = "none";
});

function startGame() {
  const count = parseInt(cardCountInput.value);

  if (isNaN(count) || count % 2 !== 0 || count > 16 || count < 2) {
    errorText.innerText = "Please enter an even number between 2 and 16.";
    errorModal.style.display = "flex";
    return;
  }

  setup.style.display = "none";
  gameBoard.style.display = "grid";
  resetGame();

  const selected = emojis.slice(0, count / 2);
  const cards = shuffle([...selected, ...selected]);
  totalPairs = count / 2;

  gameBoard.style.gridTemplateColumns = `repeat(${Math.min(
    count / 2,
    4
  )}, 100px)`;

  cards.forEach((emoji, index) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.emoji = emoji;
    card.dataset.index = index;

    card.innerHTML = `
    <div class="card-inner">
      <div class="card-front"></div>
      <div class="card-back">${emoji}</div>
    </div>
  `;

    card.addEventListener("click", handleCardClick);
    gameBoard.appendChild(card);
  });
}

function handleCardClick(e) {
  const card = e.currentTarget;

  if (lockBoard || card.classList.contains("flipped")) return;

  card.classList.add("flipped");
  flippedCards.push(card);

  if (flippedCards.length === 2) {
    attempts++;
    lockBoard = true;
    const [first, second] = flippedCards;

    if (first.dataset.emoji === second.dataset.emoji) {
      flippedCards = [];
      lockBoard = false;
      matches++;

      if (matches === totalPairs) {
        setTimeout(() => {
          resultText.innerText = `🎉 You matched all cards in ${attempts} attempts!`;
          resultModal.style.display = "flex";
        }, 600);
      }
    } else {
      setTimeout(() => {
        first.classList.remove("flipped");
        second.classList.remove("flipped");
        flippedCards = [];
        lockBoard = false;
      }, 1000);
    }
  }
}

function shuffle(array) {
  return array.sort(() => 0.5 - Math.random());
}

function resetGame() {
  gameBoard.innerHTML = "";
  attempts = 0;
  matches = 0;
  flippedCards = [];
  lockBoard = false;
}

function resetToSetup() {
  resultModal.style.display = "none";
  gameBoard.style.display = "none";
  setup.style.display = "flex";
}
