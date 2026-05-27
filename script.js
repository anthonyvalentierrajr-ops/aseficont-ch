document.addEventListener('DOMContentLoaded', () => {

    // 1. LEER MÁS (SERVICIOS)
    const readMoreBtns = document.querySelectorAll('.btn-read-more');
    readMoreBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const extraInfo = btn.previousElementSibling;
            if (extraInfo) {
                extraInfo.classList.toggle('active');
                btn.innerText = extraInfo.classList.contains('active') ? 'Leer menos' : 'Leer más';
            }
        });
    });

    // 2. CARRUSEL DE TESTIMONIOS (CALIBRADO)
    const track = document.getElementById('trackT');
    const nextBtn = document.getElementById('nextT');
    const prevBtn = document.getElementById('prevT');
    let currentIndex = 0;

    function updateCarousel() {
        if (!track) return;
        const cards = document.querySelectorAll('.testimonial-card');
        if (cards.length === 0) return;
        
        const cardWidth = cards[0].offsetWidth;
        const gap = parseFloat(window.getComputedStyle(track).gap) || 30;
        
        track.style.transform = `translateX(-${currentIndex * (cardWidth + gap)}px)`;
    }

    nextBtn?.addEventListener('click', () => {
        const total = document.querySelectorAll('.testimonial-card').length;
        const visible = window.innerWidth > 1024 ? 3 : (window.innerWidth > 768 ? 2 : 1);
        if (currentIndex < total - visible) {
            currentIndex++;
        } else {
            currentIndex = 0;
        }
        updateCarousel();
    });

    prevBtn?.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
        } else {
            const total = document.querySelectorAll('.testimonial-card').length;
            const visible = window.innerWidth > 1024 ? 3 : (window.innerWidth > 768 ? 2 : 1);
            currentIndex = Math.max(0, total - visible);
        }
        updateCarousel();
    });

    window.addEventListener('resize', () => {
        currentIndex = 0;
        updateCarousel();
    });

    // 3. MENÚ MÓVIL
    const menuBtn = document.getElementById('menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            navLinks.classList.toggle('active');
            menuBtn.classList.toggle('active');
        });

        document.addEventListener('click', (e) => {
            if (!navLinks.contains(e.target) && !menuBtn.contains(e.target)) {
                navLinks.classList.remove('active');
                menuBtn.classList.remove('active');
            }
        });
    }

    // Ajustar scroll para todos los enlaces de ancla y cerrar el menú móvil si está abierto
    const smoothScrollToAnchor = (targetId, behavior = 'smooth') => {
        if (!targetId) return;
        const targetElement = document.getElementById(targetId);
        const headerHeight = document.querySelector('.main-header')?.offsetHeight || 0;

        if (targetElement) {
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            window.scrollTo({ top: targetPosition, behavior });
        }
    };

    const setActiveNavLink = (targetId) => {
        document.querySelectorAll('.nav-links a').forEach(navLink => {
            navLink.classList.toggle('active', navLink.getAttribute('href') === `#${targetId}`);
        });
    };

    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (event) => {
            const targetId = link.getAttribute('href').slice(1);
            if (!targetId) return;

            event.preventDefault();
            smoothScrollToAnchor(targetId);
            setActiveNavLink(targetId);

            if (history.pushState) {
                history.pushState(null, '', `#${targetId}`);
            } else {
                window.location.hash = targetId;
            }

            if (link.closest('.nav-links') && navLinks) {
                navLinks.classList.remove('active');
                if (menuBtn) menuBtn.classList.remove('active');
            }
        });
    });

    if (window.location.hash) {
        const initialHash = window.location.hash.slice(1);
        smoothScrollToAnchor(initialHash, 'auto');
        setActiveNavLink(initialHash);
    }

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-show');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.18,
    });

    document.querySelectorAll('.reveal').forEach(item => {
        revealObserver.observe(item);
    });

    // 4. FAQ (ACORDEÓN)
    document.querySelectorAll('.faq-question').forEach(q => {
        q.addEventListener('click', () => {
            const item = q.parentElement;
            document.querySelectorAll('.faq-item').forEach(i => {
                if(i !== item) {
                    i.classList.remove('active');
                    const otherIcon = i.querySelector('.faq-icon');
                    if(otherIcon) otherIcon.innerText = '+';
                }
            });
            item.classList.toggle('active');
            const icon = q.querySelector('.faq-icon');
            if (icon) icon.innerText = item.classList.contains('active') ? '-' : '+';
        });
    });

    // 5. LIGHTBOX PARA GALERÍA
    const galleryImgs = document.querySelectorAll('.gallery-img');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');

    galleryImgs.forEach(img => {
        img.addEventListener('click', (event) => {
            event.stopPropagation();
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt || '';

            const title = img.dataset.title || '';
            const description = img.dataset.description || '';

            if (lightboxCaption) {
                lightboxCaption.querySelector('h3').textContent = title;
                lightboxCaption.querySelector('p').textContent = description;
                lightboxCaption.style.display = title || description ? 'block' : 'none';
            }

            lightbox.style.display = 'flex';
        });
    });

    lightbox.addEventListener('click', () => {
        lightbox.style.display = 'none';
    });
});