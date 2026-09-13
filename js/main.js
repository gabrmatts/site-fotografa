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
       NAVEGAÇÃO ATIVA - Detectar seção atual
    ====================================================== */

    function updateActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        const navItems = document.querySelectorAll('.nav-item');

        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= 200 && rect.bottom >= 200) {
                navItems.forEach(item => item.classList.remove('active'));
                const activeLink = document.querySelector(`.nav-link-new[href="#${section.id}"]`);
                if (activeLink) {
                    activeLink.closest('.nav-item').classList.add('active');
                }
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
       CARROSSEL HORIZONTAL (Swipe automático)
    ====================================================== */

    const carousel = document.querySelector('.portfolio-carousel');

    /* Carrossel funciona com scroll nativo + swipe */


    /* =====================================================
       FILTRO DO PORTFÓLIO
    ====================================================== */

    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioCards = document.querySelectorAll('.portfolio-card');
    let activeImages = [];

    function updateActiveImages() {
        activeImages = Array.from(portfolioCards)
            .filter(card => !card.classList.contains('hidden'))
            .map(card => card.querySelector('img'))
            .filter(Boolean);
    }

    filterBtns.forEach(button => {
        button.addEventListener('click', () => {
            filterBtns.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-selected', 'false');
            });

            button.classList.add('active');
            button.setAttribute('aria-selected', 'true');

            const filterValue = button.dataset.filter;

            portfolioCards.forEach(card => {
                const category = card.dataset.category;
                const shouldHide = filterValue !== 'all' && category !== filterValue;

                if (shouldHide) {
                    card.classList.add('hidden');
                } else {
                    card.classList.remove('hidden');
                }
            });

            updateActiveImages();

            // Scroll suave para o carrossel
            if (carousel) {
                carousel.scrollTo({ left: 0, behavior: 'smooth' });
            }
        });
    });

    updateActiveImages();


    /* =====================================================
       LIGHTBOX
    ====================================================== */

    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.querySelector('.lightbox-close');
    const prevBtn2 = document.querySelector('.lightbox-prev');
    const nextBtn2 = document.querySelector('.lightbox-next');
    let currentIndex = 0;

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
        if (!activeImages.length) return;
        currentIndex = (currentIndex + 1) % activeImages.length;
        openLightbox(activeImages[currentIndex]);
    }

    function showPreviousImage() {
        if (!activeImages.length) return;
        currentIndex = (currentIndex - 1 + activeImages.length) % activeImages.length;
        openLightbox(activeImages[currentIndex]);
    }

    portfolioCards.forEach(card => {
        card.addEventListener('click', () => {
            const image = card.querySelector('img');
            if (!image) return;

            updateActiveImages();
            currentIndex = activeImages.indexOf(image);
            openLightbox(image);
        });
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', closeLightbox);
    }

    if (nextBtn2) {
        nextBtn2.addEventListener('click', showNextImage);
    }

    if (prevBtn2) {
        prevBtn2.addEventListener('click', showPreviousImage);
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
       SWIPE NO CARROSSEL (MOBILE)
    ====================================================== */

    if (carousel) {
        let touchStart = 0;

        carousel.addEventListener('touchstart', (e) => {
            touchStart = e.touches[0].clientX;
        }, { passive: true });

        carousel.addEventListener('touchend', (e) => {
            const touchEnd = e.changedTouches[0].clientX;
            const diff = touchStart - touchEnd;

            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    nextBtn.click();
                } else {
                    prevBtn.click();
                }
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


    /* =====================================================
       AJUSTE DE PADDING PARA MOBILE COM NOTCH
    ====================================================== */

    if (navigator.standalone || window.navigator.userAgent.includes('iPhone')) {
        const viewportMeta = document.querySelector('meta[name="viewport"]');
        if (viewportMeta) {
            viewportMeta.setAttribute('content', 
                'width=device-width, initial-scale=1.0, viewport-fit=cover');
        }
    }

});