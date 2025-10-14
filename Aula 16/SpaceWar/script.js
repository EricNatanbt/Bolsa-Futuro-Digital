// ============================================
// CONFIGURAÇÕES DE TAMANHO (MODIFICÁVEIS)
// ============================================
const SCALE_CONFIG = {
  // Multiplicador global (1.0 = tamanho padrão, 2.0 = dobro do tamanho)
  global: 1.0,
  
  // Tamanhos individuais (podem ser ajustados independentemente)
  player: {
    width: 64,
    height: 64,
    scale: 1.0  // Multiplicador adicional apenas para o jogador
  },
  
  enemies: {
    basic: {
      width: 45,
      height: 45,
      scale: 1.0
    },
    fast: {
      width: 45,
      height: 45,
      scale: 1.0
    },
    tank: {
      width: 45,
      height: 45,
      scale: 1.0
    }
  },
  
  bullets: {
    player: {
      width: 15,
      height: 20,
      scale: 1.0
    },
    enemy: {
      width: 15,
      height: 20,
      scale: 1.0
    }
  },
  
  powerups: {
    width: 24,
    height: 24,
    scale: 1.0
  }
};

// Função auxiliar para calcular tamanho final
function getSize(baseWidth, baseHeight, localScale = 1.0) {
  return {
    w: baseWidth * localScale * SCALE_CONFIG.global,
    h: baseHeight * localScale * SCALE_CONFIG.global
  };
}

// ============================================
// Carregamento de Imagens
// ============================================
const playerImg = new Image();
playerImg.src = 'images/player.png';

const enemyBasicImg = new Image();
enemyBasicImg.src = 'images/enemy_basic.png';

const enemyFastImg = new Image();
enemyFastImg.src = 'images/enemy_fast.png';

const enemyTankImg = new Image();
enemyTankImg.src = 'images/enemy_tank.png';

const bulletPlayerImg = new Image();
bulletPlayerImg.src = 'images/bullet_player.png';

const bulletEnemyImg = new Image();
bulletEnemyImg.src = 'images/bullet_enemy.png';

const powerupRapidFireImg = new Image();
powerupRapidFireImg.src = 'images/powerup_rapidfire.png';

const powerupShieldImg = new Image();
powerupShieldImg.src = 'images/powerup_shield.png';

const powerupLifeImg = new Image();
powerupLifeImg.src = 'images/powerup_life.png';

const canvas = document.getElementById("game");
const ctx = canvas.getContext('2d');

const W = canvas.width;
const H = canvas.height;

// Estados do jogo
const GameState = {
  START: 'start',
  PLAYING: 'playing',
  PAUSED: 'paused',
  GAMEOVER: 'gameover'
};

let gameState = GameState.START;

// Jogador
const playerSize = getSize(
  SCALE_CONFIG.player.width,
  SCALE_CONFIG.player.height,
  SCALE_CONFIG.player.scale
);

const player = {
  x: W / 2,
  y: H - 60,
  w: playerSize.w,
  h: playerSize.h,
  speed: 7,
  bullets: [],
  fireRate: 100, 
  lastShot: 0,
  shield: false,
  shieldTimer: 0,
  rapidFire: false,
  rapidFireTimer: 0
};

// Inimigos e tiros
let enemies = [];
let enemyBullets = [];
let powerups = [];
let particles = [];
let stars = []; 
let score = 0;
let lives = 3;
let lastTime = 0;
let spawnTimer = 0;
let spawnInterval = 1200;
let difficulty = 1.5;

// Tipos de inimigos
const basicSize = getSize(
  SCALE_CONFIG.enemies.basic.width,
  SCALE_CONFIG.enemies.basic.height,
  SCALE_CONFIG.enemies.basic.scale
);

const fastSize = getSize(
  SCALE_CONFIG.enemies.fast.width,
  SCALE_CONFIG.enemies.fast.height,
  SCALE_CONFIG.enemies.fast.scale
);

const tankSize = getSize(
  SCALE_CONFIG.enemies.tank.width,
  SCALE_CONFIG.enemies.tank.height,
  SCALE_CONFIG.enemies.tank.scale
);

const EnemyTypes = {
  BASIC: { 
    color: '#66ff6b', 
    hp: 1, 
    speed: 2, 
    score: 10, 
    shootInterval: 1000, 
    img: enemyBasicImg, 
    w: basicSize.w, 
    h: basicSize.h 
  },
  FAST: { 
    color: '#ffaa00', 
    hp: 1, 
    speed: 3, 
    score: 15, 
    shootInterval: 800, 
    img: enemyFastImg, 
    w: fastSize.w, 
    h: fastSize.h 
  },
  TANK: { 
    color: '#ff6b6b', 
    hp: 3,  
    speed: 1.5, 
    score: 25, 
    shootInterval: 1500, 
    img: enemyTankImg, 
    w: tankSize.w, 
    h: tankSize.h 
  }
};

// Tipos de power-ups
const powerupSize = getSize(
  SCALE_CONFIG.powerups.width,
  SCALE_CONFIG.powerups.height,
  SCALE_CONFIG.powerups.scale
);

const PowerUpTypes = {
  RAPID_FIRE: { 
    duration: 5000, 
    symbol: 'R', 
    img: powerupRapidFireImg, 
    w: powerupSize.w, 
    h: powerupSize.h 
  },
  SHIELD: { 
    duration: 8000, 
    symbol: 'S', 
    img: powerupShieldImg, 
    w: powerupSize.w, 
    h: powerupSize.h 
  },
  EXTRA_LIFE: { 
    duration: 0, 
    symbol: '+', 
    img: powerupLifeImg, 
    w: powerupSize.w, 
    h: powerupSize.h 
  }
};

// Elementos UI
const scoreEl = document.getElementById('score');
const livesEl = document.getElementById('lives');
const shieldIndicator = document.getElementById('shield-indicator');
const startScreen = document.getElementById('start-screen');
const gameoverScreen = document.getElementById('gameover-screen');
const finalScoreValue = document.getElementById('final-score-value');

// Áudio (Web Audio API - sons sintéticos)
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

function playSound(frequency, duration, type = 'sine') {
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.frequency.value = frequency;
  oscillator.type = type;
  
  gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + duration);
}

function shootSound() {
  playSound(800, 0.1, 'square');
}

function explosionSound() {
  playSound(100, 0.3, 'sawtooth');
}

function powerupSound() {
  playSound(1200, 0.2, 'sine');
}

function hitSound() {
  playSound(200, 0.2, 'triangle');
}

// Inicializar estrelas para fundo paralaxe
function initStars() {
  stars = [];
  for (let i = 0; i < 100; i++) {
    stars.push({
      x: Math.random() * W,
      y: Math.random() * H,
      size: Math.random() * 2,
      speed: Math.random() * 2 + 0.5,
      brightness: Math.random() * 0.5 + 0.5
    });
  }
}

function updateStars(dt) {
  stars.forEach(star => {
    star.y += star.speed * dt / 16;
    if (star.y > H) {
      star.y = 0;
      star.x = Math.random() * W;
    }
  });
}

function drawStars() {
  stars.forEach(star => {
    ctx.fillStyle = `rgba(255, 255, 255, ${star.brightness})`;
    ctx.fillRect(star.x, star.y, star.size, star.size);
  });
}

function resetGame() {
  player.x = W / 2;
  player.y = H - 60;
  player.bullets = [];
  player.shield = false;
  player.shieldTimer = 0;
  player.rapidFire = false;
  player.rapidFireTimer = 0;
  enemies = [];
  enemyBullets = [];
  powerups = [];
  particles = [];
  score = 0;
  lives = 3;
  scoreEl.innerText = score;
  livesEl.innerText = lives;
  shieldIndicator.className = 'shield-off';
  spawnTimer = 0;
  initStars();
}

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function rectsCollide(a, b) {
  return !(a.x + a.w < b.x || a.x > b.x + b.w || a.y + a.h < b.y || a.y > b.y + b.h);
}

// Desenho da nave do jogador (melhorado)
function drawPlayer() {
  ctx.save();
  // Desenha o sprite da nave do jogador
  ctx.drawImage(playerImg, player.x - player.w / 2, player.y - player.h / 2, player.w, player.h);

  // Escudo visual
  if (player.shield) {
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.5)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.w / 1.5, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();
}

// Tiro do jogador
function playerShoot() {
  const now = Date.now();
  const fireRate = player.rapidFire ? player.fireRate / 2 : player.fireRate;
  
  if (now - player.lastShot < fireRate) return;
  
  player.lastShot = now;
  
  const bulletSize = getSize(
    SCALE_CONFIG.bullets.player.width,
    SCALE_CONFIG.bullets.player.height,
    SCALE_CONFIG.bullets.player.scale
  );
  
  if (player.rapidFire) {
    // Tiro triplo
    player.bullets.push({ 
      x: player.x - bulletSize.w / 2, 
      y: player.y - player.h, 
      w: bulletSize.w, 
      h: bulletSize.h, 
      speed: 10 
    });
    player.bullets.push({ 
      x: player.x - bulletSize.w / 2 - 10, 
      y: player.y - player.h, 
      w: bulletSize.w, 
      h: bulletSize.h, 
      speed: 10 
    });
    player.bullets.push({ 
      x: player.x - bulletSize.w / 2 + 10, 
      y: player.y - player.h, 
      w: bulletSize.w, 
      h: bulletSize.h, 
      speed: 10 
    });
  } else {
    player.bullets.push({ 
      x: player.x - bulletSize.w / 2, 
      y: player.y - player.h, 
      w: bulletSize.w, 
      h: bulletSize.h, 
      speed: 8 
    });
  }
  
  shootSound();
}

// Spawn de inimigos (com tipos variados)
function spawnEnemy() {
  const types = Object.values(EnemyTypes);
  const type = types[Math.floor(Math.random() * types.length)];
  
  const w = type.w;
  const h = type.h;
  
  const enemy = {
    x: rand(w, W - w),
    y: -h,
    w,
    h,
    speed: type.speed * difficulty,
    hp: type.hp,
    maxHp: type.hp,
    color: type.color,
    score: type.score,
    shootTimer: 0,
    shootInterval: type.shootInterval,
    movePattern: Math.random() > 0.7 ? 'zigzag' : 'straight',
    zigzagTimer: 0,
    type: type
  };
  enemies.push(enemy);
}

// Spawn de power-up
function spawnPowerUp(x, y) {
  if (Math.random() > 0.3) return; // 30% de chance
  
  const types = Object.values(PowerUpTypes);
  const type = types[Math.floor(Math.random() * types.length)];
  
  powerups.push({
    x: x - type.w / 2,
    y: y,
    w: type.w,
    h: type.h,
    speed: 2,
    type: type,
    symbol: type.symbol
  });
}

// Atualização de inimigos
function updateEnemies(dt) {
  for (let i = enemies.length - 1; i >= 0; i--) {
    const e = enemies[i];
    
    // Movimento
    if (e.movePattern === 'zigzag') {
      e.zigzagTimer += dt;
      e.x += Math.sin(e.zigzagTimer / 200) * 2;
    }
    e.y += e.speed * dt / 16;
    
    // Tiro
    e.shootTimer += dt;
    if (e.shootTimer > e.shootInterval) {
      e.shootTimer = 0;
      
      const enemyBulletSize = getSize(
        SCALE_CONFIG.bullets.enemy.width,
        SCALE_CONFIG.bullets.enemy.height,
        SCALE_CONFIG.bullets.enemy.scale
      );
      
      enemyBullets.push({
        x: e.x + e.w / 2 - enemyBulletSize.w / 2,
        y: e.y + e.h,
        w: enemyBulletSize.w,
        h: enemyBulletSize.h,
        speed: 4 + difficulty
      });
    }
    
    // Fora da tela
    if (e.y > H + 50) {
      enemies.splice(i, 1);
    }
  }
}

// Atualização de balas do jogador
function updatePlayerBullets() {
  for (let i = player.bullets.length - 1; i >= 0; i--) {
    const b = player.bullets[i];
    b.y -= b.speed;
    
    // Colisão com inimigos
    for (let j = enemies.length - 1; j >= 0; j--) {
      const e = enemies[j];
      if (rectsCollide({ x: b.x, y: b.y, w: b.w, h: b.h }, e)) {
        e.hp--;
        player.bullets.splice(i, 1);
        
        if (e.hp <= 0) {
          enemies.splice(j, 1);
          spawnExplosion(e.x + e.w / 2, e.y + e.h / 2, e.color);
          spawnPowerUp(e.x + e.w / 2, e.y + e.h / 2);
          score += e.score;
          scoreEl.innerText = score;
          explosionSound();
        }
        break;
      }
    }
    
    if (b && b.y < -20) player.bullets.splice(i, 1);
  }
}

// Atualização de balas inimigas
function updateEnemyBullets() {
  for (let i = enemyBullets.length - 1; i >= 0; i--) {
    const b = enemyBullets[i];
    b.y += b.speed;
    
    const playerBounds = {
      x: player.x - player.w / 2,
      y: player.y - player.h,
      w: player.w,
      h: player.h * 2
    };
    
    if (rectsCollide({ x: b.x, y: b.y, w: b.w, h: b.h }, playerBounds)) {
      enemyBullets.splice(i, 1);
      if (!player.shield) {
        hitPlayer();
      }
      continue;
    }
    
    if (b.y > H + 20) enemyBullets.splice(i, 1);
  }
}

// Atualização de power-ups
function updatePowerUps() {
  for (let i = powerups.length - 1; i >= 0; i--) {
    const p = powerups[i];
    p.y += p.speed;
    
    const playerBounds = {
      x: player.x - player.w / 2,
      y: player.y - player.h,
      w: player.w,
      h: player.h * 2
    };
    
    if (rectsCollide(p, playerBounds)) {
      powerups.splice(i, 1);
      applyPowerUp(p.type);
      powerupSound();
      continue;
    }
    
    if (p.y > H + 20) powerups.splice(i, 1);
  }
}

// Aplicar power-up
function applyPowerUp(type) {
  if (type.symbol === 'R') {
    player.rapidFire = true;
    player.rapidFireTimer = type.duration;
  } else if (type.symbol === 'S') {
    player.shield = true;
    player.shieldTimer = type.duration;
    shieldIndicator.className = 'shield-on';
  } else if (type.symbol === '+') {
    lives++;
    livesEl.innerText = lives;
  }
}

// Atualizar timers de power-ups
function updatePowerUpTimers(dt) {
  if (player.rapidFire) {
    player.rapidFireTimer -= dt;
    if (player.rapidFireTimer <= 0) {
      player.rapidFire = false;
    }
  }
  
  if (player.shield) {
    player.shieldTimer -= dt;
    if (player.shieldTimer <= 0) {
      player.shield = false;
      shieldIndicator.className = 'shield-off';
    }
  }
}

// Explosão melhorada
function spawnExplosion(x, y, color = '#ff6b6b') {
  for (let i = 0; i < 20; i++) {
    particles.push({
      x,
      y,
      vx: rand(-3, 3),
      vy: rand(-3, 3),
      life: rand(400, 800),
      maxLife: 800,
      color: color,
      size: rand(2, 4)
    });
  }
}

function updateParticles(dt) {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx * dt / 16;
    p.y += p.vy * dt / 16;
    p.life -= dt;
    if (p.life <= 0) particles.splice(i, 1);
  }
}

// Jogador perde vida
function hitPlayer() {
  lives--;
  livesEl.innerText = lives;
  spawnExplosion(player.x, player.y, '#4fe0ff');
  hitSound();
  
  if (lives <= 0) {
    gameState = GameState.GAMEOVER;
    finalScoreValue.innerText = score;
    gameoverScreen.classList.remove('hidden');
  }
}

// Atualização principal
function update(dt) {
  if (gameState !== GameState.PLAYING) return;
  
  updateStars(dt);
  
  // Spawn de inimigos
  spawnTimer += dt;
  if (spawnTimer > spawnInterval / difficulty) {
    spawnTimer = 0;
    spawnEnemy();
  }
  
  updateEnemies(dt);
  updatePlayerBullets();
  updateEnemyBullets();
  updatePowerUps();
  updateParticles(dt);
  updatePowerUpTimers(dt);
}

// Desenho principal
function draw() {
  // Fundo
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, W, H);
  
  // Estrelas
  drawStars();
  
  // Jogador
  drawPlayer();
  
  // Inimigos
  enemies.forEach(e => {
    let enemyImage;
    if (e.type === EnemyTypes.BASIC) {
      enemyImage = enemyBasicImg;
    } else if (e.type === EnemyTypes.FAST) {
      enemyImage = enemyFastImg;
    } else if (e.type === EnemyTypes.TANK) {
      enemyImage = enemyTankImg;
    }
    ctx.drawImage(enemyImage, e.x, e.y, e.w, e.h);
    
    // Barra de HP
    if (e.hp < e.maxHp) {
      const hpPercent = e.hp / e.maxHp;
      ctx.fillStyle = '#222';
      ctx.fillRect(e.x, e.y - 6, e.w, 3);
      ctx.fillStyle = '#00ff00';
      ctx.fillRect(e.x, e.y - 6, e.w * hpPercent, 3);
    }
  });
  
  // Balas do jogador
  player.bullets.forEach(b => ctx.drawImage(bulletPlayerImg, b.x, b.y, b.w, b.h));
  
  // Balas inimigas
  enemyBullets.forEach(b => ctx.drawImage(bulletEnemyImg, b.x, b.y, b.w, b.h));
  
  // Power-ups
  powerups.forEach(p => {
    let powerupImage;
    if (p.type.symbol === 'R') {
      powerupImage = powerupRapidFireImg;
    } else if (p.type.symbol === 'S') {
      powerupImage = powerupShieldImg;
    } else if (p.type.symbol === '+') {
      powerupImage = powerupLifeImg;
    }
    ctx.drawImage(powerupImage, p.x, p.y, p.w, p.h);
  });
  
  // Partículas
  particles.forEach(p => {
    const alpha = Math.max(0, p.life / p.maxLife);
    ctx.fillStyle = p.color.replace(')', `, ${alpha})`).replace('rgb', 'rgba');
    ctx.fillRect(p.x, p.y, p.size, p.size);
  });
}

// Game loop
function loop(ts) {
  if (!lastTime) lastTime = ts;
  const dt = ts - lastTime;
  lastTime = ts;
  
  update(dt);
  draw();
  
  requestAnimationFrame(loop);
}

// Entrada do jogador
const keys = {};

document.addEventListener('keydown', e => {
  keys[e.key] = true;
  
  if (e.key === ' ' || e.key === 'Spacebar') {
    e.preventDefault();
    
    // Barra de espaço agora pausa/inicia o jogo
    if (gameState === GameState.PLAYING) {
      gameState = GameState.PAUSED;
    } else if (gameState === GameState.PAUSED) {
      gameState = GameState.PLAYING;
      lastTime = 0;
    }
  }
});

document.addEventListener('keyup', e => {
  keys[e.key] = false;
});

// Botão esquerdo do mouse para atirar
document.addEventListener('mousedown', e => {
  if (e.button === 0 && gameState === GameState.PLAYING) {
    playerShoot();
  }
});

// Movimento contínuo (incluindo vertical)
function handleInput(dt) {
  if (gameState !== GameState.PLAYING) return;
  
  // Movimento horizontal
  if (keys['ArrowLeft'] || keys['a'] || keys['A']) {
    player.x -= player.speed * dt / 16;
  }
  if (keys['ArrowRight'] || keys['d'] || keys['D']) {
    player.x += player.speed * dt / 16;
  }
  
  // Movimento vertical
  if (keys['ArrowUp'] || keys['w'] || keys['W']) {
    player.y -= player.speed * dt / 16;
  }
  if (keys['ArrowDown'] || keys['s'] || keys['S']) {
    player.y += player.speed * dt / 16;
  }
  
  // Limites da tela (horizontal e vertical)
  player.x = Math.max(player.w / 2, Math.min(W - player.w / 2, player.x));
  player.y = Math.max(player.h, Math.min(H - player.h / 2, player.y));
}

const originalUpdate = update;
update = function(dt) {
  handleInput(dt);
  originalUpdate(dt);
};

// Botões UI
document.getElementById('start-game').addEventListener('click', () => {
  difficulty = parseFloat(document.getElementById('difficulty-select').value);
  document.getElementById('difficulty').value = difficulty;
  startScreen.classList.add('hidden');
  gameState = GameState.PLAYING;
  resetGame();
});

document.getElementById('pause').addEventListener('click', () => {
  if (gameState === GameState.PLAYING) {
    gameState = GameState.PAUSED;
  } else if (gameState === GameState.PAUSED) {
    gameState = GameState.PLAYING;
    lastTime = 0;
  }
});

startScreen.addEventListener("click", () => {
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
  gameState = GameState.PLAYING;
  startScreen.classList.add("hidden");
  resetGame();
  gameLoop(0);
});

document.getElementById('restart-game').addEventListener('click', () => {
  gameoverScreen.classList.add('hidden');
  startScreen.classList.remove('hidden');
  gameState = GameState.START;
  resetGame();
});

document.getElementById('difficulty').addEventListener('change', (e) => {
  difficulty = parseFloat(e.target.value);
});

// Inicialização
initStars();
requestAnimationFrame(loop);
