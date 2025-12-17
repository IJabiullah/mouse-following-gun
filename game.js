// Game configuration
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
canvas.width = 800;
canvas.height = 600;

// Game state
let score = 0;
let lives = 3;
let gameRunning = true;
let mouseX = canvas.width / 2;
let mouseY = canvas.height / 2;

// Cannon configuration
const cannon = {
    x: canvas.width / 2,
    y: canvas.height - 60,
    baseWidth: 40,
    baseHeight: 30,
    barrelLength: 50,
    barrelWidth: 12,
    angle: -Math.PI / 2 // Initially pointing up
};

// Arrays for game objects
const bullets = [];
const chickens = [];

// Bullet configuration
const bulletSpeed = 8;
const bulletRadius = 4;

// Chicken configuration
const chickenSpawnRate = 0.02; // Approximately 1.2 chickens per second at 60fps
const chickenSpeed = 2;
const chickenWidth = 40;
const chickenHeight = 40;

// Mouse move event
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
    
    // Calculate angle between cannon and mouse
    const dx = mouseX - cannon.x;
    const dy = mouseY - cannon.y;
    cannon.angle = Math.atan2(dy, dx);
});

// Click to shoot
canvas.addEventListener('click', () => {
    if (gameRunning) {
        shootBullet();
    }
});

// Shoot bullet
function shootBullet() {
    const bullet = {
        x: cannon.x + Math.cos(cannon.angle) * cannon.barrelLength,
        y: cannon.y + Math.sin(cannon.angle) * cannon.barrelLength,
        vx: Math.cos(cannon.angle) * bulletSpeed,
        vy: Math.sin(cannon.angle) * bulletSpeed,
        radius: bulletRadius
    };
    bullets.push(bullet);
}

// Spawn chicken
function spawnChicken() {
    const chicken = {
        x: Math.random() * (canvas.width - chickenWidth),
        y: -chickenHeight,
        speed: chickenSpeed + Math.random() * 1.5,
        width: chickenWidth,
        height: chickenHeight,
        wobble: Math.random() * Math.PI * 2
    };
    chickens.push(chicken);
}

// Draw cannon
function drawCannon() {
    ctx.save();
    ctx.translate(cannon.x, cannon.y);
    
    // Draw base (brown/gray)
    ctx.fillStyle = '#654321';
    ctx.fillRect(-cannon.baseWidth / 2, -cannon.baseHeight / 2, cannon.baseWidth, cannon.baseHeight);
    
    // Draw barrel (rotating part)
    ctx.rotate(cannon.angle);
    ctx.fillStyle = '#4a4a4a';
    ctx.fillRect(0, -cannon.barrelWidth / 2, cannon.barrelLength, cannon.barrelWidth);
    
    // Draw barrel tip
    ctx.fillStyle = '#2a2a2a';
    ctx.beginPath();
    ctx.arc(cannon.barrelLength, 0, cannon.barrelWidth / 2, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
}

// Draw bullet
function drawBullet(bullet) {
    ctx.fillStyle = '#ff4444';
    ctx.beginPath();
    ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2);
    ctx.fill();
    
    // Add glow effect
    ctx.strokeStyle = '#ff8888';
    ctx.lineWidth = 2;
    ctx.stroke();
}

// Draw chicken
function drawChicken(chicken) {
    ctx.save();
    ctx.translate(chicken.x + chicken.width / 2, chicken.y + chicken.height / 2);
    
    // Body (white)
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(0, 5, 18, 22, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#cccccc';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // Head (white)
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(0, -10, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#cccccc';
    ctx.stroke();
    
    // Comb (red)
    ctx.fillStyle = '#ff0000';
    ctx.beginPath();
    ctx.moveTo(-5, -15);
    ctx.lineTo(-3, -20);
    ctx.lineTo(0, -18);
    ctx.lineTo(3, -22);
    ctx.lineTo(5, -16);
    ctx.lineTo(3, -15);
    ctx.closePath();
    ctx.fill();
    
    // Beak (orange)
    ctx.fillStyle = '#ff9900';
    ctx.beginPath();
    ctx.moveTo(8, -8);
    ctx.lineTo(15, -10);
    ctx.lineTo(8, -12);
    ctx.closePath();
    ctx.fill();
    
    // Eyes (black)
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(-4, -12, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(4, -12, 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Wings (add wobble effect)
    const wobbleOffset = Math.sin(chicken.wobble) * 3;
    ctx.fillStyle = '#f0f0f0';
    
    // Left wing
    ctx.beginPath();
    ctx.ellipse(-12 + wobbleOffset, 0, 8, 12, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#cccccc';
    ctx.stroke();
    
    // Right wing
    ctx.beginPath();
    ctx.ellipse(12 - wobbleOffset, 0, 8, 12, 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // Feet (orange)
    ctx.strokeStyle = '#ff9900';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-6, 20);
    ctx.lineTo(-6, 25);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(6, 20);
    ctx.lineTo(6, 25);
    ctx.stroke();
    
    ctx.restore();
}

// Update bullets
function updateBullets() {
    for (let i = bullets.length - 1; i >= 0; i--) {
        const bullet = bullets[i];
        bullet.x += bullet.vx;
        bullet.y += bullet.vy;
        
        // Remove bullets that go off screen
        if (bullet.x < 0 || bullet.x > canvas.width || 
            bullet.y < 0 || bullet.y > canvas.height) {
            bullets.splice(i, 1);
        }
    }
}

// Update chickens
function updateChickens() {
    for (let i = chickens.length - 1; i >= 0; i--) {
        const chicken = chickens[i];
        chicken.y += chicken.speed;
        chicken.wobble += 0.1;
        
        // Check if chicken reached bottom (lose a life)
        if (chicken.y > canvas.height) {
            chickens.splice(i, 1);
            lives--;
            updateLives();
            
            if (lives <= 0) {
                gameOver();
            }
        }
    }
}

// Check collisions
function checkCollisions() {
    for (let i = bullets.length - 1; i >= 0; i--) {
        const bullet = bullets[i];
        
        for (let j = chickens.length - 1; j >= 0; j--) {
            const chicken = chickens[j];
            
            // Improved collision detection accounting for chicken's elliptical shape
            const chickenCenterX = chicken.x + chicken.width / 2;
            const chickenCenterY = chicken.y + chicken.height / 2;
            const dx = bullet.x - chickenCenterX;
            const dy = bullet.y - chickenCenterY;
            
            // Use ellipse collision: normalize distances by chicken dimensions
            const normalizedDistance = Math.sqrt(
                (dx * dx) / ((chicken.width / 2) * (chicken.width / 2)) + 
                (dy * dy) / ((chicken.height / 2) * (chicken.height / 2))
            );
            
            if (normalizedDistance < 1 + bullet.radius / (chicken.width / 2)) {
                // Collision detected
                bullets.splice(i, 1);
                chickens.splice(j, 1);
                score += 10;
                updateScore();
                break;
            }
        }
    }
}

// Update score display
function updateScore() {
    document.getElementById('score').textContent = score;
}

// Update lives display
function updateLives() {
    document.getElementById('lives').textContent = lives;
}

// Game over
function gameOver() {
    gameRunning = false;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 30);
    
    ctx.font = '24px Arial';
    ctx.fillText(`Final Score: ${score}`, canvas.width / 2, canvas.height / 2 + 20);
    
    ctx.font = '18px Arial';
    ctx.fillText('Reload page to play again', canvas.width / 2, canvas.height / 2 + 60);
}

// Main game loop
function gameLoop() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (gameRunning) {
        // Spawn chickens randomly
        if (Math.random() < chickenSpawnRate) {
            spawnChicken();
        }
        
        // Update game objects
        updateBullets();
        updateChickens();
        checkCollisions();
        
        // Draw game objects
        chickens.forEach(drawChicken);
        bullets.forEach(drawBullet);
        drawCannon();
    }
    
    requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();
