document.addEventListener('DOMContentLoaded', () => {
    const logoBtn = document.getElementById('logoBtn');
    const logoVideo = document.getElementById('logoVideo');
    const glitchTitle = document.getElementById('glitchTitle');
    const navbar = document.getElementById('navbar');

    const textoOriginal = "Programa de Ingeniería de Sistemas";
    const caracteresGlitch = "!@#$%^&*()_+-=[]{}|;:,.<>?/0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    function reproducirAnimacionLogo() {
        if (logoVideo) {
            logoVideo.currentTime = 0;
            logoVideo.play().catch(() => {});
        }
    }

    function iniciarSecuenciaTexto() {
        if (!glitchTitle) return;
        glitchTitle.innerHTML = '';

        const spans = [];
        for (let i = 0; i < textoOriginal.length; i++) {
            const span = document.createElement('span');
            span.classList.add('glitch-char');
            span.innerHTML = textoOriginal[i] === ' ' ? '&nbsp;' : caracteresGlitch[Math.floor(Math.random() * caracteresGlitch.length)];
            glitchTitle.appendChild(span);
            spans.push(span);
        }

        let iteraciones = 0;
        const maxIteraciones = 5;

        const intervalGlitch = setInterval(() => {
            spans.forEach((span, idx) => {
                if (textoOriginal[idx] !== ' ') {
                    span.textContent = caracteresGlitch[Math.floor(Math.random() * caracteresGlitch.length)];
                }
            });

            iteraciones++;
            if (iteraciones >= maxIteraciones) {
                clearInterval(intervalGlitch);
                fijarTextoDefinitivo(spans);
            }
        }, 50);
    }

    function fijarTextoDefinitivo(spans) {
        const indices = Array.from(Array(textoOriginal.length).keys());
        for (let i = indices.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [indices[i], indices[j]] = [indices[j], indices[i]];
        }

        const congeladas = new Set();

        const intervalGlitchContinuo = setInterval(() => {
            spans.forEach((span, idx) => {
                if (!congeladas.has(idx) && textoOriginal[idx] !== ' ') {
                    span.textContent = caracteresGlitch[Math.floor(Math.random() * caracteresGlitch.length)];
                }
            });
        }, 50);

        indices.forEach((idxOriginal, step) => {
            setTimeout(() => {
                congeladas.add(idxOriginal);
                const span = spans[idxOriginal];
                span.innerHTML = textoOriginal[idxOriginal] === ' ' ? '&nbsp;' : textoOriginal[idxOriginal];
                span.classList.add('locked');

                if (step === indices.length - 1) {
                    clearInterval(intervalGlitchContinuo);
                    lanzarRayoLuz(spans);
                }
            }, step * 60);
        });
    }

    function lanzarRayoLuz(spans) {
        spans.forEach((span, idx) => {
            setTimeout(() => {
                span.classList.add('sweep-light', 'green-final');
                setTimeout(() => {
                    span.classList.remove('sweep-light');
                }, 300);
            }, idx * 20);
        });
    }

    // PRESIONAR LOGO: REGRESAR AL INICIO Y RESTAURAR HERO
    if (logoBtn) {
        logoBtn.addEventListener('click', () => {
            reproducirAnimacionLogo();
            
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });

            document.body.classList.remove('scrolled-mode');
            if (navbar) navbar.classList.remove('scrolled');
        });
    }

    // CAÍDA INICIAL DEL LOGO Y TEXTO GLITCH (1.2s)
    setTimeout(() => {
        if (logoBtn) {
            logoBtn.classList.remove('animate__animated', 'animate__backInDown');
        }

        document.querySelectorAll('.system-tag, .sub-code, .glitch-title').forEach(el => {
            el.classList.add('visible');
        });

        iniciarSecuenciaTexto();
        reproducirAnimacionLogo();
    }, 1200);

    // ACTIVACIÓN DE MODO SCROLLED
    window.addEventListener('scroll', () => {
        if (window.scrollY > 80) {
            document.body.classList.add('scrolled-mode');
            if (navbar) navbar.classList.add('scrolled');
        }
    });
});