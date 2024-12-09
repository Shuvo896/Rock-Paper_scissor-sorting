let sharedArray = [];
let player1 = { choice: "", index: 0 };
let player2 = { choice: "", index: 0 };
let gameActive = false;
let timer;

const generateRandomArray = () => Array.from({ length: 7 }, () => Math.floor(Math.random() * 100));

const startGame = () => {
  sharedArray = generateRandomArray();
  player1 = { choice: "", index: 0 };
  player2 = { choice: "", index: 0 };
  gameActive = true;
  document.getElementById("game-message").textContent = "Game started! Players, make your move.";
  document.getElementById("start-game").style.display = "none";
  updateArrayDisplay();
  document.getElementById("exit-game").style.display = "inline-block";

  // Start the timer
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
  player1.choice = player2.choice = "";
  updateMovesDisplay();
  document.getElementById("game-message").textContent = "Players, you have 3 seconds to make a move!";
  
  // Give players 3 seconds to make a move or assign random moves
  timer = setTimeout(() => {
    if (!player1.choice) player1.choice = ["✊🏾", "🖐🏾", "✌🏾"][Math.floor(Math.random() * 3)];
    if (!player2.choice) player2.choice = ["✊🏾", "🖐🏾", "✌🏾"][Math.floor(Math.random() * 3)];
    resolveRound();
  }, 3000);
};

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
  }

  startRound();
};

const determineWinner = (choice1, choice2) => {
  if (choice1 === choice2) return "Tie";
  if (
    (choice1 === "✊🏾" && choice2 === "✌🏾") ||
    (choice1 === "🖐🏾" && choice2 === "✊🏾") ||
    (choice1 === "✌🏾" && choice2 === "🖐🏾")
  ) {
    return "Player 1";
  }
  return "Player 2";
};

const handleKeyPress = (event) => {
  if (!gameActive) return;

  const key = event.key.toLowerCase();
  if (["a", "s", "d"].includes(key)) {
    player1.choice = key === "a" ? "✊🏾" : key === "s" ? "🖐🏾" : "✌🏾";
    updateMovesDisplay();
  } else if (["j", "k", "l"].includes(key)) {
    player2.choice = key === "j" ? "✊🏾" : key === "k" ? "🖐🏾" : "✌🏾";
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

document.getElementById("start-game").addEventListener("click", startGame);
document.getElementById("exit-game").addEventListener("click", exitGame);
window.addEventListener("keydown", handleKeyPress);
