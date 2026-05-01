const HUMAN_PLAYER = 'X';
const AI_PLAYER = 'O';

// DOM Elements
let cells;
let statusText;
let restartBtn;

// Game State Variables
let board = Array(9).fill(null);
let gameActive = true;
let isHumanTurn = true;

// All possible winning combinations
const winCombos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Horizontal
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Vertical
    [0, 4, 8], [2, 4, 6]             // Diagonal
];

// Initialize game when DOM is completely loaded to avoid null elements
document.addEventListener('DOMContentLoaded', () => {
    cells = document.querySelectorAll('.cell');
    statusText = document.getElementById('status');
    restartBtn = document.getElementById('restart-btn');

    // Attach click listeners to all cells
    cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    });
    
    // Attach click listener to restart button
    restartBtn.addEventListener('click', resetGame);
    
    // Set initial game state
    resetGame();
});

/**
 * Handles clicks on the game board cells
 */
function handleCellClick(e) {
    // Safely parse the cell index to integer
    const index = parseInt(e.target.getAttribute('data-index'), 10);
    
    // Prevent move if game is over, it's not the human's turn, or cell is taken
    if (!gameActive || !isHumanTurn || board[index] !== null) {
        return;
    }

    // 1. Process Human Move
    board[index] = HUMAN_PLAYER;
    e.target.textContent = HUMAN_PLAYER;
    e.target.classList.add('taken', 'x');

    // Check if human won or tied
    if (checkWinner(board, HUMAN_PLAYER)) {
        endGame(HUMAN_PLAYER);
        return;
    }
    if (isBoardFull(board)) {
        endGame('Tie');
        return;
    }

    // 2. Prepare for AI Turn
    isHumanTurn = false;
    statusText.textContent = "AI is thinking...";

    // Delay AI response slightly for better UX
    setTimeout(() => {
        const bestMoveIndex = getBestMove(board);
        
        // Execute AI move
        if (bestMoveIndex !== -1) {
            board[bestMoveIndex] = AI_PLAYER;
            const aiCell = cells[bestMoveIndex];
            aiCell.textContent = AI_PLAYER;
            aiCell.classList.add('taken', 'o');

            // Check if AI won or tied
            if (checkWinner(board, AI_PLAYER)) {
                endGame(AI_PLAYER);
                return;
            }
            if (isBoardFull(board)) {
                endGame('Tie');
                return;
            }
        }
        
        // Return turn to Human
        isHumanTurn = true;
        statusText.textContent = "Your Turn";
    }, 100);
}

/**
 * Checks if a specific player has a winning combination on the board
 * @returns {Array|null} The winning index combination, or null if no win
 */
function checkWinner(currentBoard, player) {
    for (let combo of winCombos) {
        if (currentBoard[combo[0]] === player && 
            currentBoard[combo[1]] === player && 
            currentBoard[combo[2]] === player) {
            return combo; 
        }
    }
    return null;
}

/**
 * Checks if the board is completely full (used for ties)
 */
function isBoardFull(currentBoard) {
    return currentBoard.every(cell => cell !== null);
}

/**
 * Iterates through all available spots and uses Minimax to find the best move
 * @returns {number} The index of the best move
 */
function getBestMove(currentBoard) {
    let bestScore = -Infinity;
    let move = -1;
    
    for (let i = 0; i < currentBoard.length; i++) {
        if (currentBoard[i] === null) {
            // Try AI move
            currentBoard[i] = AI_PLAYER;
            // Get score for this move (Next turn is human, so maximizing = false)
            let score = minimax(currentBoard, 0, false);
            // Undo move
            currentBoard[i] = null;
            
            // Track the best score
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    return move;
}

/**
 * Minimax recursive algorithm to evaluate board states
 */
function minimax(currentBoard, depth, isMaximizing) {
    // Base cases (Terminal states)
    if (checkWinner(currentBoard, AI_PLAYER)) return 10 - depth;
    if (checkWinner(currentBoard, HUMAN_PLAYER)) return depth - 10;
    if (isBoardFull(currentBoard)) return 0;

    if (isMaximizing) {
        // AI Turn (Maximizing score)
        let bestScore = -Infinity;
        for (let i = 0; i < currentBoard.length; i++) {
            if (currentBoard[i] === null) {
                currentBoard[i] = AI_PLAYER;
                let score = minimax(currentBoard, depth + 1, false);
                currentBoard[i] = null;
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        // Human Turn (Minimizing score)
        let bestScore = Infinity;
        for (let i = 0; i < currentBoard.length; i++) {
            if (currentBoard[i] === null) {
                currentBoard[i] = HUMAN_PLAYER;
                let score = minimax(currentBoard, depth + 1, true);
                currentBoard[i] = null;
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

/**
 * Finishes the game, sets text, and highlights winners
 */
function endGame(winnerPlayer) {
    gameActive = false;
    
    if (winnerPlayer === HUMAN_PLAYER) {
        statusText.textContent = "You Win";
        statusText.style.color = "#4ade80"; // Green
        highlightWinningCells(checkWinner(board, HUMAN_PLAYER));
        
    } else if (winnerPlayer === AI_PLAYER) {
        statusText.textContent = "AI Wins";
        statusText.style.color = "#f87171"; // Red
        highlightWinningCells(checkWinner(board, AI_PLAYER));
        
    } else {
        statusText.textContent = "Draw";
        statusText.style.color = "#cbd5e1"; // Gray
    }
}

/**
 * Adds CSS class to the winning cell sequence
 */
function highlightWinningCells(combo) {
    if (combo) {
        combo.forEach(index => {
            cells[index].classList.add('winning-cell');
        });
    }
}

/**
 * Resets the game completely
 */
function resetGame() {
    board = Array(9).fill(null);
    gameActive = true;
    isHumanTurn = true;
    
    // Reset UI for all cells
    cells.forEach(cell => {
        cell.textContent = '';
        // Clear all dynamic classes
        cell.className = 'cell'; 
    });
    
    // Reset status text
    statusText.textContent = "Your Turn";
    statusText.style.color = "#cbd5e1";
}
