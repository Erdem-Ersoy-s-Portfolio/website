const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game variables
let paddleWidth = 10, paddleHeight = 100;
let playerPaddleY = (canvas.height - paddleHeight) / 2;
let computerPaddleY = (canvas.height - paddleHeight) / 2;
let ballX = canvas.width / 2, ballY = canvas.height / 2;
let ballSpeedX = 4, ballSpeedY = 4;
let playerScore = 0, computerScore = 0;
const winningScore = 3;
let isGameOver = false;

// Enhanced game variables
let ballSpeedIncrease = 0.5;
let paddleSpeed = 6;
let computerPaddleSpeed = 4;
let paddleColor = 'white';
let ballColor = 'white';

// Power-up variables
let powerUpActive = false;
let powerUpX, powerUpY;
const powerUpSize = 15;
let powerUpDuration = 5000; // 5 seconds
let powerUpStartTime;

function drawRect(x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

function drawCircle(x, y, radius, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, false);
    ctx.fill();
}

function drawText(text, x, y, color) {
    ctx.fillStyle = color;
    ctx.font = "30px Arial";
    ctx.fillText(text, x, y);
}

function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = -ballSpeedX;
    ballSpeedY = 4;
}

function activatePowerUp() {
    powerUpActive = true;
    powerUpX = Math.random() * (canvas.width - 40) + 20;
    powerUpY = Math.random() * (canvas.height - 40) + 20;
    powerUpStartTime = Date.now();
}

function checkPowerUpCollision() {
    if (ballX >= powerUpX && ballX <= powerUpX + powerUpSize &&
        ballY >= powerUpY && ballY <= powerUpY + powerUpSize) {
        ballSpeedX *= 1.5;
        ballSpeedY *= 1.5;
        powerUpActive = false;
    }
}

function moveEverything() {
    if (isGameOver) return;

    // Ball movement
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Ball collision with top/bottom walls
    if (ballY <= 0 || ballY >= canvas.height) {
        ballSpeedY = -ballSpeedY;
    }

    // Ball collision with paddles
    if (ballX <= paddleWidth) {
        if (ballY > playerPaddleY && ballY < playerPaddleY + paddleHeight) {
            ballSpeedX = -ballSpeedX;
            ballSpeedX += ballSpeedX > 0 ? ballSpeedIncrease : -ballSpeedIncrease;
            let deltaY = ballY - (playerPaddleY + paddleHeight / 2);
            ballSpeedY = deltaY * 0.35;
        } else {
            computerScore++;
            if (computerScore >= winningScore) {
                isGameOver = true;
            }
            resetBall();
        }
    }

    if (ballX >= canvas.width - paddleWidth) {
        if (ballY > computerPaddleY && ballY < computerPaddleY + paddleHeight) {
            ballSpeedX = -ballSpeedX;
            ballSpeedX += ballSpeedX > 0 ? ballSpeedIncrease : -ballSpeedIncrease;
        } else {
            playerScore++;
            if (playerScore >= winningScore) {
                isGameOver = true;
            }
            resetBall();
        }
    }

    // Computer paddle AI
    let computerCenter = computerPaddleY + paddleHeight / 2;
    if (computerCenter < ballY - 35) {
        computerPaddleY += computerPaddleSpeed;
    } else if (computerCenter > ballY + 35) {
        computerPaddleY -= computerPaddleSpeed;
    }

    computerPaddleY = Math.max(Math.min(computerPaddleY, canvas.height - paddleHeight), 0);

    if (!powerUpActive && Math.random() < 0.1) {
        activatePowerUp();
    }

    if (powerUpActive && Date.now() - powerUpStartTime > powerUpDuration) {
        powerUpActive = false;
    }

    if (powerUpActive) {
        checkPowerUpCollision();
    }
}

function drawEverything() {
    drawRect(0, 0, canvas.width, canvas.height, 'black');

    if (isGameOver) {
        drawText("Game Over!", canvas.width / 2 - 100, canvas.height / 2, 'white');
        drawText("Click to Restart", canvas.width / 2 - 120, canvas.height / 2 + 50, 'white');
        return;
    }

    drawRect(0, playerPaddleY, paddleWidth, paddleHeight, paddleColor);
    drawRect(canvas.width - paddleWidth, computerPaddleY, paddleWidth, paddleHeight, paddleColor);
    drawCircle(ballX, ballY, 10, ballColor);
    drawText(playerScore, 100, 100, 'white');
    drawText(computerScore, canvas.width - 100, 100, 'white');

    if (powerUpActive) {
        drawRect(powerUpX, powerUpY, powerUpSize, powerUpSize, 'green');
    }
}

function updateGame() {
    moveEverything();
    drawEverything();
}

canvas.addEventListener('mousemove', function (event) {
    let rect = canvas.getBoundingClientRect();
    let root = document.documentElement;
    let mouseY = event.clientY - rect.top - root.scrollTop;
    playerPaddleY = mouseY - paddleHeight / 2;
    playerPaddleY = Math.max(Math.min(playerPaddleY, canvas.height - paddleHeight), 0);
});

canvas.addEventListener('click', function () {
    if (isGameOver) {
        playerScore = 0;
        computerScore = 0;
        isGameOver = false;
    }
});

document.addEventListener('keydown', function (event) {
    if (event.key === 'c') {
        paddleColor = paddleColor === 'white' ? 'red' : 'white';
        ballColor = ballColor === 'white' ? 'yellow' : 'white';
    }
});

setInterval(updateGame, 1000 / 60);
