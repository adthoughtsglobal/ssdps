let lastAvgY = 0;
function monitorSpeed() {
    if (!snow.length) return;
    let sum = 0;
    for (let i of snow) {
        let v = fallFunc(i);
        sum += v.x;
    }
    let avg = sum / snow.length;
    if (avg !== lastAvgY) console.log(`Avg x velocity: ${avg.toFixed(3)}`);
    lastAvgY = avg;
    setTimeout(monitorSpeed, 1000);
}


window.currentMode = "winter";
let modeChange, imageSize = 10, particleLimit = 150, currentWin = "home", snow = [], c, x, w, h, img, aspect = 1, anim;

function resize() {
    w = innerWidth;
    h = innerHeight;
    c.width = w;
    c.height = h;
}

function init(n = particleLimit) {
    snow = [];
    for (let i = 0; i < n; i++) {
        snow.push({
            x: Math.random() * w,
            y: Math.random() * h,
            r: imageSize * (0.5 + Math.random()),
            d: Math.random() * 1 + 0.5
        });
    }
}

function draw() {
    x.clearRect(0, 0, w, h);
    for (let i of snow) {
        x.drawImage(img, i.x, i.y, i.r, i.r * aspect);
    }
}

function update() {
    for (let i of snow) {
        let v = fallFunc(i);
        i.x += v.x;
        i.y += v.y;
        if (i.y > h) i.y = -10, i.x = Math.random() * w;
        if (i.x < -50) i.x = w + 50;
        if (i.x > w + 50) i.x = -50;
    }
}

function loop() {
    draw();
    update();
    anim = requestAnimationFrame(loop);
}

function resetAnimation(mode) {
    cancelAnimationFrame(anim);
    snow = [];
    setGradient(mode);
    init(particleLimit);
    loop();
}

modeChange = function () {
    currentMode = document.getElementById("modedisp").innerHTML;
    img.src = `particles/${currentMode}.png`;
    img.onload = () => {
        aspect = img.height / img.width;
        resetAnimation(currentMode);
    }
}

let fallFunc = i => ({ x: 0, y: 1 });

document.addEventListener('DOMContentLoaded', () => {
    c = document.getElementById("c");
    x = c.getContext("2d");
    img = new Image();
    img.src = `particles/${currentMode}.png`;
    img.onload = () => {
        aspect = img.height / img.width;
        resize();
        init();
        loop();
        monitorSpeed();
    }
    window.onresize = () => { resize(); init(); }
    showwindow('home');
});

const container = document.querySelector('.selectorcont');
const items = document.querySelectorAll('.sing_mode');
let debounceTimer;
function updateCenterClass() {
    const containerRect = container.getBoundingClientRect();
    let closest = null, closestDistance = Infinity;
    items.forEach(item => {
        const rect = item.getBoundingClientRect();
        const itemCenter = rect.left + rect.width / 2;
        const containerCenter = containerRect.left + containerRect.width / 2;
        const distance = Math.abs(containerCenter - itemCenter);
        if (distance < closestDistance) { closestDistance = distance; closest = item; }
    });
    items.forEach(i => i.classList.remove('center'));
    if (closest) {
        closest.classList.add('center');
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            let x = closest.getAttribute("data-mode");
            document.getElementById("modedisp").innerHTML = x;
            currentMode = x;
            modeChange();
        }, 100);
    }
}
container.addEventListener('scroll', updateCenterClass);
window.addEventListener('resize', updateCenterClass);
updateCenterClass();
function setGradient(mode) {
    if (currentWin != "home") return;
    switch (mode) {
        case "winter":
            document.body.style.backgroundImage = `linear-gradient(180deg, rgb(15 22 44), rgb(16, 163, 255))`;
            imageSize = 10; particleLimit = 150;
            fallFunc = i => ({ x: 0, y: 0.8 });
            break;
        case "summer":
            document.body.style.backgroundImage = `linear-gradient(132deg,#ff8e3d, #fff174)`;
            imageSize = 60; particleLimit = 20;
            fallFunc = i => ({ x: 0.1, y: 0 });
            break;
        case "autumn":
            document.body.style.backgroundImage = `linear-gradient(132deg, #4b1700, #9d6e00)`;
            imageSize = 40; particleLimit = 15;
            fallFunc = i => ({ x: Math.sin(i.y * 0.01 + Date.now() / 700) * 0.8, y: 0.5 });
            break;
        case "rainy":
            document.body.style.backgroundImage = `linear-gradient(132deg, rgb(51 51 51), rgb(56 98 124))`;
            imageSize = 20; particleLimit = 200;
            fallFunc = i => ({ x: 0, y: 30 });
            break;
    }
}
function showwindow(name) {
    currentWin = name;
    const c = document.getElementById("c");
    const windows = document.querySelectorAll('.window');
    windows.forEach(win => win.style.display = win.id === name ? 'flex' : 'none');
    if (name == "home") { c.style.display = "block"; setGradient(currentMode); }
    else { c.style.display = "none"; document.body.style.backgroundImage = `linear-gradient(#111113, rgb(31 31 31))`; }
}

function resetAnimation(mode) {
    cancelAnimationFrame(anim);
    snow = [];
    setGradient(mode); 
    init(particleLimit);
    loop();
}
