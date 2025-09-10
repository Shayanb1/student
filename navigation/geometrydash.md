---
layout: default
title: Geometry Dash Game
permalink: /geodash
---

<style>
body {
    margin: 0;
    padding: 0;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    font-family: 'Arial', sans-serif;
    overflow-x: hidden;
}
.game-container {
    text-align: center;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 20px;
    padding: 20px;
    backdrop-filter: blur(10px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    margin-left: -650px;
}
canvas {
    border: 3px solid #fff;
    border-radius: 10px;
    background: linear-gradient(to bottom, #87CEEB, #98FB98);
    display: block;
    margin: 0 auto;
    max-width: 100%;
    height: auto;
}
.ui {
    color: white;
    margin: 10px 0;
    font-size: 18px;
    font-weight: bold;
}
.controls {
    color: rgba(255, 255, 255, 0.8);
    font-size: 14px;
    margin-top: 10px;
}
.game-over {
    color: #ff6b6b;
    font-size: 24px;
    font-weight: bold;
    margin: 10px 0;
}
</style>

<div class="game-container">
    <h1 style="color: white; margin-top: 0;">🎮 Geometry Dash</h1>
    <div class="ui">
        <span>Score: <span id="score">0</span></span>
        <span style="margin-left: 20px;">Best: <span id="best">0</span></span>
    </div>
    <canvas id="gameCanvas" width="3000" height="1500"></canvas>
    <div id="gameOver" class="game-over" style="display: none;">
        Game Over! Press SPACE to restart
    </div>
    <div class="controls">
        Press SPACE or click to jump | Avoid the red obstacles!
    </div>
</div>

<script>
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const bestElement = document.getElementById('best');
const gameOverElement = document.getElementById('gameOver');

// Game state
let gameRunning = true;
let score = 0;
let bestScore = localStorage.getItem('geometryDashBest') || 0;
bestElement.textContent = bestScore;

// Player object
const player = {
    x: 300,
    y: 1200,
    width: 90,
    height: 90,
    velocityY: 0,
    jumpPower: -36,
    gravity: 1.5,
    grounded: false,
    color: '#FFD700'
};

// Game objects
let obstacles = [];
let particles = [];
let groundY = canvas.height - 180;

// Background elements
let backgroundOffset = 0;

class Obstacle {
    constructor(x, height) {
        this.x = x;
        this.y = groundY - height;
        this.width = 75;
        this.height = height;
        this.speed = 12;
        this.color = '#ff4757';
    }

    update() {
        this.x -= this.speed;
    }

    draw() {
        // Draw obstacle with glow effect
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 30;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Draw highlight
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#ff6b7a';
        ctx.fillRect(this.x + 6, this.y + 6, this.width - 12, 24);
    }
}

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.velocityX = (Math.random() - 0.5) * 12;
        this.velocityY = Math.random() * -9;
        this.life = 1;
        this.decay = 0.02;
        this.size = Math.random() * 9 + 3;
    }

    update() {
        this.x += this.velocityX;
        this.y += this.velocityY;
        this.velocityY += 0.3;
        this.life -= this.decay;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.life;
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(this.x, this.y, this.size, this.size);
        ctx.restore();
    }
}

function drawBackground() {
    // Moving grid pattern
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 3;
    
    for (let i = 0; i < canvas.width + 150; i += 150) {
        let x = i - (backgroundOffset % 150);
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
    
    for (let i = 0; i < canvas.height; i += 150) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
    }
    
    backgroundOffset += 6;
}

function drawGround() {
    // Ground
    ctx.fillStyle = '#2d3436';
    ctx.fillRect(0, groundY, canvas.width, canvas.height - groundY);
    
    // Ground pattern
    ctx.fillStyle = '#636e72';
    for (let i = 0; i < canvas.width; i += 120) {
        let x = i - (backgroundOffset % 120);
        ctx.fillRect(x, groundY, 60, 30);
    }
}

function drawPlayer() {
    ctx.save();
    
    // Player rotation based on velocity
    const rotation = player.velocityY * 0.1;
    ctx.translate(player.x + player.width/2, player.y + player.height/2);
    ctx.rotate(rotation);
    
    // Player glow
    ctx.shadowColor = player.color;
    ctx.shadowBlur = 45;
    ctx.fillStyle = player.color;
    ctx.fillRect(-player.width/2, -player.height/2, player.width, player.height);
    
    // Player highlight
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#FFF8DC';
    ctx.fillRect(-player.width/2 + 9, -player.height/2 + 9, player.width - 18, 24);
    
    ctx.restore();
}

function updatePlayer() {
    // Apply gravity
    player.velocityY += player.gravity;
    player.y += player.velocityY;

    // Ground collision
    if (player.y + player.height >= groundY) {
        player.y = groundY - player.height;
        player.velocityY = 0;
        player.grounded = true;
        
        // Create landing particles
        if (Math.random() < 0.3) {
            particles.push(new Particle(
                player.x + Math.random() * player.width,
                player.y + player.height
            ));
        }
    } else {
        player.grounded = false;
    }

    // Prevent going off top
    if (player.y < 0) {
        player.y = 0;
        player.velocityY = 0;
    }
}

function jump() {
    if (player.grounded && gameRunning) {
        player.velocityY = player.jumpPower;
        player.grounded = false;
        
        // Create jump particles
        for (let i = 0; i < 5; i++) {
            particles.push(new Particle(
                player.x + Math.random() * player.width,
                player.y + player.height
            ));
        }
    }
}

function spawnObstacle() {
    const height = Math.random() * 240 + 120;
    obstacles.push(new Obstacle(canvas.width, height));
}

function checkCollisions() {
    for (let obstacle of obstacles) {
        if (player.x < obstacle.x + obstacle.width &&
            player.x + player.width > obstacle.x &&
            player.y < obstacle.y + obstacle.height &&
            player.y + player.height > obstacle.y) {
            gameOver();
            return;
        }
    }
}

function gameOver() {
    gameRunning = false;
    gameOverElement.style.display = 'block';
    
    // Update best score
    if (score > bestScore) {
        bestScore = score;
        localStorage.setItem('geometryDashBest', bestScore);
        bestElement.textContent = bestScore;
    }
    
    // Explosion particles
    for (let i = 0; i < 20; i++) {
        particles.push(new Particle(
            player.x + player.width/2,
            player.y + player.height/2
        ));
    }
}

function resetGame() {
    gameRunning = true;
    gameOverElement.style.display = 'none';
    score = 0;
    obstacles = [];
    particles = [];
    player.x = 300;
    player.y = 1200;
    player.velocityY = 0;
    player.grounded = false;
}

function gameLoop() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw background
    drawBackground();
    drawGround();

    if (gameRunning) {
        // Update player
        updatePlayer();

        // Spawn obstacles
        if (Math.random() < 0.008) {
            spawnObstacle();
        }

        // Update obstacles
        obstacles = obstacles.filter(obstacle => {
            obstacle.update();
            
            // Remove obstacles that are off-screen
            if (obstacle.x + obstacle.width < 0) {
                score += 10;
                return false;
            }
            return true;
        });

        // Check collisions
        checkCollisions();

        // Update score display
        scoreElement.textContent = score;
    }

    // Update particles
    particles = particles.filter(particle => {
        particle.update();
        return particle.life > 0;
    });

    // Draw everything
    if (gameRunning) {
        drawPlayer();
    }
    
    obstacles.forEach(obstacle => obstacle.draw());
    particles.forEach(particle => particle.draw());

    requestAnimationFrame(gameLoop);
}

// Event listeners
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        if (gameRunning) {
            jump();
        } else {
            resetGame();
        }
    }
});

canvas.addEventListener('click', () => {
    if (gameRunning) {
        jump();
    } else {
        resetGame();
    }
});

// Start the game
gameLoop();
</script>