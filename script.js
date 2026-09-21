let petalsInterval2D;
let isMusicPlaying = false;

document.addEventListener("DOMContentLoaded", () => {
    petalsInterval2D = setInterval(createPetal2D, 500); 
});

function toggleMusic() {
    const bgMusic = document.getElementById("bg-music");
    const musicBtn = document.getElementById("music-toggle");
    
    if (isMusicPlaying) {
        bgMusic.pause();
        musicBtn.innerText = "🔇";
    } else {
        bgMusic.play().catch(e => console.log("Clic requerido"));
        musicBtn.innerText = "🔊";
    }
    isMusicPlaying = !isMusicPlaying;
}

function startExperience() {
    let bgMusic = document.getElementById("bg-music");
    if (!isMusicPlaying) {
        bgMusic.volume = 0.7;
        bgMusic.play().then(() => {
            isMusicPlaying = true;
            document.getElementById("music-toggle").innerText = "🔊";
        }).catch(e => console.log("Clic requerido para audio"));
    }
    nextScreen(2);
}

function nextScreen(screenNumber) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    let screen = document.getElementById('screen-' + screenNumber);
    if(screen) screen.classList.add('active');
}

function startFinale() {
    document.body.classList.add("dark-mode");
    clearInterval(petalsInterval2D);
    setTimeout(() => { document.getElementById("petals-container").innerHTML = ""; }, 2000);
    
    nextScreen(7);
    initStarsCanvas();
    
    setTimeout(() => {
        buildBouquet(); 
        createFireflies();
    }, 1200);
}

function openLetter() { document.getElementById("letter-modal").classList.add("show"); }
function closeLetter() { document.getElementById("letter-modal").classList.remove("show"); }

function initStarsCanvas() {
    const canvas = document.getElementById('stars-canvas');
    const ctx = canvas.getContext('2d');
    canvas.style.opacity = "1";

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const maxStars = width < 768 ? 40 : 80; 
    const stars = [];

    for (let i = 0; i < maxStars; i++) {
        stars.push({ x: Math.random() * width, y: Math.random() * height, r: Math.random() * 1.5, a: Math.random(), s: (Math.random() * 0.02) + 0.01 });
    }

    function draw() {
        ctx.clearRect(0, 0, width, height);
        stars.forEach(star => {
            star.a += star.s;
            if (star.a > 1 || star.a < 0.1) star.s *= -1;
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${star.a})`;
            ctx.fill();
        });
        requestAnimationFrame(draw);
    }
    draw();
}

function buildBouquet() {
    const world = document.getElementById('world-3d');
    
    // Altura base para que el ramo quede centrado
    let baseStemH = window.innerHeight * 0.45; 
    
    // Escala equilibrada, ni muy pequeñas ni deformes
    let bS = window.innerWidth < 768 ? 1.1 : 1.3; 

    // CREAMOS 5 FLORES PARA DAR FORMA AL RAMO
    // (parent, angleZ, angleX, stemH, scale, delayStr)
    
    // 1. Flor Central (La más alta)
    createBouquetFlower(world, 0, 10, baseStemH * 1.05, bS * 1.1, 0); 
    
    // 2. Flores Medias (A los lados de la central)
    createBouquetFlower(world, -22, 12, baseStemH * 0.95, bS, 0.3);
    createBouquetFlower(world, 22, 12, baseStemH * 0.95, bS, 0.6);
    
    // 3. Flores Bajas (Más a los lados y un poco más bajitas para rellenar)
    createBouquetFlower(world, -45, 15, baseStemH * 0.8, bS * 0.9, 0.9);
    createBouquetFlower(world, 45, 15, baseStemH * 0.8, bS * 0.9, 1.2);
    
    setTimeout(() => { document.getElementById('ribbon').classList.add('show'); }, 3000);
}

function createBouquetFlower(parent, angleZ, angleX, stemH, scale, delayStr) {
    const wrapper = document.createElement('div');
    wrapper.className = 'bouquet-flower';
    wrapper.style.transform = `translateX(-50%) rotateZ(${angleZ}deg) rotateX(${angleX}deg)`;

    const stem = document.createElement('div');
    stem.className = 'stem';
    stem.style.height = `${stemH}px`;
    stem.style.animationDelay = `${delayStr}s`;
    stem.classList.add('grow');

    for(let i=0; i<2; i++) { 
        const leaf = document.createElement('div');
        leaf.className = 'leaf';
        leaf.style.bottom = `${stemH * (0.3 + i*0.4)}px`;
        const rY = i % 2 === 0 ? 0 : 180;
        const rZ = 30 + Math.random()*20; 
        leaf.style.setProperty('--start-rot', `rotateY(${rY}deg) rotateZ(${rZ}deg)`);
        leaf.style.animationDelay = `${delayStr + 0.5 + i*0.2}s`;
        leaf.classList.add('grow');
        stem.appendChild(leaf);
    }

    const head = document.createElement('div');
    head.className = 'flower-head';
    head.style.top = `-${stemH}px`; 
    head.style.setProperty('--flower-scale', scale);
    head.style.animationDelay = `${delayStr + 0.8}s`;
    head.classList.add('bloom');

    const spinner = document.createElement('div');
    spinner.className = 'flower-head-spin';

    const center = document.createElement('div');
    center.className = 'flower-center';
    spinner.appendChild(center);

    // 20 pétalos para que la flor se vea abundante y redondita
    const petalsCount = 20; 
    for (let p = 0; p < petalsCount; p++) {
        const petal = document.createElement('div');
        petal.className = 'petal-3d';
        
        const rotZ = (360 / petalsCount) * p; 
        // Doble capa para darle profundidad
        const rotX = (p % 2 === 0) ? 10 : 20; 

        petal.style.setProperty('--rz', `${rotZ}deg`);
        petal.style.setProperty('--rx', `${rotX}deg`);

        petal.style.animationDelay = `${delayStr + 1 + (p * 0.04)}s`;
        petal.classList.add('bloom');

        spinner.appendChild(petal);
    }

    head.appendChild(spinner);
    wrapper.appendChild(stem);
    wrapper.appendChild(head);
    parent.appendChild(wrapper);
}

function createFireflies() {
    const world = document.getElementById('world-3d');
    const maxFireflies = window.innerWidth < 768 ? 5 : 10; 
    
    for(let i=0; i < maxFireflies; i++) { 
        const firefly = document.createElement('div');
        firefly.className = 'firefly-3d';
        
        firefly.style.setProperty('--startX', `${(Math.random()-0.5)*200}px`);
        firefly.style.setProperty('--startY', `-${Math.random()*300 + 100}px`);
        firefly.style.setProperty('--startZ', `${(Math.random()-0.5)*200}px`);
        
        firefly.style.setProperty('--midX', `${(Math.random()-0.5)*400}px`);
        firefly.style.setProperty('--midY', `-${Math.random()*400 + 50}px`);
        firefly.style.setProperty('--midZ', `${(Math.random()-0.5)*400}px`);

        firefly.style.setProperty('--endX', `${(Math.random()-0.5)*200}px`);
        firefly.style.setProperty('--endY', `-${Math.random()*600 + 100}px`);
        firefly.style.setProperty('--endZ', `${(Math.random()-0.5)*200}px`);
        
        firefly.style.left = `50%`;
        firefly.style.animationDelay = `${Math.random() * 3}s`;
        world.appendChild(firefly);
    }
}

function createPetal2D() {
    const container = document.getElementById('petals-container');
    if(!container || container.childElementCount > 15) return;

    const petal = document.createElement('div');
    petal.classList.add('petal-2d');
    
    let size = Math.random() * 10 + 12;
    petal.style.width = `${size}px`; 
    petal.style.height = `${size}px`;
    petal.style.left = `${Math.random() * 100}vw`;
    
    let sway = (Math.random() - 0.5) * 200; 
    petal.style.setProperty('--swayX', `${sway}px`);
    
    let duration = Math.random() * 3 + 6; 
    petal.style.animationDuration = `${duration}s`;
    
    container.appendChild(petal);
    setTimeout(() => { if (petal.parentNode) petal.remove(); }, duration * 1000);
}