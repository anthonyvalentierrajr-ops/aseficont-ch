document.addEventListener('DOMContentLoaded', () => {

    // =========================================================
    // 1. MENÚ HAMBURGUESA
    // =========================================================
    const menuBtn  = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');

    menuBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        navLinks.classList.toggle('active');
        menuBtn.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
        if (navLinks && !navLinks.contains(e.target) && !menuBtn.contains(e.target)) {
            navLinks.classList.remove('active');
            menuBtn.classList.remove('active');
        }
    });

    // =========================================================
    // 2. DROPDOWN MENÚ (desktop hover / mobile click)
    // =========================================================
    document.querySelectorAll('.nav-dropdown').forEach(drop => {
        const link = drop.querySelector('a');
        link?.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                drop.classList.toggle('active');
            }
        });
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
        document.querySelectorAll('.nav-links a').forEach(a => {
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
    // 8. FORMULARIO — Feedback visual
    // =========================================================
    document.getElementById('contactForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = e.target.querySelector('.btn-submit');
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> <span>¡Enviado con éxito!</span>';
        btn.style.background = 'linear-gradient(135deg, #2e7d32, #388e3c)';
        btn.disabled = true;
        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.style.background = '';
            btn.disabled = false;
            e.target.reset();
        }, 3500);
    });

});