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

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks) navLinks.classList.remove('active');
            if (menuBtn) menuBtn.classList.remove('active');
        });
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
});