var currentMode = "winter", modeChange, speed = 0.3, imageSize = 10, particleLimit = 150;
document.addEventListener('DOMContentLoaded', () => {
    const c = document.getElementById("c"), x = c.getContext("2d");
    let w, h, snow = [], img = new Image(), aspect = 1;
    img.src = `particles/${currentMode}.png`;
    function resize() { w = innerWidth; h = innerHeight; c.width = w; c.height = h }
    function init(n = particleLimit) { snow = []; for (let i = 0; i < n; i++) snow.push({ x: Math.random() * w, y: Math.random() * h, r: imageSize * (0.5 + Math.random()), d: Math.random() * 1 + 0.5 }) }
    function draw() { x.clearRect(0, 0, w, h); for (let i of snow) x.drawImage(img, i.x, i.y, i.r, i.r * aspect) }
    function update() { for (let i of snow) { let v = fallFunc(i); i.x += v.x; i.y += v.y; if (i.y > h) { i.y = -10; i.x = Math.random() * w } if (i.x < -50) i.x = w + 50; if (i.x > w + 50) i.x = -50 } }
    function loop() { draw(); update(); requestAnimationFrame(loop) }
    modeChange = function () { img.src = `particles/${currentMode}.png`; setGradient(currentMode); setBtn(currentMode)}
    window.onresize = () => { resize(); init() }
    img.onload = () => { aspect = img.height / img.width; resize(); init(); loop() }
});
let fallFunc = i => ({ x: 0, y: 1 });

const container = document.querySelector('.selectorcont');
const items = document.querySelectorAll('.sing_mode');

let debounceTimer;
function updateCenterClass() {
    const containerRect = container.getBoundingClientRect();
    let closest = null;
    let closestDistance = Infinity;
    items.forEach(item => {
        const rect = item.getBoundingClientRect();
        const itemCenter = rect.left + rect.width / 2;
        const containerCenter = containerRect.left + containerRect.width / 2;
        const distance = Math.abs(containerCenter - itemCenter);
        if (distance < closestDistance) {
            closestDistance = distance;
            closest = item;
        }
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
    switch (mode) {
        case "winter":
            document.body.style.backgroundImage = `linear-gradient(180deg, rgb(15 22 44), rgb(16, 163, 255))`;
            speed = .8;
            imageSize = 10;
            particleLimit = 150;
            fallFunc = i => ({
                x: 0,
                y:speed
            });
            break;
        case "summer":
            document.body.style.backgroundImage = `linear-gradient(132deg,#ff8e3d, #fff174)`;
            speed = 0;
            particleLimit = 20;
            imageSize = 60;
            fallFunc = i => ({
                x: 1,
                y: speed
            });
            break;
        case "autumn":
            document.body.style.backgroundImage = `linear-gradient(132deg, #4b1700, #9d6e00)`;
            speed = .1;
            imageSize = 40;
            particleLimit = 15;
            fallFunc = i => ({
                x: Math.sin(i.y * 0.01 + Date.now() / 700) * 0.08,
                y: speed
            });
            break;
        case "rainy":
            document.body.style.backgroundImage = `linear-gradient(132deg, rgb(51 51 51), rgb(56 98 124))`;
            imageSize = 20;
            speed = 10;
            particleLimit = 200;
            
            fallFunc = i => ({
                x: -1,
                y:speed
            });
            break;
    }
}
