const gameboard = (() => {
  let board = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];
  const getBoard = () => board;
  const setBoard = (index, value) => {
    board[index] = value;
  };
  const resetBoard = () => {
    board = [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ];
  };
  return { getBoard, setBoard, resetBoard };
})();

//player factory
const player = (name, symbol) => {
  let isTurn = false;
  let score = 0;

  const getName = () => name;
  const getSymbol = () => symbol;
  const isPlayerTurn = () => isTurn;
  const toggleTurn = () => {
    isTurn = !isTurn;
  };
  const getScore = () => score;
  const incrementScore = () => {
    score++;
  };

  return {
    getName,
    getSymbol,
    isPlayerTurn,
    toggleTurn,
    getScore,
    incrementScore,
  };
};

//game module
const game = (() => {
  let player1 = player("Player 1", "X");
  let player2 = player("Player 2", "O");
  let currentPlayer = player1;
  let isGameOver = false;
  let isDraw = false;
  let winner = null;
  let round = 1;

  const getPlayer1 = () => player1;
  const getPlayer2 = () => player2;
  const getWinner = () => winner;
  const getIsGameOver = () => isGameOver;
  const getIsDraw = () => isDraw;
  const getRound = () => round;
  const getCurrentPlayer = () => currentPlayer;
  const toggleCurrentPlayer = () => {
    currentPlayer.toggleTurn();
    currentPlayer = currentPlayer === player1 ? player2 : player1;
  };

  // Function to set the initial players at the beginning of the game
  const setPlayers = (playerOne, playerTwo) => {
    player1 = playerOne;
    player2 = playerTwo;
    currentPlayer = player1;
  };

  const checkWinner = () => {
    const board = gameboard.getBoard();
    const winningCombinations = [
      [board[0][0], board[0][1], board[0][2]],
      [board[1][0], board[1][1], board[1][2]],
      [board[2][0], board[2][1], board[2][2]],
      [board[0][0], board[1][0], board[2][0]],
      [board[0][1], board[1][1], board[2][1]],
      [board[0][2], board[1][2], board[2][2]],
      [board[0][0], board[1][1], board[2][2]],
      [board[0][2], board[1][1], board[2][0]],
    ];
    winningCombinations.forEach((combination) => {
      if (combination.every((value) => value === "X")) {
        winner = player1;
        isGameOver = true;
        player1.incrementScore();
        displayController.updateScoreTable();
        round++;
      } else if (combination.every((value) => value === "O")) {
        winner = player2;
        isGameOver = true;
        player2.incrementScore();
        displayController.updateScoreTable();
        round++;
      }
    });
    if (!board.flat().includes("") && !winner) {
      isDraw = true;
      isGameOver = true;
      displayController.updateScoreTable();
      round++;
    }
  };

  const resetGame = (cells) => {
    gameboard.resetBoard();
    isGameOver = false;
    isDraw = false;
    winner = null;
    currentPlayer = player1;
    cells.forEach((cell) => {
      cell.classList.remove("x", "o");
    });
    displayController.renderBoard();
    displayController.renderWinner();
    displayController.updateScoreboard();
  };

  const handlePlayerMove = (cell) => {
    if (isGameOver) return;
    const rowIndex = cell.getAttribute("data-rowIndex");
    const colIndex = cell.getAttribute("data-colIndex");
    const board = gameboard.getBoard();
    if (board[rowIndex][colIndex] !== "") return;
    board[rowIndex][colIndex] = currentPlayer.getSymbol();
    cell.classList.add(currentPlayer.getSymbol().toLowerCase());
    displayController.renderBoard();
    checkWinner();
    toggleCurrentPlayer();
    displayController.renderWinner();
    displayController.updateScoreboard();
  };

  // Initialize the game
  const init = () => {
    const cells = document.querySelectorAll("[data-cell]");
    cells.forEach((cell) => {
      cell.addEventListener("click", () => handlePlayerMove(cell));
    });

    const resetButton = document.querySelector(".game__restart");
    resetButton.addEventListener("click", () => {
      resetGame(cells);
    });
  };

  return {
    getPlayer1,
    getPlayer2,
    getWinner,
    getIsGameOver,
    getIsDraw,
    getRound,
    getCurrentPlayer,
    toggleCurrentPlayer,
    setPlayers,
    checkWinner,
    resetGame,
    init,
  };
})();

//display module
const displayController = (() => {
  const player1Name = document.getElementById("player1-name");
  const player2Name = document.getElementById("player2-name");
  const player1Score = document.getElementById("player1-score-value");
  const player2Score = document.getElementById("player2-score-value");
  const player1Indicator = document.getElementById("player1-indicator");
  const player2Indicator = document.getElementById("player2-indicator");
  const roundIndicator = document.querySelector(".round");
  const p1Column = document.getElementById("p1-column");
  const p2Column = document.getElementById("p2-column");
  const scoreTable = document.getElementById("score-table");
  const tableBody = scoreTable.querySelector("tbody");

  const renderBoard = () => {
    const board = gameboard.getBoard();
    const cells = document.querySelectorAll(".game__board__cell");

    // Loop through each cell and update its content based on the game board state
    cells.forEach((cell) => {
      const rowIndex = cell.getAttribute("data-rowIndex");
      const colIndex = cell.getAttribute("data-colIndex");
      cell.textContent = board[rowIndex][colIndex];
    });
  };

  const renderWinner = () => {
    const winner = game.getWinner();
    const winnerDisplay = document.querySelector(".game__status");
    if (winner) {
      winnerDisplay.textContent = `${winner.getName()} wins!`;
    } else if (game.getIsDraw()) {
      winnerDisplay.textContent = "It's a draw!";
    } else {
      winnerDisplay.textContent = ""; // Clear the message if there's no winner or draw
    }
  };

  const updateScoreboard = () => {
    // Update the player names and scores
    player1Name.textContent = game.getPlayer1().getName();
    player2Name.textContent = game.getPlayer2().getName();
    player1Score.textContent = game.getPlayer1().getScore();
    player2Score.textContent = game.getPlayer2().getScore();

    // Update the current player indicator
    if (game.getCurrentPlayer() === game.getPlayer1()) {
      player1Indicator.classList.add("active");
      player2Indicator.classList.remove("active");
    } else {
      player1Indicator.classList.remove("active");
      player2Indicator.classList.add("active");
    }

    // update the round indicator
    roundIndicator.textContent = `Round ${game.getRound()}`;
  };

  const updateScoreTable = () => {
    p1Column.textContent = game.getPlayer1().getName();
    p2Column.textContent = game.getPlayer2().getName();

    const round = game.getRound();
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${round}</td>
      <td>${game.getPlayer1().getScore()}</td>
      <td>${game.getIsDraw() ? "Draw" : ""}</td>
      <td>${game.getPlayer2().getScore()}</td>
    `;
    tableBody.appendChild(row);
    scoreTable.appendChild(tableBody);
  };

  const toggleTable = () => {
    const menuButton = document.getElementById("menu");
    const table = document.querySelector(".score-table-container");
    menuButton.addEventListener("click", () => {
      console.log("clicked");
      table.classList.toggle("hidden");
    });
  };

  // Initialize the display and attach click event listeners
  const init = () => {
    renderBoard();
    game.init();
    toggleTable();
  };

  return {
    renderBoard,
    renderWinner,
    updateScoreboard,
    updateScoreTable,
    toggleTable,
    init,
  };
})();

// landingScreen module
const landingScreen = (() => {
  const startButton = document.getElementById("start-btn");
  const landingScreenContainer = document.querySelector(
    ".landing-screen-container"
  );
  const gameContainer = document.querySelector(".game-container");
  const player1Input = document.getElementById("player1");
  const player2Input = document.getElementById("player2");

  const startGame = () => {
    const player1Name = player1Input.value || "Player 1";
    const player2Name = player2Input.value || "Player 2";

    const player1 = player(player1Name, "X");
    const player2 = player(player2Name, "O");
    game.setPlayers(player1, player2);

    // Hide the landing screen and show the game board
    landingScreenContainer.style.display = "none";
    gameContainer.style.display = "flex";

    // Update the scoreboard + scoreTable
    displayController.updateScoreboard();
  };

  const init = () => {
    startButton.addEventListener("click", startGame);
  };

  return { init };
})();

// Call the init function once when the page loads
document.addEventListener("DOMContentLoaded", () => {
  landingScreen.init();
  displayController.init();
});
