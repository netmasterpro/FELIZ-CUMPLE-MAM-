// --- LOGICA INTERACTIVA PRINCIPAL ---
function revealSurprise() {
    // 1. Iniciar música
    const audio = document.getElementById('birthday-song');
    audio.play().catch(error => {
        console.log("La reproducción automática requería acción del usuario, arreglado con el click.");
    });

    // 2. Desvanecer interfaz del regalo
    document.getElementById('gift-ui').classList.add('fade-out');

    // 3. Mostrar la carta con retraso elegante
    setTimeout(() => {
        document.getElementById('letter-ui').classList.add('show');
    }, 600);

    // 4. Lanzar estallido masivo
    triggerExplosion();
}

// --- SISTEMA DE ESTALLIDO (CONFETI, CORAZONES, FLORES, GLOBOS) ---
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
    constructor() {
        this.x = window.innerWidth / 2;
        this.y = window.innerHeight / 2 + 50;
        this.type = types[Math.floor(Math.random() * types.length)];
        
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 12 + 6;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed - 5;
        
        this.radius = Math.random() * 8 + 6;
        this.color = `hsl(${Math.random() * 40 + 330}, 100%, ${Math.random() * 20 + 60}%)`;
        if(this.type === 'confeti') this.color = `hsl(${Math.random() * 360}, 100%, 60%)`;
        
        this.opacity = 1;
        this.gravity = 0.2;
        this.rotation = Math.random() * Math.PI;
        this.rotationSpeed = Math.random() * 0.1 - 0.05;
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
            ctx.fillStyle = '#ff3366';
            ctx.beginPath();
            ctx.moveTo(0, -this.radius/2);
            ctx.bezierCurveTo(-this.radius, -this.radius, -this.radius, this.radius/2, 0, this.radius);
            ctx.bezierCurveTo(this.radius, this.radius/2, this.radius, -this.radius, 0, -this.radius/2);
            ctx.fill();
        } 
        else if (this.type === 'flor') {
            ctx.fillStyle = '#ffccd5';
            for (let i = 0; i < 5; i++) {
                ctx.rotate(Math.PI / 2.5);
                ctx.beginPath();
                ctx.ellipse(0, -this.radius, this.radius/2, this.radius, 0, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.beginPath();
            ctx.fillStyle = '#ffeb3b';
            ctx.arc(0, 0, this.radius/3, 0, Math.PI*2);
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
            ctx.strokeStyle = '#999';
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        ctx.restore();
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += this.gravity;
        this.rotation += this.rotationSpeed;
        this.opacity -= 0.006;
    }
}

function triggerExplosion() {
    for (let i = 0; i < 220; i++) {
        particles.push(new Particle());
    }
    animateParticles();
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach((p, index) => {
        p.update();
        p.draw();
        if (p.opacity <= 0 || p.y > canvas.height) {
            particles.splice(index, 1);
        }
    });

    if (particles.length > 0) {
        requestAnimationFrame(animateParticles);
    }
}
