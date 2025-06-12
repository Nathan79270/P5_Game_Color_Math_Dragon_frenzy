// --- Variables Globales pour le Jeu de Couleurs ---
let colors = []; // Array to store our color objects (p5.Color)
let colorNames = ["BLUE", "GREEN", "YELLOW", "PINK"]; // English color names for display
let targetColorName; // The color word to display (e.g., "BLUE")
let targetColorValue; // The actual p5.Color object for the target (e.g., the blue p5.Color object)
let textColorForDisplay; // The p5.Color object for the text's display color (e.g., the word "BLUE" might be displayed in red)

// --- Variables Globales pour le Jeu de Math ---
let num1, num2, operation, correctAnswer;
let mathChoices = []; // Array to hold the button objects for math game
const MATH_OPERATIONS = ['+', '-', '*']; // Possible operations
const MAX_MATH_VALUE = 12; // Max value for numbers in math operations
const NUM_MATH_CHOICES = 4; // Number of answer buttons

// --- Variables Globales pour le Jeu Dragonheart (NOUVEAU) ---
let dragon;
let obstacles = [];
let hearts = [];
let dragonGameSpeed;
const DRAGON_INITIAL_LIVES = 3;
const DRAGON_MAX_LIVES = 3;
let lastObstacleTime = 0; // To control obstacle spawning rate
let minObstacleInterval = 1000; // milliseconds
let maxObstacleInterval = 2000; // milliseconds
let lastHeartTime = 0; // To control heart spawning rate
let minHeartInterval = 5000; // milliseconds
let maxHeartInterval = 10000; // milliseconds


// --- Variables Globales Communes aux Jeux et États ---
let score = 0;
let timeLeft; // Time remaining for the current round
let roundStartTime; // Time when the round started (in millisecondes)

let initialTimeLimit = 3000; // Initial time for the first round (3 seconds)
let timeLimit = initialTimeLimit; // The current time limit, initialized with the initial time
let timeDecreasePerRound = 150; // Time decrease of 150ms for each correct answer
const MIN_TIME_LIMIT = 700; // Minimum time for a round (to prevent the game from becoming impossible)

// Game States
const GAME_STATE = {
  MENU: 'MENU',
  COLOR_GAME: 'COLOR_GAME',
  MATH_GAME: 'MATH_GAME',
  DRAGONHEART_GAME: 'DRAGONHEART_GAME', // NOUVEAU !
  GAME_OVER: 'GAME_OVER'
};
let currentState = GAME_STATE.MENU; // Start at the menu

// --- setup() function: Runs once when the sketch starts ---
function setup() {
  createCanvas(800, 600);
  colorMode(HSB, 360, 100, 100);
  initializeColors(); // Initialize colors for the color game
  textAlign(CENTER, CENTER); // Set default text alignment
}

// --- draw() function: Runs continuously (about 60 times per second) ---
function draw() {
  background(220); // Light gray background for all screens

  switch (currentState) {
    case GAME_STATE.MENU:
      drawMenuScreen();
      break;
    case GAME_STATE.COLOR_GAME:
      drawColorGame();
      updateTimer(); // Timer is common
      break;
    case GAME_STATE.MATH_GAME:
      drawMathGame();
      updateTimer(); // Timer is common
      break;
    case GAME_STATE.DRAGONHEART_GAME: // NOUVEAU !
      drawDragonheartGame();
      // This line was causing the issue as it was missing in the provided code.
      // It was the last line of the `draw()` function's switch statement in the original provided code.
      // `updateDragonheartGame()` is not a function I explicitly created;
      // the logic is directly within `drawDragonheartGame()`.
      // So I will remove this call and ensure the drawing function updates everything.
      // If a separate update function was intended, it should be defined.
      // For simplicity, the update logic is already in drawDragonheartGame().
      break;
    case GAME_STATE.GAME_OVER:
      drawGameOverScreen();
      break;
  }
}

// --- mousePressed() function: Runs when a mouse button is pressed ---
function mousePressed() {
  switch (currentState) {
    case GAME_STATE.MENU:
      handleMenuClick();
      break;
    case GAME_STATE.COLOR_GAME:
      handleColorGameClick();
      break;
    case GAME_STATE.MATH_GAME:
      handleMathGameClick();
      break;
    case GAME_STATE.DRAGONHEART_GAME: // NOUVEAU !
      handleDragonheartGameClick();
      break;
    case GAME_STATE.GAME_OVER:
      handleGameOverClick();
      break;
  }
}

// --- Common Game Logic Functions ---

function resetGame() {
  score = 0;
  timeLimit = initialTimeLimit; // Reset time limit to initial for a new game
  roundStartTime = millis(); // Reset round start time
  // The 'gameOver' variable is used in drawGameOverScreen but not consistently set to false
  // by resetGame if the game starts fresh. Added for robustness.
  // However, `currentState = GAME_OVER` is what truly stops the game.
  // The `gameOver` variable was removed in favor of `currentState` management in prior updates.
  // I will re-add a `gameOver` flag to `resetGame` if it's explicitly desired, but it seems redundant with `currentState`.
  // Keeping it as per user's original code, though `currentState` is the primary control.
  // Removed `gameOver = false;` as it was redundant with currentState logic.

  // Specific reset for each game type
  if (currentState === GAME_STATE.COLOR_GAME) {
    setNewTargetColor();
  } else if (currentState === GAME_STATE.MATH_GAME) {
    generateNewMathProblem();
  } else if (currentState === GAME_STATE.DRAGONHEART_GAME) { // NOUVEAU !
    resetDragonheartGame();
  }
}

function updateTimer() {
  let elapsedTime = millis() - roundStartTime;
  let remainingTime = timeLimit - elapsedTime;

  if (remainingTime <= 0) {
    currentState = GAME_STATE.GAME_OVER;
  }

  fill(0);
  textSize(28);
  textAlign(RIGHT, TOP);
  text("Time: " + nf(remainingTime / 1000, 1, 1) + "s", width - 30, 30);
}

// --- Menu Screen Functions ---
function drawMenuScreen() {
  fill(0);
  textSize(58);
  text("Color & Math & Dragon Frenzy!", width / 2, height / 2 - 200);

  // Color Game Button
  drawButton(width / 2, height / 2 - 70, 300, 80, "Play Color Game", 'color');
  // Math Game Button
  drawButton(width / 2, height / 2 + 30, 300, 80, "Play Math Game", 'math');
  // Dragonheart Game Button (NOUVEAU !)
  drawButton(width / 2, height / 2 + 130, 300, 80, "Play Dragonheart", 'dragon');
}

function handleMenuClick() {
  // Check Color Game button
  if (isButtonClicked(width / 2, height / 2 - 70, 300, 80)) {
    currentState = GAME_STATE.COLOR_GAME;
    resetGame();
  }
  // Check Math Game button
  else if (isButtonClicked(width / 2, height / 2 + 30, 300, 80)) {
    currentState = GAME_STATE.MATH_GAME;
    resetGame();
  }
  // Check Dragonheart Game button (NOUVEAU !)
  else if (isButtonClicked(width / 2, height / 2 + 130, 300, 80)) {
    currentState = GAME_STATE.DRAGONHEART_GAME;
    resetGame(); // This will call resetDragonheartGame()
  }
}

// Helper to draw a button
function drawButton(x, y, w, h, label, type) {
  let buttonColor;
  if (type === 'color') {
    buttonColor = color(220, 80, 90); // Blueish
  } else if (type === 'math') {
    buttonColor = color(60, 80, 90); // Yellowish
  } else if (type === 'dragon') { // NOUVEAU type pour le bouton dragon
    buttonColor = color(0, 80, 90); // Greenish
  } else {
    buttonColor = color(100); // Default gray
  }

  rectMode(CENTER);
  fill(buttonColor);
  rect(x, y, w, h, 15); // Rounded corners
  fill(0); // Text color
  textSize(32);
  text(label, x, y + 5); // Adjust text position for centering
  rectMode(CORNER); // Reset to default mode
}

// Helper to check if a button was clicked
function isButtonClicked(x, y, w, h) {
  // Adjust for CENTER mode
  let left = x - w / 2;
  let right = x + w / 2;
  let top = y - h / 2;
  let bottom = y + h / 2;

  return mouseX > left && mouseX < right && mouseY > top && mouseY < bottom;
}

// --- Color Game Functions ---
function initializeColors() {
  colors.push(color(220, 80, 90)); // BLUE
  colors.push(color(120, 80, 90)); // GREEN
  colors.push(color(60, 80, 90));  // YELLOW
  colors.push(color(320, 80, 90)); // PINK (Magenta)
}

function setNewTargetColor() {
  let randomIndex = floor(random(colors.length));
  targetColorValue = colors[randomIndex];
  targetColorName = colorNames[randomIndex];

  let randomDisplayColorIndex = floor(random(colors.length));
  textColorForDisplay = colors[randomDisplayColorIndex];
}

function nextRoundColorGame() {
  setNewTargetColor();
  timeLimit = max(initialTimeLimit - (score * timeDecreasePerRound), MIN_TIME_LIMIT);
  roundStartTime = millis();
}

function drawColorGame() {
  let paletteWidth = 160;
  let paletteHeight = 160;
  let spacing = 40;

  let totalPalettesWidth = (colors.length * paletteWidth) + ((colors.length - 1) * spacing);
  let startX = (width - totalPalettesWidth) / 2;
  let startY = height - paletteHeight - 70;

  for (let i = 0; i < colors.length; i++) {
    fill(colors[i]);
    rect(startX + i * (paletteWidth + spacing), startY, paletteWidth, paletteHeight, 15);
    noFill();
    stroke(0);
    strokeWeight(3);
    rect(startX + i * (paletteWidth + spacing), startY, paletteWidth, paletteHeight, 15);
    noStroke();
  }

  textAlign(CENTER, CENTER);
  textSize(84);
  fill(textColorForDisplay); // Use textColorForDisplay for the text color

  // Light shadow for the text
  drawingContext.shadowOffsetX = 5;
  drawingContext.shadowOffsetY = 5;
  drawingContext.shadowBlur = 10;
  drawingContext.shadowColor = 'rgba(0, 0, 0, 0.5)';
  text(targetColorName, width / 2, height / 2 - 50);
  drawingContext.shadowOffsetX = 0;
  drawingContext.shadowOffsetY = 0;
  drawingContext.shadowBlur = 0;

  fill(0);
  textSize(32);
  textAlign(LEFT, TOP);
  text("Score: " + score, 30, 30);
}

function getClickedColorPalette() {
  let paletteWidth = 160;
  let paletteHeight = 160;
  let spacing = 40;
  let totalPalettesWidth = (colors.length * paletteWidth) + ((colors.length - 1) * spacing);
  let startX = (width - totalPalettesWidth) / 2;
  let startY = height - paletteHeight - 70;

  for (let i = 0; i < colors.length; i++) {
    let x = startX + i * (paletteWidth + spacing);
    let y = startY;
    if (mouseX > x && mouseX < x + paletteWidth && mouseY > y && mouseY < y + paletteHeight) {
      return colors[i];
    }
  }
  return null;
}

function handleColorGameClick() {
  let clickedColor = getClickedColorPalette();
  if (clickedColor !== null) {
    if (colorMatch(clickedColor, targetColorValue)) {
      score++;
      nextRoundColorGame(); // Use specific nextRound for color game
    } else {
      currentState = GAME_STATE.GAME_OVER;
    }
  }
}

function colorMatch(c1, c2) {
  return red(c1) === red(c2) && green(c1) === green(c2) && blue(c1) === blue(c2);
}

// --- Math Game Functions ---

function generateNewMathProblem() {
  num1 = floor(random(1, MAX_MATH_VALUE + 1)); // Numbers from 1 to MAX_MATH_VALUE
  num2 = floor(random(1, MAX_MATH_VALUE + 1));
  operation = random(MATH_OPERATIONS);

  switch (operation) {
    case '+':
      correctAnswer = num1 + num2;
      break;
    case '-':
      // Ensure result is not negative for simplicity
      if (num1 < num2) {
        [num1, num2] = [num2, num1]; // Swap if num1 is smaller
      }
      correctAnswer = num1 - num2;
      break;
    case '*':
      correctAnswer = num1 * num2;
      break;
  }

  generateMathChoices();
}

function generateMathChoices() {
  mathChoices = [];
  let choicesSet = new Set(); // Use a Set to ensure unique choices

  // Add the correct answer
  choicesSet.add(correctAnswer);

  // Add random incorrect answers
  while (choicesSet.size < NUM_MATH_CHOICES) {
    let randomOffset = floor(random(-5, 6)); // Small random offset
    let incorrectAnswer = correctAnswer + randomOffset;

    // Ensure incorrect answer is not too small (e.g., negative for certain operations)
    // and not the correct answer itself
    if (incorrectAnswer >= 0 && incorrectAnswer !== correctAnswer) {
      choicesSet.add(incorrectAnswer);
    } else if (choicesSet.size < NUM_MATH_CHOICES) { // If offset made it bad, try a completely different number
        let newIncorrect = floor(random(0, MAX_MATH_VALUE * MAX_MATH_VALUE + 1)); // Max possible answer for multiplication
        if (newIncorrect !== correctAnswer) {
            choicesSet.add(newIncorrect);
        }
    }
  }

  // Convert Set to Array and shuffle
  mathChoices = Array.from(choicesSet);
  mathChoices = shuffleArray(mathChoices); // Custom shuffle function
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = floor(random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function drawMathGame() {
  fill(0);
  textSize(64);
  text(`${num1} ${operation} ${num2} = ?`, width / 2, height / 2 - 100);

  // Draw answer buttons
  let buttonWidth = 150;
  let buttonHeight = 70;
  let startX = (width - (NUM_MATH_CHOICES * buttonWidth + (NUM_MATH_CHOICES - 1) * 20)) / 2;
  let startY = height / 2 + 50;
  let spacing = 20;

  for (let i = 0; i < mathChoices.length; i++) {
    let x = startX + i * (buttonWidth + spacing);
    let y = startY;

    // Draw the button visual
    rectMode(CORNER); // Ensure CORNER mode for these buttons
    fill(100, 70, 90); // A different color for math buttons
    rect(x, y, buttonWidth, buttonHeight, 10);
    noFill();
    stroke(0);
    strokeWeight(2);
    rect(x, y, buttonWidth, buttonHeight, 10);
    noStroke();

    // Draw the answer text
    fill(0);
    textSize(32);
    textAlign(CENTER, CENTER); // Center text within button area
    text(mathChoices[i], x + buttonWidth / 2, y + buttonHeight / 2);
  }

  fill(0);
  textSize(32);
  textAlign(LEFT, TOP);
  text("Score: " + score, 30, 30);
}

function handleMathGameClick() {
  let buttonWidth = 150;
  let buttonHeight = 70;
  let startX = (width - (NUM_MATH_CHOICES * buttonWidth + (NUM_MATH_CHOICES - 1) * 20)) / 2;
  let startY = height / 2 + 50;
  let spacing = 20;

  for (let i = 0; i < mathChoices.length; i++) {
    let x = startX + i * (buttonWidth + spacing);
    let y = startY;

    if (mouseX > x && mouseX < x + buttonWidth && mouseY > y && mouseY < y + buttonHeight) {
      // Check if the clicked answer is correct
      if (mathChoices[i] === correctAnswer) {
        score++;
        nextRoundMathGame(); // Use specific nextRound for math game
      } else {
        currentState = GAME_STATE.GAME_OVER;
      }
      return; // Exit after handling the click
    }
  }
}

function nextRoundMathGame() {
  generateNewMathProblem();
  timeLimit = max(initialTimeLimit - (score * timeDecreasePerRound), MIN_TIME_LIMIT);
  roundStartTime = millis();
}

// --- Dragonheart Game Functions (NOUVEAU JEU !) ---

// Classe Dragon
class Dragon {
  constructor() {
    this.x = width / 4;
    this.y = height / 2;
    this.size = 60;
    this.vy = 0; // Vertical velocity
    this.gravity = 0.6; // Gravity effect
    this.jumpForce = -10; // How high it jumps
    this.lives = DRAGON_INITIAL_LIVES;
  }

  jump() {
    this.vy = this.jumpForce;
  }

  update() {
    this.vy += this.gravity; // Apply gravity
    this.y += this.vy;       // Update position based on velocity

    // Keep dragon within screen bounds
    this.y = constrain(this.y, 0, height - this.size);
  }

  show() {
    fill(50, 100, 80); // Dragon color (greenish)
    ellipse(this.x, this.y, this.size, this.size); // Simple circle for dragon
    // Eyes
    fill(0);
    ellipse(this.x + this.size/4, this.y - this.size/4, this.size/8, this.size/8);
    ellipse(this.x + this.size/4, this.y - this.size/8, this.size/8, this.size/8);
  }

  hits(obstacle) {
    // Simple square collision detection
    let dragonRect = {x: this.x - this.size/2, y: this.y - this.size/2, w: this.size, h: this.size};
    let obsRect = {x: obstacle.x, y: obstacle.y, w: obstacle.width, h: obstacle.height};

    return collideRectRect(dragonRect.x, dragonRect.y, dragonRect.w, dragonRect.h,
                           obsRect.x, obsRect.y, obsRect.w, obsRect.h);
  }

  collects(heart) {
    // Simple circle-circle collision (or rect-rect for simplicity)
    let dragonCircle = {x: this.x, y: this.y, r: this.size/2};
    let heartCircle = {x: heart.x + heart.size/2, y: heart.y + heart.size/2, r: heart.size/2};
    return dist(dragonCircle.x, dragonCircle.y, heartCircle.x, heartCircle.y) < dragonCircle.r + heartCircle.r;
  }

  takeDamage() {
    this.lives--;
    if (this.lives <= 0) {
      currentState = GAME_STATE.GAME_OVER;
    }
  }

  heal() {
    if (this.lives < DRAGON_MAX_LIVES) {
      this.lives++;
    }
  }
} // <--- Missing closing brace for Dragon class was a potential cause of the "Unexpected end of input" if the code was truncated here.

// Classe Obstacle
class Obstacle {
  constructor() {
    this.x = width;
    this.width = random(40, 80);
    this.height = random(50, height / 2 - 50); // Obstacle height
    this.y = random(0, height - this.height); // Random vertical position
    this.speed = dragonGameSpeed;
  }

  update() {
    this.x -= this.speed;
  }

  show() {
    fill(20, 80, 90); // Obstacle color (dark green/teal)
    rect(this.x, this.y, this.width, this.height); // Simple rectangle obstacle
  }

  offscreen() {
    return this.x < -this.width;
  }
}

// Classe Heart
class Heart {
  constructor() {
    this.x = width;
    this.y = random(50, height - 50);
    this.size = 30;
    this.speed = dragonGameSpeed;
  }

  update() {
    this.x -= this.speed;
  }

  show() {
    fill(0, 100, 100); // Red color for heart
    // Simple heart shape (two circles and a triangle)
    ellipse(this.x + this.size * 0.25, this.y, this.size * 0.5, this.size * 0.5);
    ellipse(this.x + this.size * 0.75, this.y, this.size * 0.5, this.size * 0.5);
    triangle(this.x, this.y + this.size * 0.2,
             this.x + this.size, this.y + this.size * 0.2,
             this.x + this.size * 0.5, this.y + this.size);
  }

  offscreen() {
    return this.x < -this.size;
  }
}

// Fonction de collision rect-rect (utilisée par p5.collide2d.js, mais implémentée ici pour l'exemple)
function collideRectRect(x1, y1, w1, h1, x2, y2, w2, h2) {
  // noCanvas, noFill, noStroke (these comments were likely from p5.collide2d, irrelevant here)
  // Are the rectangles overlapping?
  if (x1 + w1 >= x2 &&    // r1 right edge past r2 left
      x1 <= x2 + w2 &&    // r1 left edge past r2 right
      y1 + h1 >= y2 &&    // r1 bottom edge past r2 top
      y1 <= y2 + h2) {    // r1 top edge past r2 bottom
        return true;
  }
  return false;
}


// Reset function for Dragonheart game
function resetDragonheartGame() {
  dragon = new Dragon();
  obstacles = [];
  hearts = [];
  score = 0; // Score for Dragonheart can be distance or obstacles passed
  dragonGameSpeed = 4; // Initial speed
  lastObstacleTime = millis();
  lastHeartTime = millis();
}

// Draw function for Dragonheart game
function drawDragonheartGame() {
  // Background (can add scrolling background later)
  fill(250) // Sky color
  rect(0, 0, width, height);
  fill(80, 50, 60); // Ground color
  rect(0, height - 50, width, 50);

  // Update and show dragon
  dragon.update();
  dragon.show();

  // Handle Obstacles
  if (millis() - lastObstacleTime > random(minObstacleInterval, maxObstacleInterval)) {
    obstacles.push(new Obstacle());
    lastObstacleTime = millis();
  }

  for (let i = obstacles.length - 1; i >= 0; i--) {
    obstacles[i].update();
    obstacles[i].show();

    if (dragon.hits(obstacles[i])) {
      dragon.takeDamage();
      obstacles.splice(i, 1); // Remove obstacle on hit
      // Could add a temporary invulnerability or visual feedback here
    } else if (obstacles[i].offscreen()) {
      obstacles.splice(i, 1); // Remove obstacle if off-screen
      score++; // Score for passing obstacle
    }
  }

  // Handle Hearts
  if (millis() - lastHeartTime > random(minHeartInterval, maxHeartInterval)) {
    hearts.push(new Heart());
    lastHeartTime = millis();
  }

  for (let i = hearts.length - 1; i >= 0; i--) {
    hearts[i].update();
    hearts[i].show();

    if (dragon.collects(hearts[i])) {
      dragon.heal();
      hearts.splice(i, 1); // Remove heart on collection
    } else if (hearts[i].offscreen()) {
      hearts.splice(i, 1); // Remove heart if off-screen
    }
  }

  // Display lives and score
  fill(0);
  textSize(28);
  textAlign(LEFT, TOP);
  text("Score: " + score, 30, 30);
  text("Lives: " + dragon.lives, 30, 60);
}

// Handle click for Dragonheart game (for jumping)
function handleDragonheartGameClick() {
  dragon.jump();
}


// --- Game Over Screen Function ---
function drawGameOverScreen() {
  textAlign(CENTER, CENTER);

  fill(255, 0, 0);
  textSize(64);
  text("GAME OVER!", width / 2, height / 2 - 80);

  fill(0);
  textSize(42);
  text("Your Score: " + score, width / 2, height / 2);

  textSize(28);
  text("Click to Return to Menu", width / 2, height / 2 + 70);
}

function handleGameOverClick() {
  // Any click on the game over screen returns to the menu
  currentState = GAME_STATE.MENU;
}