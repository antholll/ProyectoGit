// Configuración de partículas
function initParticles() {
    const canvas = document.getElementById('particles-js');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = 100;

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.speedX = Math.random() * 3 - 1.5;
            this.speedY = Math.random() * 3 - 1.5;
            this.color = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.7)`;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x > canvas.width || this.x < 0) {
                this.speedX = -this.speedX;
            }
            if (this.y > canvas.height || this.y < 0) {
                this.speedY = -this.speedY;
            }
        }

        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function createParticles() {
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();

            for (let j = i; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(255, 255, 255, 0.1)`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(animateParticles);
    }

    createParticles();
    animateParticles();

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// Sistema de Búsqueda
function initSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    const features = document.querySelectorAll('.feature-card');

    searchInput.addEventListener('input', function () {
        const searchTerm = this.value.toLowerCase().trim();

        if (searchTerm.length < 2) {
            searchResults.style.display = 'none';
            return;
        }

        const results = [];
        features.forEach(card => {
            const text = card.textContent.toLowerCase();
            const searchData = card.getAttribute('data-search').toLowerCase();

            if (text.includes(searchTerm) || searchData.includes(searchTerm)) {
                results.push({
                    title: card.querySelector('h3').textContent,
                    content: card.querySelector('p').textContent,
                    element: card
                });
            }
        });

        displayResults(results);
    });

    function displayResults(results) {
        searchResults.innerHTML = '';

        if (results.length === 0) {
            searchResults.innerHTML = '<div class="search-result-item">No se encontraron resultados</div>';
            searchResults.style.display = 'block';
            return;
        }

        results.forEach(result => {
            const item = document.createElement('div');
            item.className = 'search-result-item';
            item.innerHTML = `
                <strong>${result.title}</strong><br>
                <small>${result.content}</small>
            `;

            item.addEventListener('click', () => {
                result.element.scrollIntoView({ behavior: 'smooth' });
                result.element.animate([
                    { transform: 'scale(1)' },
                    { transform: 'scale(1.03)' },
                    { transform: 'scale(1)' }
                ], {
                    duration: 500,
                    iterations: 1
                });
                searchResults.style.display = 'none';
                searchInput.value = '';
            });

            searchResults.appendChild(item);
        });

        searchResults.style.display = 'block';
    }

    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
            searchResults.style.display = 'none';
        }
    });
}

// Contador de Estadísticas
function initStatsCounter() {
    const counters = document.querySelectorAll('.stat-number');
    const speed = 2000;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                if (!counter.classList.contains('animated')) {
                    counter.classList.add('animated');
                    const target = parseInt(counter.getAttribute('data-target'));
                    animateValue(counter, 0, target, speed);
                }
            }
        });
    }, { threshold: 0.5 });

    function animateValue(element, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            element.textContent = Math.floor(progress * (end - start) + start);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    counters.forEach(counter => {
        observer.observe(counter);
    });
}

// Reproductor de Audio con spinner
function initAudioPlayer() {
    const audio = document.getElementById('backgroundAudio');
    const playIcon = document.getElementById('playIcon');
    const progressBar = document.getElementById('audioProgress');
    let isPlaying = false;

    const audioPlayer = audio.closest('.audio-player');
    const spinner = audioPlayer.querySelector('.audio-spinner');

    audio.addEventListener('loadstart', () => {
        spinner.style.display = 'block';
    });

    audio.addEventListener('canplay', () => {
        spinner.style.display = 'none';
    });

    window.playPause = function () {
        if (isPlaying) {
            audio.pause();
            playIcon.className = 'fas fa-play';
        } else {
            audio.play().catch(e => {
                console.error('Error al intentar reproducir audio:', e);
                alert('La reproducción automática de audio puede estar bloqueada por el navegador. Por favor, interactúa con la página para habilitarla.');
            });
            playIcon.className = 'fas fa-pause';
        }
        isPlaying = !isPlaying;
    };

    window.stopAudio = function () {
        audio.pause();
        audio.currentTime = 0;
        playIcon.className = 'fas fa-play';
        isPlaying = false;
        progressBar.style.width = '0%';
    };

    window.changeVolume = function (volume) {
        audio.volume = volume;
    };

    audio.addEventListener('timeupdate', () => {
        if (audio.duration) {
            const progress = (audio.currentTime / audio.duration) * 100;
            progressBar.style.width = progress + '%';
        }
    });

    progressBar.parentElement.addEventListener('click', (e) => {
        const rect = progressBar.parentElement.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const clickedValue = x / rect.width;
        if (audio.duration) {
            audio.currentTime = clickedValue * audio.duration;
        }
    });
}

// Variables globales para el manejo de temas
let autoThemeEnabled = false;
let systemPreference = null;

// Detectar preferencia del sistema
function detectSystemPreference() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
    }
    return 'default';
}

// Configurar modo auto
function setupAutoTheme() {
    const autoToggle = document.getElementById('auto-theme-toggle');
    const autoIndicator = document.getElementById('auto-indicator');

    // Cargar preferencia guardada
    const savedAutoMode = localStorage.getItem('autoThemeEnabled');
    if (savedAutoMode === 'true') {
        autoThemeEnabled = true;
        autoToggle.checked = true;
        autoIndicator.textContent = 'ON';
        applySystemTheme();
    }

    // Escuchar cambios en el toggle
    autoToggle.addEventListener('change', function () {
        autoThemeEnabled = this.checked;
        autoIndicator.textContent = this.checked ? 'ON' : 'OFF';
        localStorage.setItem('autoThemeEnabled', this.checked);

        if (this.checked) {
            applySystemTheme();
        } else {
            showThemeNotification('Modo manual activado');
            const currentTheme = localStorage.getItem('selectedTheme') || 'default';
            document.body.className = 'theme-' + currentTheme;
        }
    });

    // Escuchar cambios en la preferencia del sistema
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            if (autoThemeEnabled) {
                systemPreference = e.matches ? 'dark' : 'default';
                applySystemTheme();
            }
        });
    }
}

// Aplicar tema del sistema
function applySystemTheme() {
    if (!autoThemeEnabled) return;

    systemPreference = detectSystemPreference();
    changeTheme(systemPreference, true);
    showThemeNotification(`Modo auto: ${systemPreference === 'dark' ? 'Oscuro' : 'Claro'}`);
}

// Función para cambiar el tema
function changeTheme(themeName, isAuto = false) {
    if (!isAuto && autoThemeEnabled) {
        document.getElementById('auto-theme-toggle').checked = false;
        autoThemeEnabled = false;
        document.getElementById('auto-indicator').textContent = 'OFF';
        localStorage.setItem('autoThemeEnabled', 'false');
        showThemeNotification('Modo auto desactivado');
    }

    document.body.className = 'theme-' + themeName;
    localStorage.setItem('selectedTheme', themeName);

    if (!isAuto) {
        showThemeNotification(themeName);
    }
}

// Mostrar notificación del tema
function showThemeNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--card-bg);
        color: var(--text-color);
        padding: 15px 25px;
        border-radius: 50px;
        box-shadow: 0 4px 20px var(--shadow-color);
        z-index: 1002;
        font-weight: bold;
        display: flex;
        align-items: center;
        gap: 10px;
        border: 1px solid var(--border-color);
        opacity: 0;
        transition: opacity 0.3s ease-in-out;
    `;

    const themeMessages = {
        'default': 'Tema Default',
        'dark': 'Modo Oscuro Real',
        'nature': 'Tema Naturaleza',
        'sunset': 'Tema Atardecer',
        'ocean': 'Tema Océano',
        'Modo auto activado': 'Modo Auto Activado',
        'Modo manual activado': 'Modo Manual Activado'
    };

    notification.innerHTML = `
        <i class="fas fa-check-circle" style="color: var(--primary-color);"></i>
        ${themeMessages[message] || message}
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.opacity = 1;
    }, 10);

    setTimeout(() => {
        notification.style.opacity = 0;
        notification.addEventListener('transitionend', () => notification.remove(), { once: true });
    }, 2000);
}

// Cargar tema guardado
function loadSavedTheme() {
    const savedTheme = localStorage.getItem('selectedTheme');
    if (savedTheme) {
        document.body.className = 'theme-' + savedTheme;
    }
}

// Menú Hamburguesa
const hamburger = document.getElementById('hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Modal de Bienvenida
const welcomeModal = document.getElementById('welcomeModal');
const countdownElement = document.getElementById('countdown');
const countdownAnimation = document.getElementById('countdown-animation');

let countdownTimer;

function startCountdown() {
    let currentCountdown = 5;
    countdownElement.textContent = currentCountdown;

    countdownTimer = setInterval(() => {
        currentCountdown--;
        countdownElement.textContent = currentCountdown;

        countdownAnimation.style.transform = `scale(${1 + (5 - currentCountdown) * 0.1})`;

        if (currentCountdown <= 0) {
            clearInterval(countdownTimer);
            closeModal();
        }
    }, 1000);
}

function closeModal() {
    clearInterval(countdownTimer);
    welcomeModal.style.animation = 'modalSlideOut 0.5s ease-out forwards';
    setTimeout(() => {
        welcomeModal.classList.add('hidden');
    }, 500);
}

// Pelota rebotando
const ball = document.getElementById('ball');
const shadow = document.getElementById('shadow');
let isBallPaused = false;
let currentBallSpeed = 4;

setInterval(() => {
    if (!isBallPaused) {
        const colors = ['var(--primary-color)', 'var(--secondary-color)', 'var(--accent-color)'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        ball.style.background = `radial-gradient(circle at 20px 20px, ${randomColor}, ${randomColor}44)`;
    }
}, 2000);

// Modo Alto Contraste
function toggleHighContrast() {
    const isActive = document.body.getAttribute('data-theme') === 'high-contrast';
    if (isActive) {
        document.body.removeAttribute('data-theme');
        localStorage.removeItem('highContrastEnabled');
    } else {
        document.body.setAttribute('data-theme', 'high-contrast');
        localStorage.setItem('highContrastEnabled', 'true');
    }
}

function loadHighContrast() {
    if (localStorage.getItem('highContrastEnabled') === 'true') {
        document.body.setAttribute('data-theme', 'high-contrast');
    }
}

// Animaciones optimizadas para elementos clave
function applyFadeInAnimations() {
    const fadeElements = document.querySelectorAll('h1, p, .container, .feature-card, .stat-card, .audio-player, .footer');
    fadeElements.forEach(el => {
        el.classList.add('fade-in');
    });
}

// Inicializar todo cuando cargue la página
window.addEventListener('load', function () {
    setTimeout(() => {
        startCountdown();
    }, 1000);

    loadSavedTheme();
    setupAutoTheme();
    loadHighContrast();
    systemPreference = detectSystemPreference();

    initParticles();
    initSearch();
    initStatsCounter();
    initAudioPlayer();

    typeWriterEffect();

    applyFadeInAnimations();
});

// Smooth scroll para los links del menú
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const navbarHeight = document.querySelector('.navbar').offsetHeight;
            const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = elementPosition - navbarHeight;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Efecto de escritura para el título
function typeWriterEffect() {
    const title = document.querySelector('h1');
    if (!title) return;
    const originalText = title.textContent;
    title.textContent = '';
    let i = 0;

    function type() {
        if (i < originalText.length) {
            title.textContent += originalText.charAt(i);
            i++;
            setTimeout(type, 100);
        }
    }
    type();
}
