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

  const getName = () => name;
  const getSymbol = () => symbol;
  const isPlayerTurn = () => isTurn;
  const toggleTurn = () => {
    isTurn = !isTurn;
  };
  return { getName, getSymbol, isPlayerTurn, toggleTurn };
};

//game module
const game = (() => {
  let player1 = player("Player 1", "X");
  let player2 = player("Player 2", "O");
  let currentPlayer = player1;
  let isGameOver = false;
  let isDraw = false;
  let winner = null;
  const getWinner = () => winner;
  const getIsGameOver = () => isGameOver;
  const getIsDraw = () => isDraw;
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
      } else if (combination.every((value) => value === "O")) {
        winner = player2;
        isGameOver = true;
      }
    });
    if (!board.flat().includes("") && !winner) {
      isDraw = true;
      isGameOver = true;
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
    getWinner,
    getIsGameOver,
    getIsDraw,
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

  // Initialize the display and attach click event listeners
  const init = () => {
    renderBoard();
    game.init();
  };

  return { renderBoard, renderWinner, init };
})();

// landingScreen module
const landingScreen = (() => {
  const startButton = document.getElementById("startButton");
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
