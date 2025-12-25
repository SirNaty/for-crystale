const canvas = document.getElementById("petals");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Load petal image
const petalImg = new Image();
petalImg.src = "images/petal.png";

const petals = [];
const PETAL_COUNT = 100;

class Petal {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * -canvas.height;
        this.size = Math.random() * 25 + 15;
        this.speedY = Math.random() * 1.5 + 0.8;
        this.speedX = Math.random() * 0.6 - 0.3;
        this.angle = Math.random() * Math.PI * 2;
        this.rotation = Math.random() * 0.02 - 0.01;
        this.opacity = Math.random() * 0.5 + 0.5;
        this.fade = Math.random() * 0.0015 + 0.001;
    }

    update() {
        this.y += this.speedY;
        this.x += this.speedX + Math.sin(this.angle) * 0.5;
        this.angle += this.rotation;
        this.opacity -= this.fade;

        if (this.y > canvas.height || this.opacity <= 0) {
            this.reset();
        }
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.drawImage(
            petalImg,
            -this.size / 2,
            -this.size / 2,
            this.size,
            this.size
        );
        ctx.restore();
    }
}

// Interaction (touch + mouse)
function interact(x, y) {
    petals.forEach(p => {
        const dx = p.x - x;
        const dy = p.y - y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 80) {
            p.speedY += 0.3;
            p.speedX += dx * 0.002;
        }
    });
}

canvas.addEventListener("mousemove", e => {
    interact(e.clientX, e.clientY);
});

canvas.addEventListener("touchmove", e => {
    if (e.touches.length > 0) {
        interact(e.touches[0].clientX, e.touches[0].clientY);
    }
});

// Start animation ONLY after image loads
petalImg.onload = () => {
    for (let i = 0; i < PETAL_COUNT; i++) {
        petals.push(new Petal());
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        petals.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    }

    animate();
};

// Music toggle
const music = document.getElementById("music");
const musicBtn = document.getElementById("music-toggle");

musicBtn.addEventListener("click", () => {
    if (music.paused) {
        music.play();
        musicBtn.textContent = "Pause Music";
    } else {
        music.pause();
        musicBtn.textContent = "Play Music";
    }
});
