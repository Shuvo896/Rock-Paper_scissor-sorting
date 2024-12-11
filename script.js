let sharedArray = [];
let player1 = { choice: "", index: 0 };
let player2 = { choice: "", index: 0 };
let gameActive = false;
let timer;

const generateRandomArray = () => Array.from({ length: 8 }, () => Math.floor(Math.random() * 100));

const startGame = () => {
  sharedArray = generateRandomArray();
  player1 = { choice: "", index: 0 };
  player2 = { choice: "", index: 0 };
  gameActive = true;

  document.getElementById("game-message").textContent = "Game started! Players, make your move.";
  document.getElementById("start-game").style.display = "none";
  document.getElementById("exit-game").style.display = "inline-block";

  updateMovesDisplay();
  updateArrayDisplay();
  startRound();
};

const exitGame = () => {
  gameActive = false;
  clearTimeout(timer);
  document.getElementById("game-message").textContent = "Game exited. Press 'START GAME' to play again.";
  resetGame();
};

const resetGame = () => {
  toggleSortButtons(false, false);
  updateMovesDisplay();
  document.getElementById("shared-array").innerHTML = "";
  document.getElementById("start-game").style.display = "inline-block";
  document.getElementById("exit-game").style.display = "none";
};

const startRound = () => {
  if (isSorted()) {
    gameActive = false;
    document.getElementById("game-message").textContent = "The array is fully sorted! Game over.";
    return;
  }

  clearTimeout(timer);
  player1.choice = player2.choice = "";
  updateMovesDisplay();
  document.getElementById("game-message").textContent = "Players, make your move!";

  timer = setTimeout(() => {
    if (!player1.choice && !player2.choice) {
      document.getElementById("game-message").textContent = "No moves made! Press AGAIN.";
      document.getElementById("again-btn").style.display = "block";
    } else {
      resolveRound();
    }
  }, 3000);
};

document.getElementById("again-btn").addEventListener("click", () => {
  document.getElementById("again-btn").style.display = "none";
  startRound();
});

const resolveRound = () => {
  const winner = determineWinner(player1.choice, player2.choice);

  if (winner === "Player 1") {
    toggleSortButtons(true, false);
    document.getElementById("game-message").textContent = "Player 1 will sort.";
  } else if (winner === "Player 2") {
    toggleSortButtons(false, true);
    document.getElementById("game-message").textContent = "Player 2 will sort.";
  } else {
    document.getElementById("game-message").textContent = "It's a tie! Play again.";
    toggleSortButtons(false, false);
    setTimeout(startRound, 1000);
  }
};

const determineWinner = (choice1, choice2) => {
  if (choice1 === choice2) return "Tie";
  if (
    (choice1 === "✊" && choice2 === "✌") ||
    (choice1 === "🖐" && choice2 === "✊") ||
    (choice1 === "✌" && choice2 === "🖐")
  ) {
    return "Player 1";
  }
  return "Player 2";
};

const handleKeyPress = (event) => {
  if (!gameActive) return;

  const key = event.key.toLowerCase();
  if (["a", "s", "d"].includes(key)) {
    player1.choice = key === "a" ? "✊" : key === "s" ? "🖐" : "✌";
    updateMovesDisplay();
  } else if (["j", "k", "l"].includes(key)) {
    player2.choice = key === "j" ? "✊" : key === "k" ? "🖐" : "✌";
    updateMovesDisplay();
  }
};

const toggleSortButtons = (player1Enabled, player2Enabled) => {
  document.getElementById("player1-sort").style.display = player1Enabled ? "inline-block" : "none";
  document.getElementById("player2-sort").style.display = player2Enabled ? "inline-block" : "none";
};

const updateMovesDisplay = () => {
  document.getElementById("player1-move").textContent = player1.choice || "?";
  document.getElementById("player2-move").textContent = player2.choice || "?";
};

const updateArrayDisplay = () => {
  document.getElementById("shared-array").innerHTML = sharedArray
    .map((num) => `<div class="array-item">${num}</div>`)
    .join("");
};

const sortArray = (player) => {
  if (!gameActive) return;

  let swapped = false;
  for (let i = 0; i < sharedArray.length - 1; i++)
  {
    if (sharedArray[i] > sharedArray[i + 1])
    {
      [sharedArray[i], sharedArray[i + 1]] = [sharedArray[i + 1], sharedArray[i]];
      swapped = true;
      break;
    }
  }

  updateArrayDisplay();

  if (isSorted()) {
    gameActive = false;
    document.getElementById("game-message").textContent = `Player ${player} wins by completing the array!`;
    toggleSortButtons(false, false);
  } else {
    document.getElementById("game-message").textContent = `Player ${player} sorted a step!`;
    toggleSortButtons(false, false);
    setTimeout(startRound, 1000);
  }
};

const isSorted = () => {
  for (let i = 0; i < sharedArray.length - 1; i++) {
    if (sharedArray[i] > sharedArray[i + 1]) return false;
  }
  return true;
};

document.getElementById("player1-sort").addEventListener("click", () => sortArray(1));
document.getElementById("player2-sort").addEventListener("click", () => sortArray(2));
document.getElementById("start-game").addEventListener("click", startGame);
document.getElementById("game-message").addEventListener("click", isSorted);
document.getElementById("exit-game").addEventListener("click", exitGame);
window.addEventListener("keydown", handleKeyPress);
