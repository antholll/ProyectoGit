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

            // Conectar partículas cercanas
            for (let j = i; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(255, 255, 255, ${0.1})`;
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

    searchInput.addEventListener('input', function() {
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
                // Añadir una animación de "pulse" para resaltar el elemento
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

    // Cerrar resultados al hacer clic fuera
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
            searchResults.style.display = 'none';
        }
    });
}

// Contador de Estadísticas
function initStatsCounter() {
    const counters = document.querySelectorAll('.stat-number');
    const speed = 2000; // Duración de la animación en ms

    const observer = new IntersectionObserver((entries, observer) => {
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
    }, { threshold: 0.5 }); // Activar cuando el 50% del elemento sea visible

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

// Reproductor de Audio
function initAudioPlayer() {
    const audio = document.getElementById('backgroundAudio');
    const playIcon = document.getElementById('playIcon');
    const progressBar = document.getElementById('audioProgress');
    let isPlaying = false;

    window.playPause = function() {
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

    window.stopAudio = function() {
        audio.pause();
        audio.currentTime = 0;
        playIcon.className = 'fas fa-play';
        isPlaying = false;
        progressBar.style.width = '0%';
    };

    // Mejorar el control de volumen con un slider si se desea, o mantener el botón para un volumen fijo
    window.changeVolume = function(volume) {
        audio.volume = volume; // Establece un volumen fijo, por ejemplo 0.1
        // Para un control de volumen más dinámico, se necesitaría un input type="range" en el HTML
    };

    audio.addEventListener('timeupdate', () => {
        if (audio.duration) { // Asegurarse de que la duración esté disponible
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
    autoToggle.addEventListener('change', function() {
        autoThemeEnabled = this.checked;
        autoIndicator.textContent = this.checked ? 'ON' : 'OFF';
        localStorage.setItem('autoThemeEnabled', this.checked);
        
        if (this.checked) {
            applySystemTheme();
        } else {
            showThemeNotification('Modo manual activado');
            // Si se desactiva el modo auto, se mantiene el tema actual o se vuelve al default
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
    changeTheme(systemPreference, true); // El segundo parámetro indica que es un cambio automático
    showThemeNotification(`Modo auto: ${systemPreference === 'dark' ? 'Oscuro' : 'Claro'}`);
}

// Función para cambiar el tema
function changeTheme(themeName, isAuto = false) {
    if (!isAuto && autoThemeEnabled) {
        // Si el usuario cambia el tema manualmente mientras el modo auto está activado,
        // se desactiva el modo auto.
        document.getElementById('auto-theme-toggle').checked = false;
        autoThemeEnabled = false;
        document.getElementById('auto-indicator').textContent = 'OFF';
        localStorage.setItem('autoThemeEnabled', 'false');
        showThemeNotification('Modo auto desactivado');
    }
    
    document.body.className = 'theme-' + themeName;
    localStorage.setItem('selectedTheme', themeName);
    
    if (!isAuto) { // Solo mostrar notificación si el cambio es manual
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
    
    // Animar la aparición y desaparición
    setTimeout(() => {
        notification.style.opacity = 1;
    }, 10); // Pequeño retraso para que la transición funcione

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

// Cerrar menú al hacer clic en un link
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

let countdownTimer; // Renombrado para evitar conflicto con la variable global 'countdown'

function startCountdown() {
    let currentCountdown = 5; // Variable local para el contador del modal
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
    welcomeModal.style.animation = 'modalSlideOut 0.5s ease-out forwards'; // 'forwards' mantiene el estado final
    setTimeout(() => {
        welcomeModal.classList.add('hidden');
    }, 500);
}

// Pelota rebotando (se movió la lógica de velocidad y pausa aquí)
const ball = document.getElementById('ball');
const shadow = document.getElementById('shadow');
let isBallPaused = false; // Renombrado para evitar conflicto
let currentBallSpeed = 4; // Velocidad inicial de la animación de la pelota

// Cambio de color de la pelota rebotando
setInterval(() => {
    if (!isBallPaused) {
        const colors = ['var(--primary-color)', 'var(--secondary-color)', 'var(--accent-color)'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        ball.style.background = `radial-gradient(circle at 20px 20px, ${randomColor}, ${randomColor}44)`;
    }
}, 2000);

// Inicializar todo cuando cargue la página
window.addEventListener('load', function() {
    // Iniciar el modal después de un breve retraso
    setTimeout(() => {
        startCountdown();
    }, 1000);

    // Cargar tema guardado y configurar modo auto
    loadSavedTheme();
    setupAutoTheme();
    systemPreference = detectSystemPreference(); // Asegurarse de que systemPreference esté inicializado

    // Inicializar nuevas características
    initParticles();
    initSearch();
    initStatsCounter();
    initAudioPlayer();

    // Iniciar el efecto de escritura para el título
    typeWriterEffect();
});

// Smooth scroll para los links del menú
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            // Calcular el desplazamiento para tener en cuenta la barra de navegación fija
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
    if (!title) return; // Asegurarse de que el título exista
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
