document.addEventListener('DOMContentLoaded', () => {

    // Initialize Feather Icons
    if (typeof feather !== 'undefined') {
        feather.replace();
    }

    /* =====================================================
       CONFIGURAÇÃO DO WHATSAPP
    ====================================================== */

    const WHATSAPP_NUMBER = '5511999999999';
    const WHATSAPP_MESSAGE = encodeURIComponent(
        'Olá, Eduarda! Gostaria de conversar sobre um ensaio e conhecer mais sobre o seu trabalho.'
    );

    const whatsappLinks = document.querySelectorAll('.whatsapp-link');
    whatsappLinks.forEach(link => {
        link.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
    });


    /* =====================================================
       HEADER SCROLL
    ====================================================== */

    const header = document.getElementById('header');

    function updateHeader() {
        if (!header) return;
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', updateHeader, { passive: true });
    updateHeader();


    /* =====================================================
       MENU MOBILE
    ====================================================== */

    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');

    if (mobileMenuToggle && mobileNav) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenuToggle.classList.toggle('active');
            mobileNav.classList.toggle('active');
        });

        // Fechar ao clicar em um link
        document.querySelectorAll('.mobile-nav a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuToggle.classList.remove('active');
                mobileNav.classList.remove('active');
            });
        });

        // Fechar ao clicar fora
        document.addEventListener('click', (e) => {
            if (!mobileNav.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                mobileMenuToggle.classList.remove('active');
                mobileNav.classList.remove('active');
            }
        });
    }


    /* =====================================================
       NAVEGAÇÃO ATIVA - Scroll Spy
    ====================================================== */

    function updateActiveNav() {
        const navItems = document.querySelectorAll('.nav-item');
        const sections = document.querySelectorAll('section[id]');
        
        let currentSection = '';
        
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= window.innerHeight / 3 && rect.bottom >= window.innerHeight / 3) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navItems.forEach(item => {
            const link = item.querySelector('a');
            if (link && link.getAttribute('href') === `#${currentSection}`) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav, { passive: true });
    updateActiveNav();

    /* =====================================================
       NAVEGAÇÃO SUAVE
    ====================================================== */

    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (!targetId || targetId === '#') return;

            const target = document.querySelector(targetId);
            if (!target) return;

            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });


    /* =====================================================
       FADE-UP / SCROLL REVEAL
    ====================================================== */

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -5% 0px',
        threshold: 0.12
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        });
    }, observerOptions);

    document.querySelectorAll('.fade-up').forEach(element => {
        observer.observe(element);
    });


    /* =====================================================
       LIGHTBOX
    ====================================================== */

    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.querySelector('.lightbox-close');
    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');
    let currentIndex = 0;
    let allImages = [];

    function openLightbox(image) {
        if (!lightbox || !lightboxImg) return;

        lightboxImg.src = image.src;
        lightboxImg.alt = image.alt || 'Fotografia ampliada';

        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        if (!lightbox) return;
        lightbox.classList.remove('active');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    function showNextImage() {
        if (!allImages.length) return;
        currentIndex = (currentIndex + 1) % allImages.length;
        openLightbox(allImages[currentIndex]);
    }

    function showPreviousImage() {
        if (!allImages.length) return;
        currentIndex = (currentIndex - 1 + allImages.length) % allImages.length;
        openLightbox(allImages[currentIndex]);
    }

    const portfolioCards = document.querySelectorAll('.portfolio-card');
    
    portfolioCards.forEach(card => {
        card.addEventListener('click', () => {
            const image = card.querySelector('img');
            if (!image) return;

            allImages = Array.from(portfolioCards).map(c => c.querySelector('img')).filter(Boolean);
            currentIndex = allImages.indexOf(image);
            openLightbox(image);
        });
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', closeLightbox);
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', showNextImage);
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', showPreviousImage);
    }

    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
                closeLightbox();
            }
        });
    }


    /* =====================================================
       CONTROLES DO TECLADO
    ====================================================== */

    document.addEventListener('keydown', (e) => {
        if (!lightbox || !lightbox.classList.contains('active')) return;

        if (e.key === 'Escape') {
            closeLightbox();
        }
        if (e.key === 'ArrowRight') {
            showNextImage();
        }
        if (e.key === 'ArrowLeft') {
            showPreviousImage();
        }
    });


    /* =====================================================
       SWIPE NO LIGHTBOX (MOBILE)
    ====================================================== */

    let touchStartX = 0;
    let touchEndX = 0;

    if (lightbox) {
        lightbox.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        lightbox.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const distance = touchEndX - touchStartX;

            if (Math.abs(distance) < 50) return;

            if (distance < 0) {
                showNextImage();
            } else {
                showPreviousImage();
            }
        }, { passive: true });
    }


    /* =====================================================
       PERFORMANCE: Lazy Loading
    ====================================================== */

    if ('IntersectionObserver' in window) {
        const images = document.querySelectorAll('img[loading="lazy"]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.loading = 'lazy';
                    observer.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }


    /* =====================================================
       SMOOTH SCROLL BEHAVIOR
    ====================================================== */

    document.documentElement.style.scrollBehavior = 'smooth';

});