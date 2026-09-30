document.addEventListener('DOMContentLoaded', () => {

    /* =====================================================
       Executa cada módulo isolado: se um falhar, os outros
       continuam funcionando normalmente (ex.: se o CDN dos
       ícones falhar, o menu, os filtros e o lightbox não
       devem parar de funcionar por causa disso).
    ====================================================== */
    function safeInit(fn, label) {
        try {
            fn();
        } catch (err) {
            console.error(`[main.js] Falha ao iniciar "${label}":`, err);
        }
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* =====================================================
       FEATHER ICONS
    ====================================================== */
    safeInit(function initFeatherIcons() {
        if (typeof feather !== 'undefined') {
            feather.replace();
        }
    }, 'ícones (feather)');

    /* =====================================================
       WHATSAPP LINKS
    ====================================================== */
    safeInit(function initWhatsappLinks() {
        const WHATSAPP_NUMBER = '5511999999999';
        const WHATSAPP_MESSAGE = encodeURIComponent(
            'Olá, Eduarda! Gostaria de conversar sobre um ensaio e conhecer mais sobre o seu trabalho.'
        );

        document.querySelectorAll('.whatsapp-link').forEach(link => {
            link.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
        });
    }, 'links do WhatsApp');

    /* =====================================================
       SLIDESHOW "SOBRE" — troca automática das fotos
    ====================================================== */
    safeInit(function initSobreSlideshow() {
        const sobreSlideshow = document.querySelector('.sobre-slideshow');
        if (!sobreSlideshow) return;

        const slides = sobreSlideshow.querySelectorAll('.slide');
        if (slides.length > 1 && !prefersReducedMotion) {
            let activeSlide = 0;
            setInterval(() => {
                slides[activeSlide].classList.remove('active');
                activeSlide = (activeSlide + 1) % slides.length;
                slides[activeSlide].classList.add('active');
            }, 4000);
        }
    }, 'slideshow da seção Sobre');

    /* =====================================================
       PORTFÓLIO — filtro, barra de progresso e auto-scroll
    ====================================================== */
    safeInit(function initPortfolioCarousel() {
        const portfolioTrack = document.querySelector('.portfolio-carousel');
        if (!portfolioTrack) return;

        const progressBar = document.querySelector('.carousel-progress-bar');
        const carouselHint = document.querySelector('.carousel-hint');

        function updateCarouselProgress() {
            if (!progressBar) return;
            const maxScroll = portfolioTrack.scrollWidth - portfolioTrack.clientWidth;
            const ratio = maxScroll > 0 ? portfolioTrack.scrollLeft / maxScroll : 0;
            progressBar.style.width = `${Math.min(100, Math.max(8, ratio * 100))}%`;
        }

        function applyFilter(category) {
            const cards = portfolioTrack.querySelectorAll('.portfolio-card');
            cards.forEach(card => {
                const matches = category === 'all' || card.dataset.category === category;
                if (matches) {
                    card.style.display = '';
                    requestAnimationFrame(() => card.classList.remove('is-hidden'));
                } else {
                    card.classList.add('is-hidden');
                    setTimeout(() => {
                        if (card.classList.contains('is-hidden')) card.style.display = 'none';
                    }, 350);
                }
            });

            portfolioTrack.scrollTo({ left: 0, behavior: 'smooth' });
            setTimeout(updateCarouselProgress, 400);
        }

        /* --- Dropdown de filtro customizado --- */
        const filterToggle = document.getElementById('filterToggle');
        const filterMenu = document.getElementById('filterMenu');
        const filterToggleLabel = document.querySelector('.filter-toggle-label');

        if (filterToggle && filterMenu) {
            const filterOptions = Array.from(filterMenu.querySelectorAll('.filter-option'));
            filterOptions.forEach((opt, i) => opt.setAttribute('tabindex', i === 0 ? '0' : '-1'));

            function openFilterMenu() {
                filterMenu.classList.add('open');
                filterToggle.setAttribute('aria-expanded', 'true');
            }

            function closeFilterMenu({ focusToggle = false } = {}) {
                filterMenu.classList.remove('open');
                filterToggle.setAttribute('aria-expanded', 'false');
                if (focusToggle) filterToggle.focus();
            }

            function selectFilterOption(option) {
                filterOptions.forEach(opt => {
                    opt.classList.remove('is-selected');
                    opt.setAttribute('aria-selected', 'false');
                    opt.setAttribute('tabindex', '-1');
                });
                option.classList.add('is-selected');
                option.setAttribute('aria-selected', 'true');
                option.setAttribute('tabindex', '0');
                if (filterToggleLabel) filterToggleLabel.textContent = option.querySelector('span').textContent;
                applyFilter(option.dataset.filter);
            }

            filterToggle.addEventListener('click', () => {
                filterMenu.classList.contains('open') ? closeFilterMenu() : openFilterMenu();
            });

            filterOptions.forEach((option, i) => {
                option.addEventListener('click', () => {
                    selectFilterOption(option);
                    closeFilterMenu({ focusToggle: true });
                });

                option.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        selectFilterOption(option);
                        closeFilterMenu({ focusToggle: true });
                    } else if (e.key === 'ArrowDown') {
                        e.preventDefault();
                        (filterOptions[i + 1] || filterOptions[0]).focus();
                    } else if (e.key === 'ArrowUp') {
                        e.preventDefault();
                        (filterOptions[i - 1] || filterOptions[filterOptions.length - 1]).focus();
                    } else if (e.key === 'Escape') {
                        closeFilterMenu({ focusToggle: true });
                    }
                });
            });

            document.addEventListener('click', (e) => {
                if (!filterMenu.classList.contains('open')) return;
                if (!filterMenu.contains(e.target) && !filterToggle.contains(e.target)) {
                    closeFilterMenu();
                }
            });

            filterToggle.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openFilterMenu();
                    const selected = filterOptions.find(opt => opt.classList.contains('is-selected'));
                    if (selected) selected.focus();
                } else if (e.key === 'Escape') {
                    closeFilterMenu();
                }
            });
        }

        /* --- Barra de progresso --- */
        portfolioTrack.addEventListener('scroll', updateCarouselProgress, { passive: true });
        updateCarouselProgress();

        /* --- Hint "Deslize para explorar" --- */
        let hintDismissed = false;
        function hideHint() {
            if (hintDismissed) return;
            hintDismissed = true;
            if (carouselHint) carouselHint.classList.add('hint-hidden');
        }

        /* --- Rolagem automática (pausa ao interagir) --- */
        if (!prefersReducedMotion) {
            const SPEED = 0.45; // px por frame
            let autoScroll = true;
            let resumeTimeout;

            function step() {
                if (autoScroll) {
                    const maxScroll = portfolioTrack.scrollWidth - portfolioTrack.clientWidth;
                    if (maxScroll > 1) {
                        portfolioTrack.scrollLeft += SPEED;
                        if (portfolioTrack.scrollLeft >= maxScroll - 1) {
                            portfolioTrack.scrollLeft = 0;
                        }
                    }
                }
                requestAnimationFrame(step);
            }
            requestAnimationFrame(step);

            function pauseAutoScroll(resumeDelay) {
                autoScroll = false;
                hideHint();
                clearTimeout(resumeTimeout);
                resumeTimeout = setTimeout(() => { autoScroll = true; }, resumeDelay);
            }

            ['pointerdown', 'wheel', 'touchstart'].forEach(evt => {
                portfolioTrack.addEventListener(evt, () => pauseAutoScroll(3500), { passive: true });
            });
            portfolioTrack.addEventListener('mouseenter', () => pauseAutoScroll(60000));
            portfolioTrack.addEventListener('mouseleave', () => pauseAutoScroll(600));
        } else {
            hideHint();
        }
    }, 'carrossel do portfólio (filtro, progresso e auto-scroll)');

    /* =====================================================
       HEADER SCROLL
    ====================================================== */
    safeInit(function initHeaderScroll() {
        const header = document.getElementById('header');
        if (!header) return;

        function updateHeader() {
            header.classList.toggle('scrolled', window.scrollY > 50);
        }

        window.addEventListener('scroll', updateHeader, { passive: true });
        updateHeader();
    }, 'header ao rolar');

    /* =====================================================
       MENU MOBILE
    ====================================================== */
    safeInit(function initMobileMenu() {
        const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        const mobileNav = document.querySelector('.mobile-nav');
        if (!mobileMenuToggle || !mobileNav) return;

        function closeMobileMenu() {
            mobileMenuToggle.classList.remove('active');
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
            mobileNav.classList.remove('active');
            document.body.style.overflow = '';
        }

        mobileMenuToggle.addEventListener('click', () => {
            const isOpen = mobileNav.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active', isOpen);
            mobileMenuToggle.setAttribute('aria-expanded', String(isOpen));
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });

        mobileNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });

        document.addEventListener('click', (e) => {
            if (mobileNav.classList.contains('active') &&
                !mobileNav.contains(e.target) &&
                !mobileMenuToggle.contains(e.target)) {
                closeMobileMenu();
            }
        });
    }, 'menu mobile');

    /* =====================================================
       NAVEGAÇÃO ATIVA — Scroll Spy
    ====================================================== */
    safeInit(function initScrollSpy() {
        const navItems = document.querySelectorAll('.nav-item');
        const sections = document.querySelectorAll('section[id]');

        function updateActiveNav() {
            let currentSection = '';
            sections.forEach(section => {
                const rect = section.getBoundingClientRect();
                if (rect.top <= window.innerHeight / 3 && rect.bottom >= window.innerHeight / 3) {
                    currentSection = section.getAttribute('id');
                }
            });
            navItems.forEach(item => {
                const link = item.querySelector('a');
                item.classList.toggle('active', !!link && link.getAttribute('href') === `#${currentSection}`);
            });
        }

        window.addEventListener('scroll', updateActiveNav, { passive: true });
        updateActiveNav();
    }, 'navegação ativa (scroll spy)');

    /* =====================================================
       NAVEGAÇÃO SUAVE
    ====================================================== */
    safeInit(function initSmoothScroll() {
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
    }, 'rolagem suave');

    /* =====================================================
       FADE-UP / SCROLL REVEAL
    ====================================================== */
    safeInit(function initFadeUp() {
        const revealObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('visible');
                obs.unobserve(entry.target);
            });
        }, {
            root: null,
            rootMargin: '0px 0px -5% 0px',
            threshold: 0.12
        });

        document.querySelectorAll('.fade-up').forEach(element => {
            revealObserver.observe(element);
        });
    }, 'animações ao rolar (fade-up)');

    /* =====================================================
       LIGHTBOX
    ====================================================== */
    safeInit(function initLightbox() {
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

                allImages = Array.from(portfolioCards)
                    .filter(c => !c.classList.contains('is-hidden') && c.style.display !== 'none')
                    .map(c => c.querySelector('img'))
                    .filter(Boolean);
                currentIndex = allImages.indexOf(image);
                openLightbox(image);
            });
        });

        if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
        if (nextBtn) nextBtn.addEventListener('click', showNextImage);
        if (prevBtn) prevBtn.addEventListener('click', showPreviousImage);

        if (lightbox) {
            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
                    closeLightbox();
                }
            });
        }

        document.addEventListener('keydown', (e) => {
            if (!lightbox || !lightbox.classList.contains('active')) return;

            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') showNextImage();
            if (e.key === 'ArrowLeft') showPreviousImage();
        });

        let touchStartX = 0;

        if (lightbox) {
            lightbox.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });

            lightbox.addEventListener('touchend', (e) => {
                const touchEndX = e.changedTouches[0].screenX;
                const distance = touchEndX - touchStartX;

                if (Math.abs(distance) < 50) return;

                if (distance < 0) {
                    showNextImage();
                } else {
                    showPreviousImage();
                }
            }, { passive: true });
        }
    }, 'lightbox');

});