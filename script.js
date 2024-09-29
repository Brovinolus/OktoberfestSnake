// Define HTML elements

// always the same
const board = document.getElementById('game-board');
const instructionText = document.getElementById('instructions-text');
const logo = document.getElementById('logo');
const score = document.getElementById('score');
const highScoreText = document.getElementById('highScore');
// Define game variables
// change in size -> let for paramters that change
// center position for the snake (grid is 20 x 20)
let snake = [{x: 10, y: 10}];
let direction = 'right';
let gameInterval;
let gameSpeedDelay = 300;
let gameStarted = false;
const gridWidth = 20;
const gridHeight = 20;
let beer = getRandomPosition();
let water = getWaterRandomPosition();
let highScore = 0;

// Draw game map, snake, food
function draw() 
{
    // Clear
    board.innerHTML = '';
    drawSnake();
    drawBeer();
    drawWater();
    updateScore();
}

// Draw snake
function drawSnake()
{
    snake.forEach((segment) => {
        // creating snake elements, giving snake class
        // create an HTML <div> element and assign it the CSS class 'snake' (we have the snake class in CSS already, so spelling is very important. If we type snak, then the css class won't apply any changes)
        const snakeElement = createGameElement('div', 'snake');
        setPosition(snakeElement, segment);
        board.appendChild(snakeElement);
    });
}

// Create a snake or food/div
function createGameElement(tag, className)
{
    // creating html element
    const element = document.createElement(tag);
    // Assigns the class name (e.g., snake) to the element
    element.className = className;
    return element;
}

// Set the position of snake or food
function setPosition(element, position)
{
    // Sets the horizontal position of the snake segment on the CSS grid using the gridColumn property
    element.style.gridColumn = position.x;
    element.style.gridRow = position.y;
}

function drawBeer()
{
    if(gameStarted)
    {
        const beerElement = createGameElement('div', 'beer');
        setPosition(beerElement, beer);
        board.appendChild(beerElement);
    }
}

function drawWater()
{
    if(gameStarted)
    {
        const waterElement = createGameElement('div', 'water');
        setPosition(waterElement, water);
        board.appendChild(waterElement);
    }
}

function getRandomPosition()
{
    const x = Math.floor((Math.random() * gridWidth) + 1);
    const y = Math.floor((Math.random() * gridHeight) + 1);

    return {x, y};
}

function getWaterRandomPosition()
{
    let newWater = getRandomPosition();

    while(beer.x === newWater.x && beer.y === newWater.y)
    {
        newWaterater = getRandomPosition();
    }

    return newWater;
}

// Moving the sanke
function move()
{
    // copy of the first element
    const head = {...snake[0]};

    switch(direction)
    {
        case 'up':
            head.y--;
            break;
        case 'down':
            head.y++;
            break;
        case 'right':
            head.x++;
            break;
        case 'left':
            head.x--;
            break;
    }

    // add a copy of the first element to the array
    snake.unshift(head);
    // remove the last (original element) form the array
    if(head.x === beer.x && head.y === beer.y)
    {
        beer = getRandomPosition();
        increaseSpeed();
        clearInterval(gameInterval);
        // setInterval(function, delay);
        gameInterval = setInterval(()=>{
            move();
            checkCollision();
            draw();
        }, gameSpeedDelay);
    }
    else
    {
        snake.pop();
    }
}

function startGame()
{
    gameStarted = true;
    instructionText.style.display = 'none';
    logo.style.display = 'none';
    gameInterval = setInterval(() => {
        move();
        checkCollision();
        draw();
    }, gameSpeedDelay);
}

function increaseSpeed()
{
    if(gameSpeedDelay > 150)
    {
        gameSpeedDelay -= 5;
    }
    else if (gameSpeedDelay > 100) {
        gameSpeedDelay -= 3;
    }
    else if (gameSpeedDelay > 50) {
        gameSpeedDelay -= 1;
    }
    console.log(gameSpeedDelay);
}

// Keypress event listener
function handleKeyPress(event)
{
    if(!gameStarted && event.code === 'Space' || 
        (!gameStarted && event.key === ''))
    {
        startGame();
    }
    else{
        switch(event.key) {
            case 'ArrowUp':
            case 'W':
            case 'w':
                direction = 'up';
                break;
            case 'ArrowDown':
            case 'S':
            case 's':
                direction = 'down';
                break;
            case 'ArrowRight':
            case 'D':
            case 'd':
                direction = 'right';
                break;
            case 'ArrowLeft':
            case 'A':
            case 'a':
                direction = 'left';
                break;
        }
    }
}

document.addEventListener('keydown', handleKeyPress);

function checkCollision()
{
    const head = snake[0];

    if(head.x < 1 || head.x > gridWidth ||
        head.y < 1 || head.y > gridHeight)
    {
        resetGame();
    }

    for (let i = 1; i < snake.length; i++) {
        if(head.x === snake[i].x && head.y === snake[i].y)
        {
            resetGame();
        }
    }
}

function resetGame()
{
    stopGame();
    updateHighScore();
    snake = [{x: 10, y: 10}];
    beer = getRandomPosition();
    water = getWaterRandomPosition();
    direction = 'right';
    gameSpeedDelay = 300;
    updateScore();
}

function updateScore(){
    const currentScore = snake.length - 1;
    score.textContent = currentScore.toString().padStart(3,'0');
}

function stopGame()
{
    clearInterval(gameInterval);
    gameStarted = false;
    instructionText.style.display = 'block';
    logo.style.display = 'block';
}

function updateHighScore()
{
    const currentScore = snake.length - 1;
    console.log(currentScore);
    console.log(highScore);
    if(currentScore > highScore)
    {
        highScore = currentScore;
        highScoreText.textContent = highScore.toString().padStart(3,'0');
    }
    highScoreText.style.display = 'block';
}

    