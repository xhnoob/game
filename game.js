const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('highScore');
const speedElement = document.getElementById('speed');
const pauseBtn = document.getElementById('pauseBtn');

const gridSize = 20;
const tileCount = canvas.width / gridSize;

// 速度等级设置
const speedLevels = {
    baseSpeed: 100,
    minSpeed: 40,
    maxLevel: 10
};

// 高分区域定义
const bonusArea = {
    x: 0,
    y: 0,
    width: 8,
    height: 8
};

// 通道定义
const passage = {
    x: 7,
    y: 8,
    width: 2,
    height: 1
};

// 蛇的颜色渐变
const snakeGradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
snakeGradient.addColorStop(0, '#4CAF50');
snakeGradient.addColorStop(1, '#45a049');

let snake = [];
let normalFood = { x: 15, y: 15 };
let bonusFood = { x: 3, y: 3 };
let dx = 0;
let dy = 0;
let score = 0;
let highScore = localStorage.getItem('snakeHighScore') || 0;
let gameInterval;
let gameSpeed = speedLevels.baseSpeed;
let speedLevel = 1;
let isGameRunning = false;
let isPaused = false;

highScoreElement.textContent = highScore;
speedElement.textContent = speedLevel;

// 检查点是否在高分区域内
function isInBonusArea(x, y) {
    return x < bonusArea.width && y < bonusArea.height;
}

// 检查点是否在通道内
function isInPassage(x, y) {
    return x >= passage.x && x < passage.x + passage.width && 
           y >= passage.y && y < passage.y + passage.height;
}

// 初始化蛇的身体
function initSnake() {
    snake = [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 }
    ];
}

// 游戏主循环
function gameLoop() {
    if (!isGameRunning || isPaused) return;
    updateSnake();
    checkCollision();
    drawGame();
}

// 更新蛇的位置
function updateSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);

    // 检查是否吃到食物
    let ateFood = false;
    let speedIncrease = 0;
    
    // 检查普通食物
    if (head.x === normalFood.x && head.y === normalFood.y) {
        score += 10;
        ateFood = true;
        speedIncrease = 1;
        generateNormalFood();
    }
    
    // 检查高分区食物
    if (head.x === bonusFood.x && head.y === bonusFood.y) {
        score += 50;
        ateFood = true;
        speedIncrease = 2;
        generateBonusFood();
    }

    if (ateFood) {
        scoreElement.textContent = score;
        if (score > highScore) {
            highScore = score;
            highScoreElement.textContent = highScore;
            localStorage.setItem('snakeHighScore', highScore);
        }
        
        // 更新速度
        updateSpeed(speedIncrease);
    } else {
        snake.pop();
    }
}

// 更新速度
function updateSpeed(increase) {
    // 增加速度等级
    speedLevel = Math.min(speedLevel + increase, speedLevels.maxLevel);
    speedElement.textContent = speedLevel;
    
    // 计算新的游戏速度
    gameSpeed = Math.max(
        speedLevels.baseSpeed - (speedLevel - 1) * 6,
        speedLevels.minSpeed
    );
    
    // 更新游戏循环间隔
    clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, gameSpeed);
}

// 检查碰撞
function checkCollision() {
    const head = snake[0];

    // 检查墙壁碰撞
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        gameOver();
        return;
    }

    // 检查高分区域墙壁碰撞
    if (!isInBonusArea(head.x, head.y) && !isInPassage(head.x, head.y) && 
        (head.x < passage.x + passage.width && head.y < passage.y + passage.height)) {
        gameOver();
        return;
    }

    // 检查自身碰撞
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver();
            return;
        }
    }
}

// 绘制游戏画面
function drawGame() {
    // 清空画布
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 绘制网格
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 0.5;
    for (let i = 0; i < tileCount; i++) {
        ctx.beginPath();
        ctx.moveTo(i * gridSize, 0);
        ctx.lineTo(i * gridSize, canvas.height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * gridSize);
        ctx.lineTo(canvas.width, i * gridSize);
        ctx.stroke();
    }

    // 绘制高分区域
    ctx.fillStyle = 'rgba(255, 223, 186, 0.3)';
    ctx.fillRect(0, 0, bonusArea.width * gridSize, bonusArea.height * gridSize);
    
    // 绘制"高分区"文字
    ctx.fillStyle = 'rgba(42, 82, 152, 0.6)';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('高分区', (bonusArea.width * gridSize) / 2, (bonusArea.height * gridSize) / 2);
    
    // 绘制墙壁
    ctx.fillStyle = '#2a5298';
    for (let x = 0; x < tileCount; x++) {
        for (let y = 0; y < tileCount; y++) {
            if (!isInBonusArea(x, y) && !isInPassage(x, y) && 
                x < passage.x + passage.width && y < passage.y + passage.height) {
                ctx.fillRect(x * gridSize, y * gridSize, gridSize - 1, gridSize - 1);
            }
        }
    }

    // 绘制蛇
    snake.forEach((segment, index) => {
        // 蛇头
        if (index === 0) {
            ctx.fillStyle = '#2a5298';
            ctx.beginPath();
            ctx.roundRect(
                segment.x * gridSize,
                segment.y * gridSize,
                gridSize - 2,
                gridSize - 2,
                5
            );
            ctx.fill();
        } else {
            // 蛇身
            ctx.fillStyle = snakeGradient;
            ctx.beginPath();
            ctx.roundRect(
                segment.x * gridSize,
                segment.y * gridSize,
                gridSize - 2,
                gridSize - 2,
                3
            );
            ctx.fill();
        }
    });

    // 绘制普通食物
    ctx.fillStyle = '#ff4757';
    ctx.beginPath();
    ctx.arc(
        normalFood.x * gridSize + gridSize/2,
        normalFood.y * gridSize + gridSize/2,
        gridSize/2 - 2,
        0,
        Math.PI * 2
    );
    ctx.fill();

    // 绘制高分区食物
    ctx.fillStyle = '#ffd700';
    ctx.beginPath();
    ctx.arc(
        bonusFood.x * gridSize + gridSize/2,
        bonusFood.y * gridSize + gridSize/2,
        gridSize/2 - 2,
        0,
        Math.PI * 2
    );
    ctx.fill();

    // 高分区食物的光晕效果
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(
        bonusFood.x * gridSize + gridSize/2,
        bonusFood.y * gridSize + gridSize/2,
        gridSize/2,
        0,
        Math.PI * 2
    );
    ctx.stroke();
}

// 生成普通区域食物
function generateNormalFood() {
    normalFood = {
        x: Math.floor(Math.random() * (tileCount - bonusArea.width)) + bonusArea.width,
        y: Math.floor(Math.random() * (tileCount - bonusArea.height)) + bonusArea.height
    };

    // 确保食物不会生成在蛇身上和墙壁上
    snake.forEach(segment => {
        if ((segment.x === normalFood.x && segment.y === normalFood.y) || 
            (!isInBonusArea(normalFood.x, normalFood.y) && !isInPassage(normalFood.x, normalFood.y) && 
             normalFood.x < passage.x + passage.width && normalFood.y < passage.y + passage.height)) {
            generateNormalFood();
        }
    });
}

// 生成高分区食物
function generateBonusFood() {
    bonusFood = {
        x: Math.floor(Math.random() * bonusArea.width),
        y: Math.floor(Math.random() * bonusArea.height)
    };

    // 确保食物不会生成在蛇身上
    snake.forEach(segment => {
        if (segment.x === bonusFood.x && segment.y === bonusFood.y) {
            generateBonusFood();
        }
    });
}

// 开始游戏
function startGame() {
    if (isGameRunning && !isPaused) return;
    
    if (!isGameRunning) {
        initSnake();
        score = 0;
        speedLevel = 1;
        gameSpeed = speedLevels.baseSpeed;
        dx = 1;
        dy = 0;
        scoreElement.textContent = score;
        speedElement.textContent = speedLevel;
        generateNormalFood();
        generateBonusFood();
    }
    
    isGameRunning = true;
    isPaused = false;
    pauseBtn.textContent = '暂停';
    gameInterval = setInterval(gameLoop, gameSpeed);
}

// 暂停/继续游戏
function togglePause() {
    if (!isGameRunning) return;
    
    isPaused = !isPaused;
    pauseBtn.textContent = isPaused ? '继续' : '暂停';
    
    if (!isPaused) {
        gameInterval = setInterval(gameLoop, gameSpeed);
    } else {
        clearInterval(gameInterval);
    }
}

// 游戏结束
function gameOver() {
    isGameRunning = false;
    clearInterval(gameInterval);
    alert(`游戏结束！得分：${score}`);
    pauseBtn.textContent = '暂停';
}

// 键盘控制
document.addEventListener('keydown', (event) => {
    if (!isGameRunning) return;

    switch (event.key) {
        case ' ':
            togglePause();
            break;
        case 'ArrowUp':
            if (dy !== 1 && !isPaused) {
                dx = 0;
                dy = -1;
            }
            break;
        case 'ArrowDown':
            if (dy !== -1 && !isPaused) {
                dx = 0;
                dy = 1;
            }
            break;
        case 'ArrowLeft':
            if (dx !== 1 && !isPaused) {
                dx = -1;
                dy = 0;
            }
            break;
        case 'ArrowRight':
            if (dx !== -1 && !isPaused) {
                dx = 1;
                dy = 0;
            }
            break;
    }
}); 