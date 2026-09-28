document.addEventListener('DOMContentLoaded', () => {
    const logoBtn = document.getElementById('logoBtn');
    const logoVideo = document.getElementById('logoVideo');
    const textWrapper = document.getElementById('textWrapper');
    const glitchTitle = document.getElementById('glitchTitle');

    let letterSpans = [];

    // 1. FRAGMENTAR EL TEXTO EN SPANS
    if (glitchTitle) {
        const text = glitchTitle.textContent;
        glitchTitle.innerHTML = '';

        text.split('').forEach((char) => {
            const span = document.createElement('span');

            if (char === ' ') {
                span.innerHTML = '&nbsp;';
            } else {
                span.textContent = char;
                span.classList.add('glitch-char');
                letterSpans.push(span);
            }

            glitchTitle.appendChild(span);
        });
    }

    function reproducirAnimacionLogo() {
        if (!logoVideo) return;
        logoVideo.currentTime = 0;
        logoVideo.play();
    }

    if (logoVideo) {
        logoVideo.addEventListener('ended', () => {
            logoVideo.currentTime = 0;
            logoVideo.pause();
        });
    }

    // 2. SECUENCIA DE FIJACIÓN EN BLANCO Y BARRIDO VERDE
    function iniciarSecuenciaTexto() {
        if (!textWrapper || letterSpans.length === 0) return;

        textWrapper.classList.remove('hidden');

        // Reinicia letras a blanco e inicia parpadeo
        letterSpans.forEach(span => {
            span.classList.remove('fixed', 'sweep-light', 'green-final');
            span.classList.add('flickering');
            const randomDelay = (Math.random() * 0.3).toFixed(2);
            span.style.animationDelay = `${randomDelay}s`;
        });

        // Orden aleatorio para ir congelando las letras en blanco
        let indices = letterSpans.map((_, index) => index);
        indices.sort(() => Math.random() - 0.5);

        const totalLetters = indices.length;
        const totalDuration = 3200; // ~3.2s para congelar en blanco
        const intervalTime = totalDuration / totalLetters;

        let currentStep = 0;

        const interval = setInterval(() => {
            if (currentStep < totalLetters) {
                const targetIndex = indices[currentStep];
                const targetSpan = letterSpans[targetIndex];

                targetSpan.classList.remove('flickering');
                targetSpan.classList.add('fixed');

                currentStep++;
            } else {
                clearInterval(interval);

                // BARRIDO DE LUZ DE IZQUIERDA A DERECHA QUE TRANSFORMA TODO A VERDE
                setTimeout(() => {
                    letterSpans.forEach((span, idx) => {
                        setTimeout(() => {
                            span.classList.add('sweep-light', 'green-final');

                            // Libera la letra de la animación del rayo para que responda al hover
                            setTimeout(() => {
                                span.classList.remove('sweep-light');
                            }, 300);

                        }, idx * 20);
                    });
                }, 150);
            }
        }, intervalTime);
    }

    // 3. INICIO AUTOMÁTICO TRAS LA ENTRADA DEL LOGO (1.2s)
    setTimeout(() => {
        if (logoBtn) {
            logoBtn.classList.remove('animate__animated', 'animate__backInDown');
        }

        reproducirAnimacionLogo();
        iniciarSecuenciaTexto();
    }, 1200);

    // 4. REPETIR AL HACER CLIC EN EL LOGO
    if (logoBtn) {
        logoBtn.addEventListener('click', () => {
            reproducirAnimacionLogo();
        });
    }
});