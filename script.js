document.addEventListener('DOMContentLoaded', () => {
    const c = document.getElementById("c"), x = c.getContext("2d");
    let w, h, snow = [], img = new Image();
    img.src = "snow.png";
    function resize() { w = innerWidth; h = innerHeight; c.width = w; c.height = h }
    function init(n = 150) { snow = []; for (let i = 0; i < n; i++)snow.push({ x: Math.random() * w, y: Math.random() * h, r: 5 + Math.random() * 5, d: Math.random() * 1 + 0.5 }) }
    function draw() { x.clearRect(0, 0, w, h); for (let i of snow) x.drawImage(img, i.x, i.y, i.r, i.r) }
    function update() { for (let i of snow) { i.y += i.d; i.x += 0; if (i.y > h) { i.y = -10; i.x = Math.random() * w } } }
    function loop() { draw(); update(); requestAnimationFrame(loop) }
    window.onresize = () => { resize(); init() }
    img.onload = () => { resize(); init(); loop() }
});

const container = document.querySelector('.selectorcont');
const items = document.querySelectorAll('.sing_mode');

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
    if (closest) {closest.classList.add('center')
        document.getElementById("modedisp").innerHTML = closest.getAttribute("data-mode")
    };
}

container.addEventListener('scroll', updateCenterClass);
window.addEventListener('resize', updateCenterClass);
updateCenterClass();