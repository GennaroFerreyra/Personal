const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Ajustar el tamaño del canvas al tamaño de la ventana
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Girasol {
    constructor(x, y, tamañoMaximo) {
        this.x = x;
        this.y = y;
        this.tamaño = 0;
        this.tamañoMaximo = tamañoMaximo;
        this.crecimiento = 0.3 + Math.random() * 0.3;
        this.petalos = 20 + Math.floor(Math.random() * 10);
        this.opacidad = 0;
        this.escala = 0;
    }

    dibujar() {
        if (this.tamaño < this.tamañoMaximo) {
            this.tamaño += this.crecimiento;
        }
        if (this.opacidad < 1) {
            this.opacidad += 0.02;
        }
        if (this.escala < 1) {
            this.escala += 0.02;
        }

        // Dibujo de pétalos y centro (con transformaciones)
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.scale(this.escala, this.escala);
        ctx.globalAlpha = this.opacidad;

        // Pétalos exteriores
        for (let i = 0; i < this.petalos; i++) {
            const anguloPetalo = (i / this.petalos) * Math.PI * 2;
            ctx.beginPath();
            ctx.fillStyle = '#E6B800';
            ctx.ellipse(
                Math.cos(anguloPetalo) * this.tamaño * 0.8,
                Math.sin(anguloPetalo) * this.tamaño * 0.8,
                this.tamaño * 0.6,
                this.tamaño * 0.15,
                anguloPetalo,
                0,
                Math.PI * 2
            );
            ctx.fill();
        }

        // Pétalos interiores
        for (let i = 0; i < this.petalos; i++) {
            const anguloPetalo = (i / this.petalos) * Math.PI * 2;
            ctx.beginPath();
            ctx.fillStyle = '#FFD700';
            ctx.ellipse(
                Math.cos(anguloPetalo) * this.tamaño * 0.6,
                Math.sin(anguloPetalo) * this.tamaño * 0.6,
                this.tamaño * 0.5,
                this.tamaño * 0.12,
                anguloPetalo,
                0,
                Math.PI * 2
            );
            ctx.fill();
        }

        // Centro liso
        const radioCentro = this.tamaño * 0.4;
        ctx.beginPath();
        ctx.fillStyle = '#8B4513';
        ctx.arc(0, 0, radioCentro, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

const girasoles = [];
let ultimoGirasol = 0;
let animacionCompletada = false;
const MAX_GIRASOLES = 12;

const SECTORES = 6; // Número de sectores bien separados
const RADIO_SECTOR = 180; // Distancia del centro para cada sector

function generarPosicionPorGrupo(indice) {
    const centroX = canvas.width / 2;
    const centroY = canvas.height / 2;
    // Para los grandes, asignar sectores opuestos (0, 3, 1, 2)
    if (indice < 4) {
        const sector = [0, 3, 1, 2][indice];
        const angulo = (sector / 4) * 2 * Math.PI;
        const x = centroX + Math.cos(angulo) * (RADIO_SECTOR - 20);
        const y = centroY + Math.sin(angulo) * (RADIO_SECTOR - 20);
        return { x, y };
    }
    // Para los demás, usar posiciones aleatorias en el centro
    const radio = 80; // Radio para intermedios y pequeños
    const angulo = Math.random() * 2 * Math.PI;
    const x = centroX + Math.cos(angulo) * radio;
    const y = centroY + Math.sin(angulo) * radio;
    return { x, y };
}

function obtenerTamañoPorIndice(indice) {
    // 4 grandes, 4 intermedios, 4 pequeños (en total 12)
    if (indice < 4) return 120 + Math.random() * 20; // grandes
    if (indice < 8) return 70 + Math.random() * 15;  // intermedios
    return 40 + Math.random() * 10;                 // pequeños
}

function animar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Crear nuevo girasol cada 1.5 segundos si no hemos completado el máximo
    const ahora = Date.now();
    if (!animacionCompletada && ahora - ultimoGirasol > 1500) {
        if (girasoles.length < MAX_GIRASOLES) {
            const pos = generarPosicionPorGrupo(girasoles.length);
            const tamañoMaximo = obtenerTamañoPorIndice(girasoles.length);
            girasoles.push(new Girasol(pos.x, pos.y, tamañoMaximo));
            ultimoGirasol = ahora;
        } else {
            animacionCompletada = true;
        }
    }

    // Dibujar todos los girasoles
    girasoles.forEach(girasol => girasol.dibujar());

    if (!animacionCompletada) {
        requestAnimationFrame(animar);
    }
}

animar(); 