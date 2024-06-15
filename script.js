document.addEventListener('DOMContentLoaded', () => {
    const boardContainer = document.getElementById('game-board');
    const turnIndicator = document.getElementById('turn-indicator');
    const resultMessage = document.getElementById('result-message');
    const resultText = document.getElementById('result-text');
    const resetButton = document.getElementById('reset-button');
    const resetModal = new bootstrap.Modal(document.getElementById('reset-modal'));
    const confirmReset = document.getElementById('confirm-reset');
    const cancelReset = document.getElementById('cancel-reset');
    const soloModeButton = document.getElementById('solo-mode');
    const resetScoresButton = document.getElementById('reset-scores');
    const updateNamesButton = document.getElementById('update-names');
    const player1ScoreDisplay = document.getElementById('player1-score');
    const player2ScoreDisplay = document.getElementById('player2-score');
    const player1NameInput = document.getElementById('player1-name');
    const player2NameInput = document.getElementById('player2-name');

    let currentPlayer = 'X';
    let boardSize = 3;
    let board = [];
    let player1Score = 0;
    let player2Score = 0;
    let player1Name = 'Player 1';
    let player2Name = 'Player 2';
    let soloMode = false;

    function initializeBoard(size) {
        boardSize = size;
        board = Array(size).fill().map(() => Array(size).fill(''));
        renderBoard();
        turnIndicator.textContent = `Current Turn: ${player1Name} (${currentPlayer})`;
    }

    function renderBoard() {
        boardContainer.style.gridTemplateColumns = `repeat(${boardSize}, 1fr)`;
        boardContainer.innerHTML = '';
        for (let i = 0; i < boardSize; i++) {
            for (let j = 0; j < boardSize; j++) {
                const cell = document.createElement('div');
                cell.classList.add('grid-cell');
                cell.dataset.row = i;
                cell.dataset.col = j;
                cell.addEventListener('click', handleCellClick);
                boardContainer.appendChild(cell);
            }
        }
    }

    function handleCellClick(event) {
        const row = event.target.dataset.row;
        const col = event.target.dataset.col;
        if (board[row][col] !== '') return;

        board[row][col] = currentPlayer;
        event.target.textContent = currentPlayer;

        if (checkWin(row, col)) {
            resultText.textContent = `${currentPlayer === 'X' ? player1Name : player2Name} wins!`;
            resultMessage.style.display = 'block';
            updateScores();
            setTimeout(resetGame, 5000);
        } else if (checkTie()) {
            resultText.textContent = 'It\'s a tie!';
            resultMessage.style.display = 'block';
            setTimeout(resetGame, 5000);
        } else {
            switchPlayer();
            if (soloMode && currentPlayer === 'O') {
                setTimeout(computerMove, 500);
            }
        }
    }

    function switchPlayer() {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        turnIndicator.textContent = `Current Turn: ${currentPlayer === 'X' ? player1Name : player2Name} (${currentPlayer})`;
    }

    function checkWin(row, col) {
        row = parseInt(row);
        col = parseInt(col);
        const winSymbol = board[row][col];

        
        if (board[row].every(cell => cell === winSymbol)) return true;
        
        if (board.every(row => row[col] === winSymbol)) return true;
        
        if (row === col && board.every((row, i) => row[i] === winSymbol)) return true;
        
        if (row + col === boardSize - 1 && board.every((row, i) => row[boardSize - 1 - i] === winSymbol)) return true;

        return false;
    }

    function checkTie() {
        return board.every(row => row.every(cell => cell !== ''));
    }

    function resetGame() {
        initializeBoard(boardSize);
        resultMessage.style.display = 'none';
    }

    function updateScores() {
        if (currentPlayer === 'X') {
            player1Score++;
        } else {
            player2Score++;
        }
        player1ScoreDisplay.textContent = `${player1Name}: ${player1Score}`;
        player2ScoreDisplay.textContent = `${player2Name}: ${player2Score}`;
        localStorage.setItem('player1Score', player1Score);
        localStorage.setItem('player2Score', player2Score);
    }

    function resetScores() {
        player1Score = 0;
        player2Score = 0;
        player1ScoreDisplay.textContent = `${player1Name}: ${player1Score}`;
        player2ScoreDisplay.textContent = `${player2Name}: ${player2Score}`;
        localStorage.setItem('player1Score', player1Score);
        localStorage.setItem('player2Score', player2Score);
    }

    function updateNames() {
        player1Name = player1NameInput.value || 'Player 1';
        player2Name = player2NameInput.value || 'Player 2';
        turnIndicator.textContent = `Current Turn: ${player1Name} (${currentPlayer})`;
        player1ScoreDisplay.textContent = `${player1Name}: ${player1Score}`;
        player2ScoreDisplay.textContent = `${player2Name}: ${player2Score}`;
    }

    function computerMove() {
        let emptyCells = [];
        for (let i = 0; i < boardSize; i++) {
            for (let j = 0; j < boardSize; j++) {
                if (board[i][j] === '') {
                    emptyCells.push([i, j]);
                }
            }
        }
        if (emptyCells.length > 0) {
            const [row, col] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            const cell = document.querySelector(`.grid-cell[data-row="${row}"][data-col="${col}"]`);
            cell.click();
        }
    }

    document.getElementById('size-3x3').addEventListener('click', () => initializeBoard(3));
    document.getElementById('size-4x4').addEventListener('click', () => initializeBoard(4));
    document.getElementById('size-5x5').addEventListener('click', () => initializeBoard(5));
    resetButton.addEventListener('click', () => resetModal.show());
    confirmReset.addEventListener('click', () => {
        resetModal.hide();
        resetGame();
    });
    cancelReset.addEventListener('click', () => resetModal.hide());
    resetScoresButton.addEventListener('click', resetScores);
    updateNamesButton.addEventListener('click', updateNames);
    soloModeButton.addEventListener('click', () => {
        soloMode = !soloMode;
        soloModeButton.textContent = soloMode ? 'Play Against Human' : 'Play Solo';
        resetGame();
    });

    
    player1Score = parseInt(localStorage.getItem('player1Score')) || 0;
    player2Score = parseInt(localStorage.getItem('player2Score')) || 0;
    player1ScoreDisplay.textContent = `${player1Name}: ${player1Score}`;
    player2ScoreDisplay.textContent = `${player2Name}: ${player2Score}`;

    initializeBoard(3);
});
