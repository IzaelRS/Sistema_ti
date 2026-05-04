export const networkBg = {
    canvas: null,
    ctx: null,
    particles: [],
    animationFrameId: null,
    isActive: false,

    init() {
        this.canvas = document.getElementById('account-network-bg');
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.resize();
        window.addEventListener('resize', () => {
            if (this.isActive) this.resize();
        });

        // Settings
        const isMobile = window.innerWidth <= 768;
        this.particleCount = isMobile ? 30 : 60;
        this.connectDistance = 150;
        this.particleColor = 'rgba(34, 211, 238, 0.5)'; // Cyan

        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 1.5,
                vy: (Math.random() - 0.5) * 1.5,
                radius: Math.random() * 2 + 1
            });
        }
    },

    resize() {
        if (!this.canvas) return;
        const section = document.getElementById('account-section');
        if (section) {
            this.canvas.width = section.clientWidth;
            this.canvas.height = section.clientHeight;
        }
    },

    updateAndDraw() {
        if (!this.isActive || !this.canvas) return;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];

            // Update
            p.x += p.vx;
            p.y += p.vy;

            // Bounce
            if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;

            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = this.particleColor;
            this.ctx.fill();

            // Connect lines
            for (let j = i + 1; j < this.particles.length; j++) {
                const p2 = this.particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.connectDistance) {
                    this.ctx.beginPath();
                    this.ctx.lineWidth = 1;
                    const opacity = 1 - (distance / this.connectDistance);
                    this.ctx.strokeStyle = `rgba(34, 211, 238, ${opacity * 0.4})`;
                    this.ctx.moveTo(p.x, p.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.stroke();
                }
            }
        }

        this.animationFrameId = requestAnimationFrame(() => this.updateAndDraw());
    },

    start() {
        if (!this.canvas) this.init();
        if (!this.isActive) {
            this.isActive = true;
            this.resize();
            this.updateAndDraw();
        }
    },

    stop() {
        this.isActive = false;
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }
};
