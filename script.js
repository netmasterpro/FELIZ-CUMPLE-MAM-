const canvas = document.getElementById('magic-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const types = ['confeti', 'corazon', 'flor', 'globo'];

class Particle {
    constructor(isFloating = false) {
        this.isFloating = isFloating; 
        
        if (this.isFloating) {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height - canvas.height;
            this.type = Math.random() > 0.5 ? 'corazon' : 'flor';
            this.vx = Math.random() * 0.8 - 0.4;
            this.vy = Math.random() * 1.2 + 0.8; 
            this.opacity = Math.random() * 0.4 + 0.25; 
            this.radius = Math.random() * 5 + 4;
        } else {
            this.x = window.innerWidth / 2;
            this.y = window.innerHeight / 2;
            this.type = types[Math.floor(Math.random() * types.length)];
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 11 + 5;
            this.vx = Math.cos(angle) * speed;
            this.vy = Math.sin(angle) * speed - 5;
            this.opacity = 1;
            this.radius = Math.random() * 7 + 5;
        }

        this.color = `hsl(${Math.random() * 30 + 330}, 100%, 65%)`; 
        if(this.type === 'confeti') this.color = `hsl(${Math.random() * 360}, 100%, 60%)`;
        
        this.gravity = this.isFloating ? 0 : 0.22;
        this.rotation = Math.random() * Math.PI;
        this.rotationSpeed = Math.random() * 0.08 - 0.04;
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.globalAlpha = this.opacity;

        if (this.type === 'confeti') {
            ctx.fillStyle = this.color;
            ctx.fillRect(-this.radius, -this.radius/2, this.radius * 2, this.radius);
        } 
        else if (this.type === 'corazon') {
            ctx.fillStyle = '#ff2a6d';
            ctx.beginPath();
            ctx.moveTo(0, -this.radius/2);
            ctx.bezierCurveTo(-this.radius, -this.radius, -this.radius, this.radius/2, 0, this.radius);
            ctx.bezierCurveTo(this.radius, this.radius/2, this.radius, -this.radius, 0, -this.radius/2);
            ctx.fill();
        } 
        else if (this.type === 'flor') {
            ctx.fillStyle = '#ffb3c6';
            for (let i = 0; i < 5; i++) {
                ctx.rotate(Math.PI / 2.5);
                ctx.beginPath();
                ctx.ellipse(0, -this.radius, this.radius/1.8, this.radius, 0, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.beginPath();
            ctx.fillStyle = '#ffe066';
            ctx.arc(0, 0, this.radius/2.5, 0, Math.PI*2);
            ctx.fill();
        } 
        else if (this.type === 'globo') {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.ellipse(0, 0, this.radius, this.radius * 1.3, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(0, this.radius * 1.3);
            ctx.lineTo(0, this.radius * 2.5);
            ctx.strokeStyle = '#bbb';
            ctx.stroke();
        }

        ctx.restore();
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += this.gravity;
        this.rotation += this.rotationSpeed;

        if (!this.isFloating) {
            this.opacity -= 0.006; 
        } else {
            if (this.y > canvas.height) {
                this.y = -20;
                this.x = Math.random() * canvas.width;
            }
        }
    }
}

function initBackgroundFlow() {
    for (let i = 0; i < 35; i++) {
        const p = new Particle(true);
        p.y = Math.random() * canvas.height; 
        particles.push(p);
    }
    animate();
}

function revealSurprise() {
    const audio = document.getElementById('birthday-song');
    audio.play().catch(err => console.log("Audio activo"));

    document.getElementById('gift-ui').classList.add('fade-out');

    setTimeout(() => {
        document.getElementById('letter-ui').classList.add('show');
    }, 600);

    for (let i = 0; i < 180; i++) {
        particles.push(new Particle(false));
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach((p, index) => {
        p.update();
        p.draw();
        
        if (!p.isFloating && p.opacity <= 0) {
            particles.splice(index, 1);
        }
    });

    requestAnimationFrame(animate);
}

initBackgroundFlow();
