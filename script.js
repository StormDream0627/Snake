const BOARD_SIZE = 30;
const INITIAL_SPEED = 200;
const MIN_SPEED = 10;
const SPEED_STEP = 2;

const gameBoard = document.getElementById("gameBoard");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const scoreEl = document.getElementById("score");

const cellMap = new Map();

let snake = [];
let food = null;
let direction = { x: 1, y: 0 };
let nextDirection = { x: 1, y: 0 };
let score = 0;
let speed = INITIAL_SPEED;
let gameInterval = null;
let isRunning = false;

function keyOf(x, y) {
  return `${x},${y}`;
}

function initBoard() {
  gameBoard.innerHTML = "";
  cellMap.clear();

  for (let y = 0; y < BOARD_SIZE; y += 1) {
    for (let x = 0; x < BOARD_SIZE; x += 1) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.dataset.x = String(x);
      cell.dataset.y = String(y);
      cell.setAttribute("role", "gridcell");
      gameBoard.appendChild(cell);
      cellMap.set(keyOf(x, y), cell);
    }
  }
}

function clearLoop() {
  if (gameInterval) {
    clearInterval(gameInterval);
    gameInterval = null;
  }
}

function restartLoop() {
  clearLoop();
  gameInterval = setInterval(gameLoop, speed);
}

function randomFood() {
  food = {
    x: Math.floor(Math.random() * BOARD_SIZE),
    y: Math.floor(Math.random() * BOARD_SIZE)
  };
}

function updateScore() {
  scoreEl.textContent = `Score: ${score}`;
}

function resetGameState() {
  snake = [
    { x: 2, y: 0 },
    { x: 1, y: 0 },
    { x: 0, y: 0 }
  ];
  direction = { x: 1, y: 0 };
  nextDirection = { x: 1, y: 0 };
  score = 0;
  speed = INITIAL_SPEED;
  isRunning = true;
  randomFood();
  updateScore();
}

function draw() {
  for (const cell of cellMap.values()) {
    cell.classList.remove("snake", "food");
  }

  if (food) {
    const foodCell = cellMap.get(keyOf(food.x, food.y));
    if (foodCell) {
      foodCell.classList.add("food");
    }
  }

  for (const segment of snake) {
    const snakeCell = cellMap.get(keyOf(segment.x, segment.y));
    if (snakeCell) {
      snakeCell.classList.add("snake");
    }
  }
}

function isOpposite(next, current) {
  return next.x === -current.x && next.y === -current.y;
}

function handleFoodEaten() {
  score += 1;
  updateScore();
  randomFood();
  speed = Math.max(MIN_SPEED, speed - SPEED_STEP);
  restartLoop();
}

function gameOver() {
  clearLoop();
  isRunning = false;
  alert("Game Over");
}

function gameLoop() {
  direction = { ...nextDirection };

  const currentHead = snake[0];
  const newHead = {
    x: (currentHead.x + direction.x + BOARD_SIZE) % BOARD_SIZE,
    y: (currentHead.y + direction.y + BOARD_SIZE) % BOARD_SIZE
  };

  const collidesSelf = snake.some((segment) => segment.x === newHead.x && segment.y === newHead.y);
  if (collidesSelf) {
    gameOver();
    return;
  }

  snake.unshift(newHead);

  const ateFood = food && newHead.x === food.x && newHead.y === food.y;
  if (!ateFood) {
    snake.pop();
  } else {
    handleFoodEaten();
  }

  draw();
}

function startGame() {
  clearLoop();
  initBoard();
  resetGameState();
  draw();
  restartLoop();
}

function togglePause() {
  if (!isRunning) {
    return;
  }

  if (gameInterval) {
    clearLoop();
    pauseBtn.textContent = "Resume";
  } else {
    restartLoop();
    pauseBtn.textContent = "Pause";
  }
}

function handleKeydown(event) {
  const directionMap = {
    ArrowUp: { x: 0, y: -1 },
    ArrowDown: { x: 0, y: 1 },
    ArrowLeft: { x: -1, y: 0 },
    ArrowRight: { x: 1, y: 0 }
  };

  const candidate = directionMap[event.key];
  if (!candidate) {
    return;
  }

  event.preventDefault();

  if (isOpposite(candidate, direction)) {
    return;
  }

  nextDirection = candidate;
}

startBtn.addEventListener("click", () => {
  pauseBtn.textContent = "Pause";
  startGame();
});

pauseBtn.addEventListener("click", togglePause);
document.addEventListener("keydown", handleKeydown);

initBoard();
resetGameState();
draw();
isRunning = false;
clearLoop();
pauseBtn.textContent = "Pause";
