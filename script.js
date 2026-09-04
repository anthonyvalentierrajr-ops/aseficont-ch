document.addEventListener('DOMContentLoaded', () => {

    // =========================================================
    // 1. MENÚ HAMBURGUESA
    // =========================================================
    const menuBtn  = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');

    // Crear overlay dinámicamente
    const overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    document.body.appendChild(overlay);

    function abrirMenu() {
        navLinks.classList.add('active');
        menuBtn.classList.add('active');
        overlay.style.display = 'block';
        setTimeout(() => overlay.classList.add('active'), 10);
        document.body.style.overflow = 'hidden';
    }

    function cerrarMenu() {
        navLinks.classList.remove('active');
        menuBtn.classList.remove('active');
        overlay.classList.remove('active');
        setTimeout(() => { overlay.style.display = 'none'; }, 300);
        document.body.style.overflow = '';
        document.querySelectorAll('.nav-dropdown').forEach(d => d.classList.remove('active'));
    }

    menuBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        if (navLinks.classList.contains('active')) {
            cerrarMenu();
        } else {
            abrirMenu();
        }
    });

    // Cerrar al hacer clic en el overlay
    overlay.addEventListener('click', cerrarMenu);

    // Cerrar al hacer clic en cualquier link del menú
    navLinks?.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            cerrarMenu();
        });
    });

    document.addEventListener('click', (e) => {
        if (navLinks && !navLinks.contains(e.target) && !menuBtn.contains(e.target)) {
            cerrarMenu();
        }
    });

    // =========================================================
    // 2. DROPDOWN MENÚ (desktop hover / mobile click)
    // En móvil: la flecha (dd-toggle) abre el dropdown.
    // El link de "Quiénes Somos" navega libremente siempre.
    // =========================================================
    document.querySelectorAll('.nav-dropdown').forEach(drop => {
        const toggle = drop.querySelector('.dd-toggle');

        // Solo la flecha abre/cierra en móvil
        toggle?.addEventListener('click', (e) => {
            e.stopPropagation();
            if (window.innerWidth <= 768) {
                drop.classList.toggle('active');
            }
        });

        // Desktop: hover abre el dropdown
        drop.addEventListener('mouseenter', () => {
            if (window.innerWidth > 768) drop.classList.add('active');
        });
        drop.addEventListener('mouseleave', () => {
            if (window.innerWidth > 768) drop.classList.remove('active');
        });
    });

    // =========================================================
    // 3. SCROLL SUAVE Y LINK ACTIVO
    // =========================================================
    const setActive = (id) => {
        document.querySelectorAll('.nav-links a:not(.btn-cta)').forEach(a => {
            a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
        });
    };

    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const id = link.getAttribute('href').slice(1);
            if (!id) return;
            e.preventDefault();
            const el = document.getElementById(id);
            const offset = document.querySelector('.main-header')?.offsetHeight || 0;
            if (el) window.scrollTo({ top: el.getBoundingClientRect().top + scrollY - offset, behavior: 'smooth' });
            setActive(id);
            history.pushState(null, '', `#${id}`);
            navLinks?.classList.remove('active');
            menuBtn?.classList.remove('active');
        });
    });

    if (window.location.hash) {
        const id = window.location.hash.slice(1);
        setTimeout(() => {
            const el = document.getElementById(id);
            const offset = document.querySelector('.main-header')?.offsetHeight || 0;
            if (el) window.scrollTo({ top: el.getBoundingClientRect().top + scrollY - offset, behavior: 'auto' });
            setActive(id);
        }, 100);
    }

    // =========================================================
    // 4. HEADER — ACTIVE NAV ON SCROLL
    // =========================================================
    const sections = document.querySelectorAll('section[id], footer[id]');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) setActive(entry.target.id);
        });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sections.forEach(s => observer.observe(s));

    // =========================================================
    // 5. CARRUSEL DE TESTIMONIOS + DOTS
    // =========================================================
    const track   = document.getElementById('trackT');
    const nextBtn = document.getElementById('nextT');
    const prevBtn = document.getElementById('prevT');
    const dotsEl  = document.getElementById('carouselDots');
    let currentIndex = 0;

    const getVisible = () => window.innerWidth > 1024 ? 3 : window.innerWidth > 768 ? 2 : 1;

    const totalCards = () => document.querySelectorAll('.testimonial-card').length;

    const buildDots = () => {
        if (!dotsEl) return;
        dotsEl.innerHTML = '';
        const count = totalCards() - getVisible() + 1;
        for (let i = 0; i < count; i++) {
            const d = document.createElement('div');
            d.className = 'dot' + (i === currentIndex ? ' active' : '');
            d.addEventListener('click', () => goTo(i));
            dotsEl.appendChild(d);
        }
    };

    const updateDots = () => {
        dotsEl?.querySelectorAll('.dot').forEach((d, i) => {
            d.classList.toggle('active', i === currentIndex);
        });
    };

    const goTo = (idx) => {
        if (!track) return;
        const cards = document.querySelectorAll('.testimonial-card');
        if (!cards.length) return;
        const cardW = cards[0].offsetWidth;
        const gap   = parseFloat(getComputedStyle(track).gap) || 24;
        currentIndex = Math.max(0, Math.min(idx, totalCards() - getVisible()));
        track.style.transform = `translateX(-${currentIndex * (cardW + gap)}px)`;
        updateDots();
    };

    nextBtn?.addEventListener('click', () => goTo(currentIndex + 1 > totalCards() - getVisible() ? 0 : currentIndex + 1));
    prevBtn?.addEventListener('click', () => goTo(currentIndex - 1 < 0 ? totalCards() - getVisible() : currentIndex - 1));

    window.addEventListener('resize', () => { currentIndex = 0; goTo(0); buildDots(); });

    buildDots();

    // Auto-play suave
    let autoplay = setInterval(() => goTo(currentIndex + 1 > totalCards() - getVisible() ? 0 : currentIndex + 1), 5000);
    [nextBtn, prevBtn].forEach(b => b?.addEventListener('click', () => { clearInterval(autoplay); autoplay = setInterval(() => goTo(currentIndex + 1 > totalCards() - getVisible() ? 0 : currentIndex + 1), 5000); }));

    // =========================================================
    // 6. FAQ ACORDEÓN
    // =========================================================
    document.querySelectorAll('.faq-question').forEach(q => {
        q.addEventListener('click', () => {
            const item = q.parentElement;
            const isActive = item.classList.contains('active');
            document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
            if (!isActive) item.classList.add('active');
        });
    });

    // =========================================================
    // 7. ANIMACIONES REVEAL (Intersection Observer)
    // =========================================================
    const revealObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-show');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    // =========================================================
    // 8. BIBLIOTECA DE MEDIOS
    // =========================================================
    document.querySelectorAll('.mb-filtro').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.mb-filtro').forEach(filterBtn => filterBtn.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;
            document.querySelectorAll('.mb-seccion').forEach(section => {
                section.style.display = filter === 'all' || section.dataset.category === filter ? 'block' : 'none';
            });
        });
    });

    document.querySelectorAll('.mb-video-card').forEach(card => {
        const playButton = card.querySelector('.mb-video-play');
        const thumbnail = card.querySelector('.mb-video-thumb');

        playButton?.addEventListener('click', () => {
            const video = document.createElement('video');
            video.className = 'mb-video-player';
            video.controls = true;
            video.setAttribute('controlsList', 'nodownload');
            video.autoplay = true;
            video.preload = 'metadata';
            video.poster = thumbnail.querySelector('img').src;
            video.setAttribute('aria-label', card.querySelector('h3').textContent);

            const source = document.createElement('source');
            source.src = card.dataset.video;
            source.type = 'video/mp4';
            video.appendChild(source);
            thumbnail.replaceChildren(video);
            video.focus();
        });
    });

    // =========================================================
    // 9. BARRAS DE VISION
    // =========================================================
    const visionBars = document.querySelectorAll('.h-vision__bars');
    if (visionBars.length) {
        const barObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.querySelectorAll('.h-vbar__fill').forEach(bar => {
                        const width = bar.style.getPropertyValue('--w');
                        bar.style.width = width || '0%';
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        visionBars.forEach(barGroup => barObserver.observe(barGroup));
    }

    // =========================================================
    // 10. FORMULARIO — Envío real vía PHP (enviar.php)
    // =========================================================
    const contactForm = document.getElementById('contactForm');
    const formFeedback = document.getElementById('formFeedback');

    contactForm?.addEventListener('submit', async (e) => {
        e.preventDefault();

        const btn = e.target.querySelector('.btn-submit');
        const originalHTML = btn.innerHTML;

        // Estado "enviando..."
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Enviando...</span>';
        btn.disabled = true;
        if (formFeedback) { formFeedback.textContent = ''; formFeedback.className = 'form-feedback'; }

        try {
            const formData = new FormData(contactForm);
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData
            });
            const data = await response.json();

            if (data.status === 'success') {
                btn.innerHTML = '<i class="fas fa-check"></i> <span>¡Enviado con éxito!</span>';
                btn.style.background = 'linear-gradient(135deg, #2e7d32, #388e3c)';
                if (formFeedback) {
                    formFeedback.textContent = data.message || 'Tu solicitud fue enviada correctamente.';
                    formFeedback.className = 'form-feedback form-feedback--success';
                }
                contactForm.reset();
            } else {
                throw new Error(data.message || 'No se pudo enviar el mensaje.');
            }
        } catch (error) {
            btn.innerHTML = '<i class="fas fa-exclamation-circle"></i> <span>Error al enviar</span>';
            btn.style.background = 'linear-gradient(135deg, #c62828, #e53935)';
            if (formFeedback) {
                formFeedback.textContent = error.message || 'Ocurrió un error. Intenta de nuevo o escríbenos por WhatsApp.';
                formFeedback.className = 'form-feedback form-feedback--error';
            }
        } finally {
            setTimeout(() => {
                btn.innerHTML = originalHTML;
                btn.style.background = '';
                btn.disabled = false;
            }, 3500);
        }
    });

});

// =========================================================
// LIGHTBOX DE LA GALERIA
// =========================================================
function abrirLightbox(card) {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;
    const img = card.querySelector('img');
    const caption = card.querySelector('.mb-foto-overlay span').textContent;
    document.getElementById('lightbox-img').src = img.src;
    document.getElementById('lightbox-img').alt = img.alt;
    document.getElementById('lightbox-caption').textContent = caption;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function cerrarLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

document.addEventListener('keydown', event => {
    if (event.key === 'Escape') cerrarLightbox();
});