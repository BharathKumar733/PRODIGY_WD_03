let playerText = document.getElementById('playerText');
let restartBtn = document.getElementById('restartBtn');
let boxes = Array.from(document.getElementsByClassName('box'));

let winnerIndicator = getComputedStyle(document.body).getPropertyValue('--winning-blocks');

const O_TEXT = "O";
const X_TEXT = "X";
let currentPlayer = X_TEXT;
let spaces = Array(9).fill(null);

const startGame = () => {
    playerText.innerHTML = `${currentPlayer}'s turn`; // Initial display of current player's turn
    boxes.forEach(box => box.addEventListener('click', boxClicked));
}

function boxClicked(e) {
    const id = e.target.id;

    if (!spaces[id] && currentPlayer === X_TEXT) {
        spaces[id] = currentPlayer;
        e.target.innerText = currentPlayer;

        if (playerHasWon() !== false) {
            endGame(`${currentPlayer} has won!`);
            return;
        }

        // Check for a draw
        if (spaces.every(space => space !== null)) {
            endGame("It's a draw!");
            return;
        }

        currentPlayer = O_TEXT;
        playerText.innerHTML = `${currentPlayer}'s turn`; // Update to show O's turn
        setTimeout(aiMove, 500); // Add a delay for AI "thinking"
    }
}

function aiMove() {
    let bestScore = -Infinity;
    let bestMove;

    spaces.forEach((space, index) => {
        if (space === null) {
            spaces[index] = O_TEXT;
            let score = minimax(spaces, 0, false);
            spaces[index] = null;
            if (score > bestScore) {
                bestScore = score;
                bestMove = index;
            }
        }
    });

    spaces[bestMove] = O_TEXT;
    boxes[bestMove].innerText = O_TEXT;

    if (playerHasWon() !== false) {
        endGame(`${O_TEXT} has won!`);
        return;
    }

    // Check for a draw after AI's move
    if (spaces.every(space => space !== null)) {
        endGame("It's a draw!");
        return;
    }

    currentPlayer = X_TEXT;
    playerText.innerHTML = `${currentPlayer}'s turn`; // Update to show X's turn
}

function minimax(board, depth, isMaximizing) {
    const winner = playerHasWon();
    if (winner === O_TEXT) return 10 - depth;
    if (winner === X_TEXT) return depth - 10;
    if (board.every(cell => cell !== null)) return 0; // Tie

    if (isMaximizing) {
        let bestScore = -Infinity;
        board.forEach((space, index) => {
            if (space === null) {
                board[index] = O_TEXT;
                let score = minimax(board, depth + 1, false);
                board[index] = null;
                bestScore = Math.max(score, bestScore);
            }
        });
        return bestScore;
    } else {
        let bestScore = Infinity;
        board.forEach((space, index) => {
            if (space === null) {
                board[index] = X_TEXT;
                let score = minimax(board, depth + 1, true);
                board[index] = null;
                bestScore = Math.min(score, bestScore);
            }
        });
        return bestScore;
    }
}

function endGame(message) {
    playerText.innerHTML = message;
    let winning_blocks = playerHasWon();
    if (winning_blocks) {
        winning_blocks.map(box => boxes[box].style.backgroundColor = winnerIndicator);
    }
}

const winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function playerHasWon() {
    for (const condition of winningCombos) {
        let [a, b, c] = condition;
        if (spaces[a] && (spaces[a] === spaces[b] && spaces[a] === spaces[c])) {
            return spaces[a];
        }
    }
    return false;
}

restartBtn.addEventListener('click', restart);

function restart() {
    spaces.fill(null);

    boxes.forEach(box => {
        box.innerText = '';
        box.style.backgroundColor = '';
    });

    playerText.innerHTML = 'Tic Tac Toe'; // Reset display
    currentPlayer = X_TEXT;
    playerText.innerHTML = `${currentPlayer}'s turn`; // Show X's turn on reset
}

startGame();
