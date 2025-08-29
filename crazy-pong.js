// crazy-pong.js

// Canvas setup
const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');
canvas.width = 900;
canvas.height = 600;

// Paddle settings
const paddleWidth = 10, paddleHeight = 100;
let leftY = canvas.height / 2 - paddleHeight / 2;
let rightY = canvas.height / 2 - paddleHeight / 2;
let leftVY = 0, rightVY = 0;
const paddleAccel = 1.2;
const paddleMaxSpeed = 10;
const paddleFriction = 0.85;

// Ball settings
let ballX = canvas.width / 2, ballY = canvas.height / 2;
let ballVX = 2, ballVY = 1.2;
const ballSize = 12;
let crazyMode = false;
let startTime = Date.now();
const ballSpeedPreset = [1, 2, 4, 7];

// Game state
let gameStarted = false;
let paused = false;
let savedBallVX = 0, savedBallVY = 0;

// Controls container
const controlsContainer = document.querySelector('.game-controls');

// Speed selector
const speedLabel = document.createElement('label');
speedLabel.textContent = "Ball Speed: ";
speedLabel.htmlFor = "speedSelect";

const speedSelect = document.createElement('select');
["Slow", "Normal", "Fast", "Insane"].forEach((label, i) => {
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = label;
    speedSelect.appendChild(opt);
});
speedSelect.value = "1"; // Default to Normal
speedLabel.appendChild(speedSelect);

// Start button
const startBtn = document.createElement('button');
startBtn.textContent = "Start Game";
startBtn.style.background = "#333";
startBtn.style.color = "#fff";

// Pause button
const pauseBtn = document.createElement('button');
pauseBtn.textContent = "Pause";
pauseBtn.style.background = "#555";
pauseBtn.style.color = "#fff";
pauseBtn.style.display = "none";

// Resume button
const resumeBtn = document.createElement('button');
resumeBtn.textContent = "Resume";
resumeBtn.style.background = "#007bff";
resumeBtn.style.color = "#fff";
resumeBtn.style.display = "none";

// Append controls
controlsContainer.appendChild(speedLabel);
controlsContainer.appendChild(startBtn);
controlsContainer.appendChild(pauseBtn);
controlsContainer.appendChild(resumeBtn);

// Event listeners
speedSelect.addEventListener('change', () => {
    const idx = parseInt(speedSelect.value);
    const speed = ballSpeedPreset[idx];
    const angle = Math.atan2(ballVY, ballVX);
    ballVX = speed * Math.cos(angle);
    ballVY = speed * Math.sin(angle);
});

startBtn.addEventListener('click', () => {
    gameStarted = true;
    startBtn.style.display = "none";
    pauseBtn.style.display = "inline-block";
    startTime = Date.now();
    gameLoop();
});

pauseBtn.addEventListener('click', () => {
    paused = true;
    savedBallVX = ballVX;
    savedBallVY = ballVY;
    ballVX = 0;
    ballVY = 0;
    pauseBtn.style.display = "none";
    resumeBtn.style.display = "inline-block";
});

resumeBtn.addEventListener('click', () => {
    paused = false;
    ballVX = savedBallVX;
    ballVY = savedBallVY;
    resumeBtn.style.display = "none";
    pauseBtn.style.display = "inline-block";
    gameLoop();
});

// Keyboard controls
const keys = {};
document.addEventListener('keydown', e => { keys[e.key] = true; });
document.addEventListener('keyup', e => { keys[e.key] = false; });

// Crazy mode after 20s
setTimeout(() => {
    crazyMode = true;
    const speed = 6;
    const angle = Math.atan2(ballVY, ballVX);
    ballVX = speed * Math.cos(angle);
    ballVY = speed * Math.sin(angle);
}, 20000);

// Game functions
function drawTimer() {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    ctx.font = "32px Arial";
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.fillText(`Time: ${elapsed}s`, canvas.width / 2, 40);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#fff";
    ctx.fillRect(10, leftY, paddleWidth, paddleHeight);
    ctx.fillRect(canvas.width - 20, rightY, paddleWidth, paddleHeight);
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballSize, 0, Math.PI * 2);
    ctx.fill();
    drawTimer();
}

function movePaddles() {
    if (keys['w']) leftVY -= paddleAccel;
    if (keys['s']) leftVY += paddleAccel;
    leftVY *= paddleFriction;
    leftVY = Math.max(-paddleMaxSpeed, Math.min(paddleMaxSpeed, leftVY));
    leftY = Math.max(0, Math.min(canvas.height - paddleHeight, leftY + leftVY));

    if (keys['ArrowUp']) rightVY -= paddleAccel;
    if (keys['ArrowDown']) rightVY += paddleAccel;
    rightVY *= paddleFriction;
    rightVY = Math.max(-paddleMaxSpeed, Math.min(paddleMaxSpeed, rightVY));
    rightY = Math.max(0, Math.min(canvas.height - paddleHeight, rightY + rightVY));
}

function update() {
    movePaddles();
    ballX += ballVX;
    ballY += ballVY;

    if (ballY - ballSize < 0 || ballY + ballSize > canvas.height) ballVY *= -1;
    if (ballX - ballSize < 20 && ballY > leftY && ballY < leftY + paddleHeight) ballVX *= -1;
    if (ballX + ballSize > canvas.width - 20 && ballY > rightY && ballY < rightY + paddleHeight) ballVX *= -1;

    if (ballX < 0 || ballX > canvas.width) {
        ballX = canvas.width / 2;
        ballY = canvas.height / 2;
        const idx = parseInt(speedSelect.value);
        const speed = ballSpeedPreset[idx];
        ballVX = (Math.random() > 0.5 ? 1 : -1) * speed;
        ballVY = (Math.random() > 0.5 ? 1.2 : -1.2);
        startTime = Date.now();
    }
}

function gameLoop() {
    if (gameStarted && !paused) {
        update();
        draw();
        requestAnimationFrame(gameLoop);
    }
}
