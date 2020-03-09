let canvas = document.querySelector('#game'),
    context = canvas.getContext('2d'),
    grid = 16,
    count = 0,
    gameSpeed = 0,
    score = 0,
    interval,
    playerName,
    storage = localStorage;

let startPopup = document.querySelector('.start-popup'),
    endPopup = document.querySelector('.end-popup'),
    startBtn = document.querySelector('.start-btn'),
    resultsList = document.querySelector('.score-list'),
    template = document.querySelector('.result-template'),
    clearBtn = document.querySelector('.clear-btn'),
    againBtn = document.querySelector('.again-btn');

let sound = new Audio;
    sound.src = './sound/food-eat.mp3';

let snake = {
    //start coords

    x: 160,
    y: 160,

    // speed

    dx: grid,
    dy: 0,

    // snake end

    cells: [],

    // start length

    maxCells: 4
};

let food = {
    // coords 
    x: 320,
    y: 320
};

function gameStart() {
    snake.x = 160;
    snake.y = 160;
    snake.cells = [];
    snake.maxCells = 4;
    snake.dx = grid;
    snake.dy = 0;
    food.x = getRandom(0, 25) * grid;
    food.y = getRandom(0, 25) * grid;
    gameSpeed = 0;
    score = 0;
    document.querySelector('.score').textContent = score;
    startPopup.classList.add('show');
}

function clearResults() {
    let results = resultsList.querySelectorAll('li');
    results.forEach(item => item.remove());
}

function renderResults() {
    let data = JSON.parse(storage.getItem("results"));

    clearResults();
    
    data.forEach(function(el) {
        let result = template.querySelector('li').cloneNode(true),
            name = result.querySelector('.result-name'),
            score = result.querySelector('.result-score');

        resultsList.appendChild(result);
        name.textContent = el.name;
        score.textContent = el.score;
    });
}

function gameEnd() {
    let resultsArr = JSON.parse(storage.getItem("results")),
        item = {
            name: playerName,
            score: score
        };    
    resultsArr.push(item);

    storage.setItem("results", JSON.stringify(resultsArr));
    
    endPopup.classList.add('show');
    renderResults();

    clearBtn.addEventListener('click', () => {
        storage.clear();
        clearResults();
    });

    againBtn.addEventListener('click', () => {
        endPopup.classList.remove('show');
        gameStart();        
    });
}

// get random number

function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function game() {
    if (++count < 4) {
        return;
    }

    count = 0;

    context.clearRect(0, 0, canvas.width, canvas.height);

    snake.x += snake.dx;
    snake.y += snake.dy;

    if (snake.x < 0) {
        snake.x = canvas.width - grid;
    }

    if (snake.x >= canvas.width) {
        snake.x = 0;
    }

    if (snake.y < 0) {
        snake.y = canvas.height - grid;
    }

    if (snake.y >= canvas.height) {
        snake.y = 0;
    }

    snake.cells.unshift({x: snake.x, y:snake.y});

    if (snake.cells.length > snake.maxCells) {
        snake.cells.pop();
    }

    // food

    context.fillStyle = 'orange';
    context.fillRect(food.x, food.y, grid - 1, grid - 1);
    context.fillStyle = 'black';

    snake.cells.forEach(function (cell, index) {
        context.fillRect(cell.x, cell.y, grid - 1, grid - 1);

        if (cell.x === food.x && cell.y === food.y) {
            snake.maxCells++;
            food.x = getRandom(0, 25) * grid;
            food.y = getRandom(0, 25) * grid;
            gameSpeed++;

            clearInterval(interval);            
            interval = setInterval(game, (50 - gameSpeed));

            score+=15;
            document.querySelector('.score').textContent = score;
            sound.play();
        }        

        for (let i = index + 1; i < snake.cells.length; i++) {
            if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
                clearInterval(interval);          
                gameEnd();
            }
        }
    });
}

document.addEventListener('keydown', function(evt) {    
    if (evt.keyCode === 37 && snake.dx === 0) {
        snake.dx = -grid;
        snake.dy = 0;
    } else if (evt.keyCode === 38 && snake.dy === 0) {
        snake.dx = 0;
        snake.dy = -grid;
    } else if (evt.keyCode === 39 && snake.dx === 0) {
        snake.dx = grid;
        snake.dy = 0;
    } else if (evt.keyCode === 40 && snake.dy === 0) {
        snake.dx = 0;
        snake.dy = grid;
    }
});

document.addEventListener('touchstart', function(evt) { 
    console.log(evt.touches[0].pageX);   
    if (evt.touches[0].pageX < snake.x && snake.dx === 0) {
        snake.dx = -grid;
        snake.dy = 0;
    } else if (evt.touches[0].pageY < snake.y && snake.dy === 0) {
        snake.dx = 0;
        snake.dy = -grid;
    } else if (evt.touches[0].pageX > snake.x && snake.dx === 0) {
        snake.dx = grid;
        snake.dy = 0;
    } else if (evt.touches[0].pageY > snake.y && snake.dy === 0) {
        snake.dx = 0;
        snake.dy = grid;
    }
});

gameStart();

startBtn.addEventListener('click', () => {
    clearInterval(interval);
    interval = setInterval(game, 50 - gameSpeed);
    startPopup.classList.remove('show');
    playerName = document.querySelector('.player-name').value;

    if (storage.length === 0) {
        storage.setItem("results", JSON.stringify([]));
    }
});





