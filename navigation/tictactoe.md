---
layout: default
title: Tic Tac Toe Game
permalink: /ttt
---
<style>
body {
    margin: 0;
    padding: 20px;
    font-family: 'Arial', sans-serif;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
}

.game-container {
    text-align: center;
    background: rgba(255, 255, 255, 0.1);
    padding: 2rem;
    border-radius: 20px;
    backdrop-filter: blur(10px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

h1 {
    margin-bottom: 1rem;
    font-size: 2.5rem;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
    color: #ecf0f1;
}

.game-info {
    margin-bottom: 1.5rem;
    font-size: 1.2rem;
}

.board {
    display: grid;
    grid-template-columns: repeat(3, 100px);
    grid-template-rows: repeat(3, 100px);
    gap: 4px;
    margin: 0 auto 1.5rem;
    background: rgba(255, 255, 255, 0.2);
    padding: 4px;
    border-radius: 12px;
}

.cell {
    background: rgba(255, 255, 255, 0.9);
    border: none;
    border-radius: 8px;
    font-size: 2rem;
    font-weight: bold;
    color: #333;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
}

.cell:hover:not(.taken) {
    background: rgba(255, 255, 255, 1);
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.cell.taken {
    cursor: not-allowed;
}

.cell.x {
    color: #e74c3c;
}

.cell.o {
    color: #3498db;
}

.cell.winning {
    background: linear-gradient(45deg, #f39c12, #f1c40f);
    animation: pulse 0.6s ease-in-out;
}

@keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
}

.reset-btn {
    background: linear-gradient(45deg, #e74c3c, #c0392b);
    color: white;
    border: none;
    padding: 12px 24px;
    font-size: 1.1rem;
    border-radius: 25px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-family: 'Arial', sans-serif;
}

.reset-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(231, 76, 60, 0.4);
    background: linear-gradient(45deg, #c0392b, #a93226);
}

.current-player {
    font-weight: bold;
    font-size: 1.4rem;
    margin-bottom: 0.5rem;
}

.game-status {
    font-size: 1.3rem;
    font-weight: bold;
    margin-bottom: 1rem;
    min-height: 1.5rem;
}

.winner {
    color: #f1c40f;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.draw {
    color: #95a5a6;
}

.controls {
    margin-top: 20px;
    text-align: center;
    color: #bdc3c7;
    font-size: 1rem;
}
</style>

<div class="game-container">
    <h1>🎮 Tic Tac Toe</h1>
    
    <div class="game-info">
        <div class="current-player" id="currentPlayer">Current Player: <span style="color: #e74c3c;">X</span></div>
        <div class="game-status" id="gameStatus"></div>
    </div>

    <div class="board" id="board">
        <button class="cell" data-index="0"></button>
        <button class="cell" data-index="1"></button>
        <button class="cell" data-index="2"></button>
        <button class="cell" data-index="3"></button>
        <button class="cell" data-index="4"></button>
        <button class="cell" data-index="5"></button>
        <button class="cell" data-index="6"></button>
        <button class="cell" data-index="7"></button>
        <button class="cell" data-index="8"></button>
    </div>

    <button class="reset-btn" onclick="restartGame()">🔄 New Game</button>
    
    <div class="controls">
        Click any empty cell to make your move<br>
        First to get 3 in a row wins!
    </div>
</div>

<script>
let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;

// Winning combinations
const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
];

// Get DOM elements
const cells = document.querySelectorAll('.cell');
const currentPlayerDisplay = document.getElementById('currentPlayer');
const gameStatus = document.getElementById('gameStatus');

// Add click event listeners to all cells
cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
});

function handleCellClick(e) {
    const cellIndex = parseInt(e.target.getAttribute('data-index'));

    // Check if cell is already taken or game is not active
    if (gameBoard[cellIndex] !== '' || !gameActive) {
        return;
    }

    // Make the move
    makeMove(cellIndex);
}

function makeMove(index) {
    // Update game board
    gameBoard[index] = currentPlayer;
    
    // Update cell display
    const cell = cells[index];
    cell.textContent = currentPlayer;
    cell.classList.add('taken', currentPlayer.toLowerCase());

    // Check for win or draw
    if (checkWin()) {
        gameActive = false;
        highlightWinningCells();
        gameStatus.innerHTML = `<span class="winner">🎉 Player ${currentPlayer} Wins!</span>`;
        currentPlayerDisplay.style.display = 'none';
    } else if (checkDraw()) {
        gameActive = false;
        gameStatus.innerHTML = `<span class="draw">🤝 It's a Draw!</span>`;
        currentPlayerDisplay.style.display = 'none';
    } else {
        // Switch player
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        updateCurrentPlayerDisplay();
    }
}

function checkWin() {
    return winningCombinations.some(combination => {
        const [a, b, c] = combination;
        return gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c];
    });
}

function checkDraw() {
    return gameBoard.every(cell => cell !== '');
}

function highlightWinningCells() {
    winningCombinations.forEach(combination => {
        const [a, b, c] = combination;
        if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
            cells[a].classList.add('winning');
            cells[b].classList.add('winning');
            cells[c].classList.add('winning');
        }
    });
}

function updateCurrentPlayerDisplay() {
    const color = currentPlayer === 'X' ? '#e74c3c' : '#3498db';
    currentPlayerDisplay.innerHTML = `Current Player: <span style="color: ${color};">${currentPlayer}</span>`;
}

function restartGame() {
    currentPlayer = 'X';
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    
    // Clear all cells
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('taken', 'x', 'o', 'winning');
    });

    // Reset displays
    gameStatus.textContent = '';
    currentPlayerDisplay.style.display = 'block';
    updateCurrentPlayerDisplay();
}

// Initialize the display
updateCurrentPlayerDisplay();
</script>