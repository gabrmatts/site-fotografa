document.addEventListener('DOMContentLoaded', () => {

    /* --- CONFIGURAÇÃO DO WHATSAPP --- */
    // Altere este número para o número da fotógrafa. Formato: DDI + DDD + NÚMERO
    const WHATSAPP_NUMBER = '5511999999999'; 
    const WHATSAPP_MESSAGE = encodeURIComponent('Olá, Eduarda! Gostaria de conversar sobre um ensaio e conhecer mais sobre o seu trabalho.');
    
    // Aplica o link em todos os botões que tenham a classe 'whatsapp-link'
    const whatsappLinks = document.querySelectorAll('.whatsapp-link');
    whatsappLinks.forEach(link => {
        link.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
    });

    /* --- HEADER SCROLL & MOBILE MENU --- */
    const header = document.getElementById('header');
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    /* --- ANIMAÇÕES FADE-UP NO SCROLL --- */
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-up').forEach(element => {
        observer.observe(element);
    });

    /* --- FILTRO DO PORTFÓLIO --- */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove a classe active dos botões e adiciona no clicado
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            portfolioItems.forEach(item => {
                // Remove hidden para recalcular e adiciona as animações de volta para suavidade
                item.classList.remove('hidden');
                
                if (filterValue !== 'all' && item.getAttribute('data-category') !== filterValue) {
                    item.classList.add('hidden');
                }
            });
            
            // Atualiza array de imagens ativas pro Lightbox
            updateActiveImages();
        });
    });

    /* --- LIGHTBOX MODERNO --- */
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.querySelector('.lightbox-close');
    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');
    
    let activeImages = [];
    let currentIndex = 0;

    // Atualiza a lista de imagens que estão visíveis após filtrar
    function updateActiveImages() {
        activeImages = Array.from(portfolioItems).filter(item => !item.classList.contains('hidden')).map(item => item.querySelector('img'));
    }

    // Inicializa as imagens
    updateActiveImages();

    // Eventos de clique nas imagens do portfólio
    portfolioItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            currentIndex = activeImages.indexOf(img);
            openLightbox(img.src);
        });
    });

    function openLightbox(src) {
        lightboxImg.src = src;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Evita scroll da página
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = ''; 
    }

    function showNextImage() {
        if (activeImages.length === 0) return;
        currentIndex = (currentIndex + 1) % activeImages.length;
        lightboxImg.src = activeImages[currentIndex].src;
    }

    function showPrevImage() {
        if (activeImages.length === 0) return;
        currentIndex = (currentIndex - 1 + activeImages.length) % activeImages.length;
        lightboxImg.src = activeImages[currentIndex].src;
    }

    closeBtn.addEventListener('click', closeLightbox);
    nextBtn.addEventListener('click', showNextImage);
    prevBtn.addEventListener('click', showPrevImage);

    // Fecha ao clicar fora da imagem
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target === lightbox.querySelector('.lightbox-content')) {
            closeLightbox();
        }
    });

    // Navegação via Teclado
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') showNextImage();
        if (e.key === 'ArrowLeft') showPrevImage();
    });
});