// Generate random 50x50 mazes for different difficulties
function generateMaze(size, wallDensity) {
  const maze = [];
  for (let y = 0; y < size; y++) {
    maze[y] = [];
    for (let x = 0; x < size; x++) {
      // Create borders and some random walls
      if (x === 0 || y === 0 || x === size - 1 || y === size - 1) {
        maze[y][x] = 1; // Walls on borders
      } else {
        maze[y][x] = Math.random() < wallDensity ? 1 : 0;
      }
    }
  }
  
  // Ensure start and end are clear
  maze[1][1] = 0; // Clear start position
  maze[size-2][size-2] = 0; // Clear goal position
  
  return maze;
}

const mazes = {
  easy: generateMaze(50, 0.1),    // 10% walls
  medium: generateMaze(50, 0.2),  // 20% walls  
  hard: generateMaze(50, 0.3)     // 30% walls
};

let currentMaze = [];
let playerPos = {x: 1, y: 1}; // Start at (1,1) to avoid border
let goalPos = {x: 48, y: 48}; // Goal at (48,48) 
let gameActive = false;
let mazeElement = null;

function initGame() {
  if (!mazeElement) {
    mazeElement = document.getElementById('maze');
  }
  
  const difficulty = document.getElementById('difficulty').value;
  currentMaze = JSON.parse(JSON.stringify(mazes[difficulty]));
  playerPos = {x: 1, y: 1};
  goalPos = {x: 48, y: 48};
  gameActive = true;
  
  // Clear any previous victory effects
  clearVictoryEffects();
  drawMaze();
}

function drawMaze() {
  if (!mazeElement) return;
  
  mazeElement.innerHTML = '';
  
  for (let y = 0; y < 50; y++) {
    for (let x = 0; x < 50; x++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      
      if (currentMaze[y][x] === 1) {
        cell.classList.add('wall');
      }
      
      if (x === playerPos.x && y === playerPos.y) {
        cell.classList.add('player');
      }
      
      if (x === goalPos.x && y === goalPos.y) {
        cell.classList.add('goal');
      }
      
      mazeElement.appendChild(cell);
    }
  }
}

function move(dx, dy) {
  if (!gameActive) return;
  
  const newX = playerPos.x + dx;
  const newY = playerPos.y + dy;
  
  if (newX < 0 || newY < 0 || newX >= 50 || newY >= 50) return;
  if (currentMaze[newY][newX] === 1) return;
  
  playerPos.x = newX;
  playerPos.y = newY;
  
  if (playerPos.x === goalPos.x && playerPos.y === goalPos.y) {
    victory();
    return;
  }
  
  drawMaze();
}

function victory() {
  gameActive = false;
  
  // Add victory class to goal cell
  const goalCell = mazeElement.children[goalPos.y * 50 + goalPos.x];
  goalCell.classList.add('victory');
  
  // Create confetti
  createConfetti();
  
  // Show victory message
  showVictoryMessage();
  
  // Auto-restart after 5 seconds
  setTimeout(() => {
    clearVictoryEffects();
    initGame();
  }, 5000);
}

function createConfetti() {
  const confettiContainer = document.createElement('div');
  confettiContainer.className = 'confetti';
  document.body.appendChild(confettiContainer);
  
  // Create 50 confetti pieces
  for (let i = 0; i < 50; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = Math.random() * 100 + '%';
    piece.style.animationDelay = Math.random() * 3 + 's';
    confettiContainer.appendChild(piece);
  }
}

function showVictoryMessage() {
  const message = document.createElement('div');
  message.className = 'victory-message';
  message.textContent = ' YOU WIN! ';
  document.body.appendChild(message);
  
  // Remove message after 3 seconds
  setTimeout(() => {
    if (message.parentNode) {
      message.parentNode.removeChild(message);
    }
  }, 3000);
}

function clearVictoryEffects() {
  // Remove confetti
  const confetti = document.querySelector('.confetti');
  if (confetti) {
    confetti.parentNode.removeChild(confetti);
  }
  
  // Remove victory message
  const message = document.querySelector('.victory-message');
  if (message) {
    message.parentNode.removeChild(message);
  }
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowUp') {
    e.preventDefault();
    move(0, -1);
  } else if (e.key === 'ArrowDown') {
    e.preventDefault();
    move(0, 1);
  } else if (e.key === 'ArrowLeft') {
    e.preventDefault();
    move(-1, 0);
  } else if (e.key === 'ArrowRight') {
    e.preventDefault();
    move(1, 0);
  }
});

document.addEventListener('DOMContentLoaded', () => {
  mazeElement = document.getElementById('maze');
  initGame();
});
