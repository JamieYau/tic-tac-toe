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
    const player1 = player("Player 1", "X");
    const player2 = player("Player 2", "O");
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
        }
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
    }
    const resetGame = () => {
        gameboard.resetBoard();
        isGameOver = false;
        isDraw = false;
        winner = null;
        currentPlayer = player1;
    }
    return {getWinner, getIsGameOver, getIsDraw, getCurrentPlayer, toggleCurrentPlayer, checkWinner, resetGame}
})();

