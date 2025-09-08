---
layout: default
title: Background with Object
description: Use JavaScript to have an in motion background.
sprite: images/santasleigh.png
background: images/snow4.png
permalink: /background5
---
<!-- Below is the game world -->
<canvas id="world"></canvas>


<script>
  // Defines the canvas element where the game is drawn
  const canvas = document.getElementById("world");
  // Context is used to draw 2D graphics on the canvas
  const ctx = canvas.getContext('2d');
  // Setting up image objects for background and sprite
  const backgroundImg = new Image();
  const spriteImg = new Image();
  // Load the background image from Jekyll front-matter
  backgroundImg.src = '{{page.background}}';
  // Load the sprite image from Jekyll front-matter
  spriteImg.src = '{{page.sprite}}';

  // Track when images are fully loaded before starting
  let imagesLoaded = 0;
  backgroundImg.onload = function() {
    imagesLoaded++; // Count background loaded
    startGameWorld(); // Attempt to start game world
  };
  spriteImg.onload = function() {
    imagesLoaded++; // Count sprite loaded
    startGameWorld(); // Attempt to start game world
  };

  function startGameWorld() {
    if (imagesLoaded < 2) return; // Ensure both images are ready

    // Base class for any object in the game
    class GameObject {
      constructor(image, width, height, x = 0, y = 0, speedRatio = 0) {
        this.image = image; // Image to draw
        this.width = width; // Object width
        this.height = height; // Object height
        this.x = x; // X position
        this.y = y; // Y position
        this.speedRatio = speedRatio; // Speed factor relative to game speed
        this.speed = GameWorld.gameSpeed * this.speedRatio; // Final speed
      }
      update() {} // Placeholder for movement/logic
      draw(ctx) {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height); // Render image
      }
    }

    // Background that scrolls infinitely
    class Background extends GameObject {
      constructor(image, gameWorld) {
        // Stretch to fill entire canvas, slight speed
        super(image, gameWorld.width, gameWorld.height, 0, 0, 0.1);
      }
      update() {
        this.x = (this.x - this.speed) % this.width; // Loop background
      }
      draw(ctx) {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height); // Draw 2 copies for seamless loop
      }
    }

    // Player class that bobs up and down
    class Player extends GameObject {
      constructor(image, gameWorld) {
        const width = image.naturalWidth * 1.5;  // Scale sprite up
        const height = image.naturalHeight * 1.5; // Maintain proportions
        const x = (gameWorld.width - width) / 2;  // Center horizontally
        const y = (gameWorld.height - height) / 2; // Center vertically
        super(image, width, height, x, y);
        this.baseY = y; // Remember base Y position
        this.frame = 0; // Track animation frame
      }
      update() {
        // Move up/down in sine wave motion
        this.y = this.baseY + Math.sin(this.frame * 0.05) * 20;
        this.frame++; // Advance animation
      }
    }

    // The entire game container
    class GameWorld {
      static gameSpeed = 5; // Global speed factor
      constructor(backgroundImg, spriteImg) {
        this.canvas = document.getElementById("world"); // Reference canvas
        this.ctx = this.canvas.getContext('2d'); // Drawing context
        this.width = window.innerWidth;  // Full screen width
        this.height = window.innerHeight; // Full screen height
        this.canvas.width = this.width; // Apply width to canvas
        this.canvas.height = this.height; // Apply height to canvas
        this.canvas.style.width = `${this.width}px`; // Style width
        this.canvas.style.height = `${this.height}px`; // Style height
        this.canvas.style.position = 'absolute'; // Place absolute
        this.canvas.style.left = `0px`; // Align left
        this.canvas.style.top = `${(window.innerHeight - this.height) / 2}px`; // Align top

        // Add objects to the game world (background + player)
        this.objects = [
         new Background(backgroundImg, this),
         new Player(spriteImg, this)
        ];
      }
      gameLoop() {
        this.ctx.clearRect(0, 0, this.width, this.height); // Clear frame
        for (const obj of this.objects) {
          obj.update(); // Update each object
          obj.draw(this.ctx); // Draw each object
        }
        requestAnimationFrame(this.gameLoop.bind(this)); // Keep looping
      }
      start() {
        this.gameLoop(); // Begin animation loop
      }
    }

    // Create game world and start running
    const world = new GameWorld(backgroundImg, spriteImg);
    world.start();
  }
</script>