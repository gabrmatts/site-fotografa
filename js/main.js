document.addEventListener('DOMContentLoaded', () => {

    /* =====================================================
       CONFIGURAÇÃO DO WHATSAPP
    ====================================================== */

    const WHATSAPP_NUMBER = '5511999999999';

    const WHATSAPP_MESSAGE = encodeURIComponent(
        'Olá, Eduarda! Gostaria de conversar sobre um ensaio e conhecer mais sobre o seu trabalho.'
    );


    const whatsappLinks = document.querySelectorAll('.whatsapp-link');

    whatsappLinks.forEach(link => {

        link.href =
            `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`;

        link.target = '_blank';
        link.rel = 'noopener noreferrer';

    });


    /* =====================================================
       HEADER
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

    window.addEventListener(
        'scroll',
        updateHeader,
        { passive: true }
    );

    updateHeader();


    /* =====================================================
       MOBILE BOTTOM NAV
    ====================================================== */

    const mobileNavItems =
        document.querySelectorAll(
            '.mobile-nav-item[data-section]'
        );

    const sections =
        document.querySelectorAll(
            'main section[id]'
        );


    function updateMobileNav() {

        if (!mobileNavItems.length) return;

        const scrollPosition =
            window.scrollY +
            window.innerHeight * 0.35;

        let currentSection = 'hero';


        sections.forEach(section => {

            const sectionTop =
                section.offsetTop;

            const sectionBottom =
                sectionTop +
                section.offsetHeight;


            if (
                scrollPosition >= sectionTop &&
                scrollPosition < sectionBottom
            ) {

                currentSection = section.id;

            }

        });


        mobileNavItems.forEach(item => {

            const isActive =
                item.dataset.section === currentSection;

            item.classList.toggle(
                'active',
                isActive
            );


            if (isActive) {

                item.setAttribute(
                    'aria-current',
                    'page'
                );

            } else {

                item.removeAttribute(
                    'aria-current'
                );

            }

        });

    }


    window.addEventListener(
        'scroll',
        updateMobileNav,
        { passive: true }
    );


    window.addEventListener(
        'resize',
        updateMobileNav
    );


    updateMobileNav();


    /* =====================================================
       NAVEGAÇÃO SUAVE
    ====================================================== */

    const allAnchorLinks =
        document.querySelectorAll(
            'a[href^="#"]'
        );


    allAnchorLinks.forEach(link => {

        link.addEventListener('click', event => {

            const targetId =
                link.getAttribute('href');

            if (
                !targetId ||
                targetId === '#'
            ) {
                return;
            }


            const target =
                document.querySelector(targetId);

            if (!target) return;


            event.preventDefault();


            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });

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


    const observer =
        new IntersectionObserver(
            (entries, observer) => {

                entries.forEach(entry => {

                    if (!entry.isIntersecting) {
                        return;
                    }


                    entry.target.classList.add(
                        'visible'
                    );


                    observer.unobserve(
                        entry.target
                    );

                });

            },
            observerOptions
        );


    document
        .querySelectorAll('.fade-up')
        .forEach(element => {

            observer.observe(element);

        });


    /* =====================================================
       FILTRO DO PORTFÓLIO
    ====================================================== */

    const filterBtns =
        document.querySelectorAll(
            '.filter-btn'
        );

    const portfolioItems =
        document.querySelectorAll(
            '.portfolio-item'
        );


    let activeImages = [];


    function updateActiveImages() {

        activeImages =
            Array
                .from(portfolioItems)
                .filter(
                    item =>
                        !item.classList.contains('hidden')
                )
                .map(
                    item =>
                        item.querySelector('img')
                );

    }


    filterBtns.forEach(button => {

        button.addEventListener(
            'click',
            () => {

                filterBtns.forEach(btn => {

                    btn.classList.remove(
                        'active'
                    );

                    btn.setAttribute(
                        'aria-selected',
                        'false'
                    );

                });


                button.classList.add(
                    'active'
                );

                button.setAttribute(
                    'aria-selected',
                    'true'
                );


                const filterValue =
                    button.dataset.filter;


                portfolioItems.forEach(item => {

                    const category =
                        item.dataset.category;


                    const shouldHide =
                        filterValue !== 'all' &&
                        category !== filterValue;


                    if (shouldHide) {

                        item.classList.add(
                            'hidden'
                        );

                    } else {

                        item.classList.remove(
                            'hidden'
                        );

                    }

                });


                updateActiveImages();

            }
        );

    });


    updateActiveImages();


    /* =====================================================
       LIGHTBOX
    ====================================================== */

    const lightbox =
        document.getElementById(
            'lightbox'
        );

    const lightboxImg =
        document.getElementById(
            'lightbox-img'
        );

    const closeBtn =
        document.querySelector(
            '.lightbox-close'
        );

    const prevBtn =
        document.querySelector(
            '.lightbox-prev'
        );

    const nextBtn =
        document.querySelector(
            '.lightbox-next'
        );


    let currentIndex = 0;


    function openLightbox(image) {

        if (!lightbox || !lightboxImg) {
            return;
        }


        lightboxImg.src =
            image.src;

        lightboxImg.alt =
            image.alt ||
            'Fotografia ampliada';


        lightbox.classList.add(
            'active'
        );

        lightbox.setAttribute(
            'aria-hidden',
            'false'
        );


        document.body.style.overflow =
            'hidden';

    }


    function closeLightbox() {

        if (!lightbox) return;


        lightbox.classList.remove(
            'active'
        );

        lightbox.setAttribute(
            'aria-hidden',
            'true'
        );


        document.body.style.overflow =
            '';

    }


    function showNextImage() {

        if (!activeImages.length) {
            return;
        }


        currentIndex =
            (currentIndex + 1) %
            activeImages.length;


        openLightbox(
            activeImages[currentIndex]
        );

    }


    function showPreviousImage() {

        if (!activeImages.length) {
            return;
        }


        currentIndex =
            (
                currentIndex -
                1 +
                activeImages.length
            ) %
            activeImages.length;


        openLightbox(
            activeImages[currentIndex]
        );

    }


    portfolioItems.forEach(item => {

        item.addEventListener(
            'click',
            () => {

                const image =
                    item.querySelector('img');

                if (!image) return;


                updateActiveImages();


                currentIndex =
                    activeImages.indexOf(
                        image
                    );


                openLightbox(image);

            }
        );

    });


    if (closeBtn) {

        closeBtn.addEventListener(
            'click',
            closeLightbox
        );

    }


    if (nextBtn) {

        nextBtn.addEventListener(
            'click',
            showNextImage
        );

    }


    if (prevBtn) {

        prevBtn.addEventListener(
            'click',
            showPreviousImage
        );

    }


    /* Fecha clicando no fundo */

    if (lightbox) {

        lightbox.addEventListener(
            'click',
            event => {

                if (
                    event.target === lightbox ||
                    event.target.classList.contains(
                        'lightbox-content'
                    )
                ) {

                    closeLightbox();

                }

            }
        );

    }


    /* =====================================================
       TECLADO
    ====================================================== */

    document.addEventListener(
        'keydown',
        event => {

            if (
                !lightbox ||
                !lightbox.classList.contains(
                    'active'
                )
            ) {
                return;
            }


            if (event.key === 'Escape') {

                closeLightbox();

            }


            if (event.key === 'ArrowRight') {

                showNextImage();

            }


            if (event.key === 'ArrowLeft') {

                showPreviousImage();

            }

        }
    );


    /* =====================================================
       SWIPE NO LIGHTBOX — MOBILE
    ====================================================== */

    let touchStartX = 0;
    let touchEndX = 0;


    if (lightbox) {

        lightbox.addEventListener(
            'touchstart',
            event => {

                touchStartX =
                    event.changedTouches[0].screenX;

            },
            { passive: true }
        );


        lightbox.addEventListener(
            'touchend',
            event => {

                touchEndX =
                    event.changedTouches[0].screenX;


                const distance =
                    touchEndX -
                    touchStartX;


                if (Math.abs(distance) < 50) {
                    return;
                }


                if (distance < 0) {

                    showNextImage();

                } else {

                    showPreviousImage();

                }

            },
            { passive: true }
        );

    }

});