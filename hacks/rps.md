---
layout: default
title: Rock Paper Scissors
permalink: /rps/
---

<style>
    body {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
    }

    .wrap {
        margin-left: auto;
        margin-right: auto;
        max-width: 600px;
    }

    .game-container {
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        border-radius: 20px;
        padding: 40px;
        text-align: center;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        border: 1px solid rgba(255, 255, 255, 0.2);
        margin: 20px auto;
    }

    /* All screens style */
    #gameover p, #setting p, #menu p {
        font-size: 20px;
        margin-bottom: 20px;
    }

    #gameover a, #setting a, #menu a {
        font-size: 24px;
        display: block;
        color: white;
        text-decoration: none;
        padding: 10px;
        margin: 10px 0;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 10px;
        border: 1px solid rgba(255, 255, 255, 0.3);
        transition: all 0.3s ease;
    }

    #gameover a:hover, #setting a:hover, #menu a:hover {
        cursor: pointer;
        background: rgba(255, 255, 255, 0.3);
        transform: translateY(-2px);
    }

    #gameover a:hover::before, #setting a:hover::before, #menu a:hover::before {
        content: ">";
        margin-right: 10px;
    }

    #menu {
        display: block;
    }

    #gameover {
        display: none;
    }

    #setting {
        display: none;
    }

    #gamescreen {
        display: none;
    }

    .score-board {
        display: flex;
        justify-content: space-around;
        margin-bottom: 30px;
        font-size: 1.2em;
    }

    .score {
        background: rgba(255, 255, 255, 0.2);
        padding: 15px 25px;
        border-radius: 15px;
        border: 1px solid rgba(255, 255, 255, 0.3);
    }

    .choices {
        display: flex;
        justify-content: center;
        gap: 20px;
        margin: 40px 0;
        flex-wrap: wrap;
    }

    .choice-btn {
        background: rgba(255, 255, 255, 0.2);
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-radius: 20px;
        padding: 20px;
        font-size: 3em;
        cursor: pointer;
        transition: all 0.3s ease;
        min-width: 100px;
        min-height: 100px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
    }

    .choice-btn:hover {
        transform: translateY(-5px);
        background: rgba(255, 255, 255, 0.3);
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    }

    .choice-btn:active {
        transform: translateY(-2px);
    }

    .battle-area {
        margin: 40px 0;
        padding: 30px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 15px;
        border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .battle-choices {
        display: flex;
        justify-content: space-around;
        align-items: center;
        margin-bottom: 20px;
        flex-wrap: wrap;
        gap: 20px;
    }

    .battle-choice {
        text-align: center;
    }

    .battle-emoji {
        font-size: 4em;
        margin-bottom: 10px;
        display: block;
        animation: fadeIn 0.5s ease;
    }

    .battle-label {
        font-size: 1.1em;
        opacity: 0.8;
    }

    .vs {
        font-size: 2em;
        font-weight: bold;
        opacity: 0.6;
    }

    .result {
        font-size: 1.5em;
        font-weight: bold;
        margin-top: 20px;
        padding: 15px;
        border-radius: 10px;
        animation: slideIn 0.5s ease;
    }

    .result.win {
        background: rgba(46, 204, 113, 0.3);
        border: 1px solid rgba(46, 204, 113, 0.5);
    }

    .result.lose {
        background: rgba(231, 76, 60, 0.3);
        border: 1px solid rgba(231, 76, 60, 0.5);
    }

    .result.tie {
        background: rgba(241, 196, 15, 0.3);
        border: 1px solid rgba(241, 196, 15, 0.5);
    }

    #setting input {
        display: none;
    }

    #setting label {
        cursor: pointer;
        padding: 10px 20px;
        margin: 5px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 10px;
        border: 1px solid rgba(255, 255, 255, 0.3);
        transition: all 0.3s ease;
        display: inline-block;
    }

    #setting input:checked + label {
        background-color: #FFF;
        color: #000;
    }

    @keyframes fadeIn {
        from { opacity: 0; transform: scale(0.5); }
        to { opacity: 1; transform: scale(1); }
    }

    @keyframes slideIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }

    @media (max-width: 600px) {
        .battle-choices {
            flex-direction: column;
        }
        
        .vs {
            order: 1;
        }
        
        .choices {
            gap: 15px;
        }
        
        .choice-btn {
            min-width: 80px;
            min-height: 80px;
            font-size: 2.5em;
        }
    }
</style>

<h2>Rock Paper Scissors</h2>
<div class="container">
    <p class="fs-4">Score: Player <span id="player_score">0</span> - Computer <span id="computer_score">0</span></p>

    <div class="wrap">
        <div class="game-container">
            <!-- Main Menu -->
            <div id="menu" class="py-4 text-light">
                <h1>🎮 Rock Paper Scissors</h1>
                <p>Welcome to Rock Paper Scissors! Press <span style="background-color: #FFFFFF; color: #000000">space</span> to begin</p>
                <a id="new_game" class="link-alert">New Game</a>
                <a id="setting_menu" class="link-alert">Settings</a>
            </div>

            <!-- Game Over -->
            <div id="gameover" class="py-4 text-light">
                <h1>🎮 Game Over</h1>
                <p id="final_result">Game Over! Press <span style="background-color: #FFFFFF; color: #000000">space</span> to play again</p>
                <a id="new_game1" class="link-alert">New Game</a>
                <a id="setting_menu1" class="link-alert">Settings</a>
            </div>

            <!-- Game Screen -->
            <div id="gamescreen" class="py-4 text-light">
                <h1>🎮 Rock Paper Scissors</h1>
                
                <div class="score-board">
                    <div class="score">
                        <div>Player</div>
                        <div id="player-score">0</div>
                    </div>
                    <div class="score">
                        <div>Computer</div>
                        <div id="computer-score">0</div>
                    </div>
                </div>

                <div class="choices">
                    <button class="choice-btn" data-choice="rock">🪨</button>
                    <button class="choice-btn" data-choice="paper">📄</button>
                    <button class="choice-btn" data-choice="scissors">✂️</button>
                </div>

                <div class="battle-area" id="battle-area" style="display: none;">
                    <div class="battle-choices">
                        <div class="battle-choice">
                            <span class="battle-emoji" id="player-choice-emoji"></span>
                            <div class="battle-label">You</div>
                        </div>
                        <div class="vs">VS</div>
                        <div class="battle-choice">
                            <span class="battle-emoji" id="computer-choice-emoji"></span>
                            <div class="battle-label">Computer</div>
                        </div>
                    </div>
                    <div class="result" id="result"></div>
                </div>

                <a id="back_to_menu" class="link-alert" style="margin-top: 20px;">Back to Menu</a>
            </div>

            <!-- Settings Screen -->
            <div id="setting" class="py-4 text-light">
                <h1>⚙️ Settings</h1>
                <p>Settings Screen, press <span style="background-color: #FFFFFF; color: #000000">space</span> to go back to menu</p>
                <a id="new_game2" class="link-alert">New Game</a>
                <br>
                <p>Win Condition:
                    <input id="win5" type="radio" name="wincondition" value="5" checked/>
                    <label for="win5">First to 5</label>
                    <input id="win10" type="radio" name="wincondition" value="10"/>
                    <label for="win10">First to 10</label>
                    <input id="win0" type="radio" name="wincondition" value="0"/>
                    <label for="win0">Endless</label>
                </p>
                <p>Animation Speed:
                    <input id="speed1" type="radio" name="speed" value="slow"/>
                    <label for="speed1">Slow</label>
                    <input id="speed2" type="radio" name="speed" value="normal" checked/>
                    <label for="speed2">Normal</label>
                    <input id="speed3" type="radio" name="speed" value="fast"/>
                    <label for="speed3">Fast</label>
                </p>
                <a id="back_to_menu_settings" class="link-alert">Back to Menu</a>
            </div>
        </div>
    </div>
</div>

<script>
    (function(){
        /* Game Attributes */
        /////////////////////////////////////////////////////////////
        // HTML Screen IDs
        const SCREEN_MENU = 0, SCREEN_GAME = 1, SCREEN_GAME_OVER = 2, SCREEN_SETTING = 3;
        const screen_menu = document.getElementById("menu");
        const screen_game = document.getElementById("gamescreen");
        const screen_game_over = document.getElementById("gameover");
        const screen_setting = document.getElementById("setting");
        
        // HTML Event IDs
        const button_new_game = document.getElementById("new_game");
        const button_new_game1 = document.getElementById("new_game1");
        const button_new_game2 = document.getElementById("new_game2");
        const button_setting_menu = document.getElementById("setting_menu");
        const button_setting_menu1 = document.getElementById("setting_menu1");
        const button_back_to_menu = document.getElementById("back_to_menu");
        const button_back_to_menu_settings = document.getElementById("back_to_menu_settings");
        
        // Game elements
        const player_score_display = document.getElementById("player-score");
        const computer_score_display = document.getElementById("computer-score");
        const player_score_header = document.getElementById("player_score");
        const computer_score_header = document.getElementById("computer_score");
        const battle_area = document.getElementById("battle-area");
        const player_choice_emoji = document.getElementById("player-choice-emoji");
        const computer_choice_emoji = document.getElementById("computer-choice-emoji");
        const result_element = document.getElementById("result");
        const final_result = document.getElementById("final_result");
        const choice_buttons = document.querySelectorAll('.choice-btn');
        
        // Settings
        const win_condition_setting = document.getElementsByName("wincondition");
        const speed_setting = document.getElementsByName("speed");
        
        // Game variables
        let SCREEN = SCREEN_MENU;
        let player_score = 0;
        let computer_score = 0;
        let win_condition = 5;
        let animation_speed = 'normal';
        
        const choices = ['rock', 'paper', 'scissors'];
        const emojis = {
            rock: '🪨',
            paper: '📄',
            scissors: '✂️'
        };

        /* Display Control */
        /////////////////////////////////////////////////////////////
        let showScreen = function(screen_opt){
            SCREEN = screen_opt;
            switch(screen_opt){
                case SCREEN_MENU:
                    screen_menu.style.display = "block";
                    screen_game.style.display = "none";
                    screen_game_over.style.display = "none";
                    screen_setting.style.display = "none";
                    break;
                case SCREEN_GAME:
                    screen_menu.style.display = "none";
                    screen_game.style.display = "block";
                    screen_game_over.style.display = "none";
                    screen_setting.style.display = "none";
                    break;
                case SCREEN_GAME_OVER:
                    screen_menu.style.display = "none";
                    screen_game.style.display = "none";
                    screen_game_over.style.display = "block";
                    screen_setting.style.display = "none";
                    break;
                case SCREEN_SETTING:
                    screen_menu.style.display = "none";
                    screen_game.style.display = "none";
                    screen_game_over.style.display = "none";
                    screen_setting.style.display = "block";
                    break;
            }
        }

        /* Game Logic */
        /////////////////////////////////////////////////////////////
        let playGame = function(playerChoice) {
            const computerChoice = getComputerChoice();
            const result = determineWinner(playerChoice, computerChoice);
            
            displayBattle(playerChoice, computerChoice, result);
            updateScore(result);
            
            // Check for game end
            if (win_condition > 0 && (player_score >= win_condition || computer_score >= win_condition)) {
                setTimeout(function() {
                    endGame();
                }, 2000);
            }
        }

        let getComputerChoice = function() {
            const randomIndex = Math.floor(Math.random() * choices.length);
            return choices[randomIndex];
        }

        let determineWinner = function(playerChoice, computerChoice) {
            if (playerChoice === computerChoice) {
                return 'tie';
            }
            
            if (
                (playerChoice === 'rock' && computerChoice === 'scissors') ||
                (playerChoice === 'paper' && computerChoice === 'rock') ||
                (playerChoice === 'scissors' && computerChoice === 'paper')
            ) {
                return 'win';
            } else {
                return 'lose';
            }
        }

        let displayBattle = function(playerChoice, computerChoice, result) {
            battle_area.style.display = 'block';
            
            player_choice_emoji.textContent = emojis[playerChoice];
            computer_choice_emoji.textContent = emojis[computerChoice];
            
            let resultText = '';
            let resultClass = '';
            
            switch(result) {
                case 'win':
                    resultText = '🎉 You Win!';
                    resultClass = 'win';
                    break;
                case 'lose':
                    resultText = '😔 You Lose!';
                    resultClass = 'lose';
                    break;
                case 'tie':
                    resultText = '🤝 It\'s a Tie!';
                    resultClass = 'tie';
                    break;
            }
            
            result_element.textContent = resultText;
            result_element.className = `result ${resultClass}`;
        }

        let updateScore = function(result) {
            if (result === 'win') {
                player_score++;
            } else if (result === 'lose') {
                computer_score++;
            }
            
            player_score_display.textContent = player_score;
            computer_score_display.textContent = computer_score;
            player_score_header.textContent = player_score;
            computer_score_header.textContent = computer_score;
        }

        let endGame = function() {
            let message = '';
            if (player_score > computer_score) {
                message = `🎉 Congratulations! You won ${player_score} to ${computer_score}! Press space to play again.`;
            } else {
                message = `😔 Computer wins ${computer_score} to ${player_score}! Press space to try again.`;
            }
            final_result.innerHTML = message;
            showScreen(SCREEN_GAME_OVER);
        }

        /* New Game Setup */
        /////////////////////////////////////////////////////////////
        let newGame = function(){
            showScreen(SCREEN_GAME);
            player_score = 0;
            computer_score = 0;
            player_score_display.textContent = '0';
            computer_score_display.textContent = '0';
            player_score_header.textContent = '0';
            computer_score_header.textContent = '0';
            battle_area.style.display = 'none';
        }

        /* Settings */
        /////////////////////////////////////////////////////////////
        let setWinCondition = function(condition) {
            win_condition = parseInt(condition);
        }

        let setAnimationSpeed = function(speed) {
            animation_speed = speed;
        }

        /* Event Listeners */
        /////////////////////////////////////////////////////////////
        window.onload = function(){
            // Button events
            button_new_game.onclick = function(){newGame();};
            button_new_game1.onclick = function(){newGame();};
            button_new_game2.onclick = function(){newGame();};
            button_setting_menu.onclick = function(){showScreen(SCREEN_SETTING);};
            button_setting_menu1.onclick = function(){showScreen(SCREEN_SETTING);};
            button_back_to_menu.onclick = function(){showScreen(SCREEN_MENU);};
            button_back_to_menu_settings.onclick = function(){showScreen(SCREEN_MENU);};

            // Choice buttons
            choice_buttons.forEach(button => {
                button.addEventListener('click', () => {
                    const playerChoice = button.dataset.choice;
                    playGame(playerChoice);
                });
            });

            // Win condition settings
            setWinCondition(5);
            for(let i = 0; i < win_condition_setting.length; i++){
                win_condition_setting[i].addEventListener("click", function(){
                    for(let i = 0; i < win_condition_setting.length; i++){
                        if(win_condition_setting[i].checked){
                            setWinCondition(win_condition_setting[i].value);
                        }
                    }
                });
            }

            // Speed settings
            setAnimationSpeed('normal');
            for(let i = 0; i < speed_setting.length; i++){
                speed_setting[i].addEventListener("click", function(){
                    for(let i = 0; i < speed_setting.length; i++){
                        if(speed_setting[i].checked){
                            setAnimationSpeed(speed_setting[i].value);
                        }
                    }
                });
            }

            // Keyboard events
            window.addEventListener("keydown", function(evt) {
                // Spacebar detected
                if(evt.code === "Space") {
                    if (SCREEN === SCREEN_MENU || SCREEN === SCREEN_GAME_OVER) {
                        newGame();
                    } else if (SCREEN === SCREEN_SETTING) {
                        showScreen(SCREEN_MENU);
                    }
                }
                
                // Game controls (only during game)
                if (SCREEN === SCREEN_GAME) {
                    switch(evt.key.toLowerCase()) {
                        case 'r':
                            playGame('rock');
                            break;
                        case 'p':
                            playGame('paper');
                            break;
                        case 's':
                            playGame('scissors');
                            break;
                    }
                }
            }, true);
        }
    })();
</script>