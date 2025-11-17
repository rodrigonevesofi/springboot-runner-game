// ======================================================
//                 GAME.JS – Versão Corrigida
// ======================================================

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// ------------------------------------------------------
//                Carregamento de assets
// ------------------------------------------------------
const selectedBg = localStorage.getItem('selected_bg') || 'city';
const selectedChar = localStorage.getItem('selected_char') || 'default';

// — Player (RUN) — 10240 x 720 = 8 frames
const playerRunSheet = new Image();
playerRunSheet.src = "img/sprite6.png";

// — Player (JUMP) — ajustei para ficar proporcional ao RUN
const playerJump = new Image();
playerJump.src = "img/player_jump.png";

// fundo
const bgCity = new Image();
bgCity.src = "img/background_city.png";

const bgNeon = new Image();
bgNeon.src = "img/background_neon.png";

// obstáculos
const obstacleImages = [new Image(), new Image()];
obstacleImages[0].src = "img/halter.png";
obstacleImages[1].src = "img/seringa.png";

// poeira
const dustSprite = new Image();
dustSprite.src = "img/dust2.png";

// sons
const sfxJump = document.getElementById("sfx-jump");
const bgm = document.getElementById("bgm");

bgm.volume = 0.25;
bgm.play().catch(() => {});

// ------------------------------------------------------
//                Player Configurado Corretamente
// ------------------------------------------------------

const RUN_FRAME_W = 1280;
const RUN_FRAME_H = 720;

// tamanho proporcional e adequado ao jogo
let player = {
    x: 220,
    width: 330,
    height: 330 * (RUN_FRAME_H / RUN_FRAME_W),

    y: 0,
    velY: 0,
    gravity: 1.5,

    jumpForce: -26,
    onGround: true,

    // animação
    frame: 0,
    frameCount: 8,
    frameInterval: 55,
    frameTimer: 0,

    sprite: "run"
};

function groundY() {
    return canvas.height - (player.height + 80);
}
player.y = groundY();

// ------------------------------------------------------
//                     Obstáculos
// ------------------------------------------------------
let obstacle = {
    x: canvas.width + 300,
    y: 0,
    width: 160,
    height: 160,
    speed: 11,
    currentImage: 0
};
obstacle.y = canvas.height - obstacle.height - 60;

// ------------------------------------------------------
//                        Poeira
// ------------------------------------------------------
let dust = {
    frame: 0,
    maxFrames: 6,
    frameTimer: 0,
    frameInterval: 60,
    w: 110,
    h: 75,
    landing: false,
    landingTimer: 0
};

// ------------------------------------------------------
//                 Score e dificuldade
// ------------------------------------------------------
let score = 0;
let best = Number(localStorage.getItem('runner_record') || 0);
let gameOver = false;
let paused = false;

const scoreEl = document.getElementById("score");
const recordEl = document.getElementById("record");
const btnPause = document.getElementById("btnPause");
const btnBack = document.getElementById("btnBack");

btnBack.addEventListener('click', () => window.location.href = 'menu.html');

btnPause.addEventListener('click', () => {
    paused = !paused;
    btnPause.innerText = paused ? "Continuar" : "Pausar";
    if (!paused) requestAnimationFrame(loop);
});

// ------------------------------------------------------
//                        Input
// ------------------------------------------------------
window.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
        if (gameOver) resetGame();
        else jump();
    }
});

function jump() {
    if (!player.onGround || paused) return;

    player.velY = player.jumpForce;
    player.onGround = false;
    player.sprite = "jump";

    if (sfxJump) {
        sfxJump.currentTime = 0;
        sfxJump.play().catch(() => {});
    }
    if (bgm && bgm.paused) bgm.play().catch(() => {});
}

// ------------------------------------------------------
//                LOOP PRINCIPAL DO JOGO
// ------------------------------------------------------
let last = performance.now();
function loop(now) {
    if (paused) return;
    const dt = (now - last) / 1000;
    last = now;

    if (!gameOver) update(dt);
    draw();

    if (!gameOver) requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

// ------------------------------------------------------
//                      UPDATE
// ------------------------------------------------------
function update(dt) {
    score += dt * 10;
    scoreEl.innerText = "Score: " + Math.floor(score);
    recordEl.innerText = "Recorde: " + best;

    // física
    player.velY += player.gravity;
    player.y += player.velY;

    if (player.y >= groundY()) {
        player.y = groundY();
        player.velY = 0;
        if (!player.onGround) dust.landing = true; // poeira do pouso
        player.onGround = true;
        player.sprite = "run";
    }

    // animação do RUN
    if (player.sprite === "run") {
        player.frameTimer += dt * 1000;
        if (player.frameTimer > player.frameInterval) {
            player.frame = (player.frame + 1) % player.frameCount;
            player.frameTimer = 0;
        }
    }

    // obstáculos
    obstacle.x -= obstacle.speed;

    if (obstacle.x < -250) {
        obstacle.x = canvas.width + Math.random() * 600;
        obstacle.currentImage = Math.random() < 0.5 ? 0 : 1;
    }

    // dificuldade progressiva
    obstacle.speed += dt * 0.5;

    // colisão
    if (checkCollision()) return endGame();

    // poeira de corrida
    if (player.onGround && !dust.landing) {
        dust.frameTimer += dt * 1000;
        if (dust.frameTimer > dust.frameInterval) {
            dust.frame = (dust.frame + 1) % dust.maxFrames;
            dust.frameTimer = 0;
        }
    }

    // poeira do pouso
    if (dust.landing) {
        dust.landingTimer += dt * 1000;
        if (dust.landingTimer > 300) {
            dust.landing = false;
            dust.landingTimer = 0;
        }
    }
}

// ------------------------------------------------------
//                         DRAW
// ------------------------------------------------------
function draw() {
    if (selectedBg === "neon")
        ctx.drawImage(bgNeon, 0, 0, canvas.width, canvas.height);
    else
        ctx.drawImage(bgCity, 0, 0, canvas.width, canvas.height);

    // poeira
    drawDust();

    // PLAYER
    if (player.sprite === "run") {
        ctx.drawImage(
            playerRunSheet,
            player.frame * RUN_FRAME_W, 0,
            RUN_FRAME_W, RUN_FRAME_H,
            player.x, player.y,
            player.width, player.height
        );
    } else {
        ctx.drawImage(playerJump, player.x, player.y, player.width, player.height);
    }

    // obstáculo
    ctx.drawImage(
        obstacleImages[obstacle.currentImage],
        obstacle.x,
        obstacle.y,
        obstacle.width,
        obstacle.height
    );

    // GAME OVER
    if (gameOver) {
        ctx.fillStyle = "rgba(0,0,0,0.6)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#fff";
        ctx.font = '48px "Press Start 2P"';
        ctx.fillText("GAME OVER", canvas.width / 2 - 200, canvas.height / 2 - 20);

        ctx.font = '20px "Press Start 2P"';
        ctx.fillText("Pressione SPACE", canvas.width / 2 - 150, canvas.height / 2 + 40);
    }
}

// ------------------------------------------------------
//                   POEIRA
// ------------------------------------------------------
function drawDust() {
    const frameW = dustSprite.width / dust.maxFrames;

    if (dust.landing) {
        ctx.drawImage(
            dustSprite,
            dust.frame * frameW, 0, frameW, dustSprite.height,
            player.x - 40,
            player.y + player.height - 30,
            dust.w, dust.h
        );
        return;
    }

    if (player.onGround) {
        ctx.drawImage(
            dustSprite,
            dust.frame * frameW, 0, frameW, dustSprite.height,
            player.x - 50,
            player.y + player.height - 50,
            dust.w, dust.h
        );
    }
}

// ------------------------------------------------------
//                COLISÃO MELHORADA
// ------------------------------------------------------
function getPlayerHitbox() {
    if (player.sprite === "jump") {
        return {
            x: player.x + 45,
            y: player.y + 40,
            w: player.width - 90,
            h: player.height - 70
        };
    }
    return {
        x: player.x + 35,
        y: player.y + 50,
        w: player.width - 70,
        h: player.height - 55
    };
}

function checkCollision() {
    const p = getPlayerHitbox();
    const o = {
        x: obstacle.x + 20,
        y: obstacle.y + 25,
        w: obstacle.width - 40,
        h: obstacle.height - 50
    };

    return (
        p.x < o.x + o.w &&
        p.x + p.w > o.x &&
        p.y < o.y + o.h &&
        p.y + p.h > o.y
    );
}

// ------------------------------------------------------
//                GAME OVER / RESET
// ------------------------------------------------------
function endGame() {
    gameOver = true;

    if (score > best) {
        best = Math.floor(score);
        localStorage.setItem("runner_record", best);
    }
}

function resetGame() {
    gameOver = false;
    score = 0;

    obstacle.speed = 11;
    obstacle.x = canvas.width + 300;

    player.y = groundY();
    player.velY = 0;

    requestAnimationFrame(loop);
}

canvas.addEventListener("click", () => canvas.focus());
