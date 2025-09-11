---
layout: default
title: Flappy Bird
permalink: /flappybird/
---

<style>
    body{
    }
    .wrap{
        margin-left: auto;
        margin-right: auto;
    }

    canvas{
        display: none;
        border-style: solid;
        border-width: 10px;
        border-color: #87CEEB;
        border-radius: 10px;
        background: linear-gradient(to bottom, #87CEEB 0%, #87CEEB 75%, #3CB371 75%, #228B22 100%);
    }
    canvas:focus{
        outline: none;
    }

    /* All screens style */
    #gameover p, #setting p, #menu p{
        font-size: 20px;
    }

    #gameover a, #setting a, #menu a{
        font-size: 30px;
        display: block;
    }

    #gameover a:hover, #setting a:hover, #menu a:hover{
        cursor: pointer;
    }

    #gameover a:hover::before, #setting a:hover::before, #menu a:hover::before{
        content: ">";
        margin-right: 10px;
    }

    #menu{
        display: block;
    }

    #gameover{
        display: none;
    }

    #setting{
        display: none;
    }

    #setting input{
        display:none;
    }

    #setting label{
        cursor: pointer;
    }

    #setting input:checked + label{
        background-color: #FFF;
        color: #000;
    }
</style>

<h2>Flappy Bird</h2>
<div class="container">
    <p class="fs-4">Score: <span id="score_value">0</span></p>

    <div class="container bg-secondary" style="text-align:center;">
        <!-- Main Menu -->
        <div id="menu" class="py-4 text-light">
            <p>Welcome to Flappy Bird, press <span style="background-color: #FFFFFF; color: #000000">space</span> to begin</p>
            <a id="new_game" class="link-alert">new game</a>
            <a id="setting_menu" class="link-alert">settings</a>
        </div>
        <!-- Game Over -->
        <div id="gameover" class="py-4 text-light">
            <p>Game Over, press <span style="background-color: #FFFFFF; color: #000000">space</span> to try again</p>
            <a id="new_game1" class="link-alert">new game</a>
            <a id="setting_menu1" class="link-alert">settings</a>
        </div>
        <!-- Play Screen -->
        <canvas id="flappybird" class="wrap" width="400" height="600" tabindex="1"></canvas>
        <!-- Settings Screen -->
        <div id="setting" class="py-4 text-light">
            <p>Settings Screen, press <span style="background-color: #FFFFFF; color: #000000">space</span> to go back to playing</p>
            <a id="new_game2" class="link-alert">new game</a>
            <br>
            <p>Difficulty:
                <input id="diff1" type="radio" name="difficulty" value="easy" checked/>
                <label for="diff1">Easy</label>
                <input id="diff2" type="radio" name="difficulty" value="normal"/>
                <label for="diff2">Normal</label>
                <input id="diff3" type="radio" name="difficulty" value="hard"/>
                <label for="diff3">Hard</label>
            </p>
            <p>Bird:
                <input id="bird1" type="radio" name="bird" value="yellow" checked/>
                <label for="bird1">Yellow</label>
                <input id="bird2" type="radio" name="bird" value="red"/>
                <label for="bird2">Red</label>
                <input id="bird3" type="radio" name="bird" value="blue"/>
                <label for="bird3">Blue</label>
            </p>
        </div>
    </div>
</div>

<script>
    (function(){
        /* Attributes of Game */
        /////////////////////////////////////////////////////////////
        // Canvas & Context
        const canvas = document.getElementById("flappybird");
        const ctx = canvas.getContext("2d");
        // HTML Game IDs
        const SCREEN_BIRD = 0;
        const screen_bird = document.getElementById("flappybird");
        const ele_score = document.getElementById("score_value");
        const difficulty_setting = document.getElementsByName("difficulty");
        const bird_setting = document.getElementsByName("bird");
        // HTML Screen IDs (div)
        const SCREEN_MENU = -1, SCREEN_GAME_OVER=1, SCREEN_SETTING=2;
        const screen_menu = document.getElementById("menu");
        const screen_game_over = document.getElementById("gameover");
        const screen_setting = document.getElementById("setting");
        // HTML Event IDs (a tags)
        const button_new_game = document.getElementById("new_game");
        const button_new_game1 = document.getElementById("new_game1");
        const button_new_game2 = document.getElementById("new_game2");
        const button_setting_menu = document.getElementById("setting_menu");
        const button_setting_menu1 = document.getElementById("setting_menu1");
        
        // Game Control
        let SCREEN = SCREEN_MENU;
        let bird;
        let pipes = [];
        let score;
        let frames;
        let gameRunning = false;
        let difficulty = 'easy';
        let birdColor = 'yellow';
        
        // Game settings based on difficulty
        const gameSettings = {
            easy: { pipeGap: 180, pipeSpeed: 1.5, gravity: 0.4, jump: -7 },
            normal: { pipeGap: 150, pipeSpeed: 2, gravity: 0.5, jump: -8 },
            hard: { pipeGap: 120, pipeSpeed: 2.5, gravity: 0.6, jump: -9 }
        };
        
        // Bird colors
        const birdColors = {
            yellow: '#FFD700',
            red: '#FF4444',
            blue: '#4444FF'
        };

        /* Display Control */
        /////////////////////////////////////////////////////////////
        let showScreen = function(screen_opt){
            SCREEN = screen_opt;
            switch(screen_opt){
                case SCREEN_BIRD:
                    screen_bird.style.display = "block";
                    screen_menu.style.display = "none";
                    screen_setting.style.display = "none";
                    screen_game_over.style.display = "none";
                    break;
                case SCREEN_GAME_OVER:
                    screen_bird.style.display = "block";
                    screen_menu.style.display = "none";
                    screen_setting.style.display = "none";
                    screen_game_over.style.display = "block";
                    break;
                case SCREEN_SETTING:
                    screen_bird.style.display = "none";
                    screen_menu.style.display = "none";
                    screen_setting.style.display = "block";
                    screen_game_over.style.display = "none";
                    break;
            }
        }

        /* Actions and Events */
        /////////////////////////////////////////////////////////////
        window.onload = function(){
            // HTML Events to Functions
            button_new_game.onclick = function(){newGame();};
            button_new_game1.onclick = function(){newGame();};
            button_new_game2.onclick = function(){newGame();};
            button_setting_menu.onclick = function(){showScreen(SCREEN_SETTING);};
            button_setting_menu1.onclick = function(){showScreen(SCREEN_SETTING);};
            
            // difficulty settings
            for(let i = 0; i < difficulty_setting.length; i++){
                difficulty_setting[i].addEventListener("click", function(){
                    for(let i = 0; i < difficulty_setting.length; i++){
                        if(difficulty_setting[i].checked){
                            difficulty = difficulty_setting[i].value;
                        }
                    }
                });
            }
            
            // bird color settings
            for(let i = 0; i < bird_setting.length; i++){
                bird_setting[i].addEventListener("click", function(){
                    for(let i = 0; i < bird_setting.length; i++){
                        if(bird_setting[i].checked){
                            birdColor = bird_setting[i].value;
                        }
                    }
                });
            }
            
            // activate window events
            window.addEventListener("keydown", function(evt) {
                // spacebar detected
                if(evt.code === "Space"){
                    if(SCREEN !== SCREEN_BIRD){
                        newGame();
                    } else if(gameRunning){
                        flap();
                    }
                    evt.preventDefault();
                }
            }, true);
            
            // canvas click event
            canvas.addEventListener("click", function(){
                if(gameRunning){
                    flap();
                }
            });
        }

        /* Bird is Flying (Driver Function) */
        /////////////////////////////////////////////////////////////
        let mainLoop = function(){
            if(!gameRunning) return;
            
            frames++;
            updateBird();
            updatePipes();
            checkCollisions();
            render();
            
            requestAnimationFrame(mainLoop);
        }

        /* New Game setup */
        /////////////////////////////////////////////////////////////
        let newGame = function(){
            // game screen
            showScreen(SCREEN_BIRD);
            screen_bird.focus();
            
            // reset game variables
            score = 0;
            frames = 0;
            pipes = [];
            gameRunning = true;
            altScore(score);
            
            // initialize bird
            const settings = gameSettings[difficulty];
            bird = {
                x: 50,
                y: canvas.height / 2,
                width: 30,
                height: 30,
                velocity: 0,
                gravity: settings.gravity,
                jump: settings.jump
            };
            
            mainLoop();
        }

        /* Bird Physics */
        /////////////////////////////////////////////////////////////
        let updateBird = function(){
            bird.velocity += bird.gravity;
            bird.y += bird.velocity;
            
            // Prevent bird from going above canvas
            if (bird.y < 0) {
                bird.y = 0;
                bird.velocity = 0;
            }
            
            // Check if bird hits ground
            if (bird.y + bird.height > canvas.height - 100) {
                gameOver();
            }
        }

        let flap = function(){
            bird.velocity = bird.jump;
        }

        /* Pipe Management */
        /////////////////////////////////////////////////////////////
        let updatePipes = function(){
            const settings = gameSettings[difficulty];
            
            // Create new pipe every 90 frames
            if (frames % 90 === 0) {
                createPipe();
            }
            
            // Update pipe positions
            for (let i = pipes.length - 1; i >= 0; i--) {
                pipes[i].x -= settings.pipeSpeed;
                
                // Remove pipes that have moved off screen
                if (pipes[i].x + 50 < 0) {
                    pipes.splice(i, 1);
                    continue;
                }
                
                // Check for scoring
                if (!pipes[i].passed && pipes[i].x + 50 < bird.x) {
                    pipes[i].passed = true;
                    score++;
                    altScore(score);
                }
            }
        }

        let createPipe = function(){
            const settings = gameSettings[difficulty];
            const minHeight = 50;
            const maxHeight = canvas.height - settings.pipeGap - minHeight - 100;
            const topHeight = Math.random() * (maxHeight - minHeight) + minHeight;
            
            pipes.push({
                x: canvas.width,
                topHeight: topHeight,
                bottomY: topHeight + settings.pipeGap,
                bottomHeight: canvas.height - 100 - (topHeight + settings.pipeGap),
                passed: false
            });
        }

        /* Collision Detection */
        /////////////////////////////////////////////////////////////
        let checkCollisions = function(){
            for (let i = 0; i < pipes.length; i++) {
                if (checkCollision(pipes[i])) {
                    gameOver();
                    return;
                }
            }
        }

        let checkCollision = function(pipe){
            // Bird boundaries
            const birdLeft = bird.x;
            const birdRight = bird.x + bird.width;
            const birdTop = bird.y;
            const birdBottom = bird.y + bird.height;
            
            // Pipe boundaries
            const pipeLeft = pipe.x;
            const pipeRight = pipe.x + 50;
            
            // Check if bird is within pipe's x range
            if (birdRight > pipeLeft && birdLeft < pipeRight) {
                // Check collision with top pipe
                if (birdTop < pipe.topHeight) {
                    return true;
                }
                // Check collision with bottom pipe
                if (birdBottom > pipe.bottomY) {
                    return true;
                }
            }
            return false;
        }

        /* Rendering */
        /////////////////////////////////////////////////////////////
        let render = function(){
            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw background elements
            drawClouds();
            drawGround();
            drawPipes();
            drawBird();
        }

        let drawBird = function(){
            ctx.fillStyle = birdColors[birdColor];
            ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
            
            // Draw bird's eye
            ctx.fillStyle = 'white';
            ctx.fillRect(bird.x + 20, bird.y + 5, 6, 6);
            ctx.fillStyle = 'black';
            ctx.fillRect(bird.x + 22, bird.y + 7, 2, 2);
            
            // Draw beak
            ctx.fillStyle = 'orange';
            ctx.fillRect(bird.x + 30, bird.y + 12, 8, 6);
        }

        let drawPipes = function(){
            ctx.fillStyle = '#228B22';
            pipes.forEach(pipe => {
                // Draw top pipe
                ctx.fillRect(pipe.x, 0, 50, pipe.topHeight);
                // Draw bottom pipe
                ctx.fillRect(pipe.x, pipe.bottomY, 50, pipe.bottomHeight);
                
                // Add pipe caps
                ctx.fillStyle = '#32CD32';
                ctx.fillRect(pipe.x - 5, pipe.topHeight - 20, 60, 20);
                ctx.fillRect(pipe.x - 5, pipe.bottomY, 60, 20);
                ctx.fillStyle = '#228B22';
            });
        }

        let drawGround = function(){
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(0, canvas.height - 100, canvas.width, 100);
            
            // Add some grass texture
            ctx.fillStyle = '#228B22';
            for (let i = 0; i < canvas.width; i += 20) {
                ctx.fillRect(i, canvas.height - 100, 15, 10);
            }
        }

        let drawClouds = function(){
            ctx.fillStyle = 'white';
            const cloudY = 50;
            for (let i = 0; i < 3; i++) {
                const x = (i * 150 + frames * 0.2) % (canvas.width + 60) - 60;
                drawCloud(x, cloudY + i * 30);
            }
        }

        let drawCloud = function(x, y){
            ctx.beginPath();
            ctx.arc(x, y, 20, 0, Math.PI * 2);
            ctx.arc(x + 25, y, 25, 0, Math.PI * 2);
            ctx.arc(x + 50, y, 20, 0, Math.PI * 2);
            ctx.arc(x + 25, y - 15, 20, 0, Math.PI * 2);
            ctx.fill();
        }

        /* Game Over */
        /////////////////////////////////////////////////////////////
        let gameOver = function(){
            gameRunning = false;
            showScreen(SCREEN_GAME_OVER);
        }

        /* Update Score */
        /////////////////////////////////////////////////////////////
        let altScore = function(score_val){
            ele_score.innerHTML = String(score_val);
        }
    })();
</script>