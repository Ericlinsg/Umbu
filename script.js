document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM totalmente carregado. Iniciando script.js - Hover Interativo.');

    // --- Elementos do Vídeo e Categorias ---
    const video = document.getElementById('introVideo');
    const categoriesCarousel = document.getElementById('categoriesCarousel');
    const contentArea = document.querySelector('.content-area'); // O container das categorias
    const videoSection = document.querySelector('.video-section'); // A seção que contém o vídeo

    // --- Lógica de reprodução do vídeo e transição ---
    if (video) {
        // Remove o atributo 'loop' caso ele ainda esteja presente no HTML (boa prática)
        video.removeAttribute('loop');

        // Adiciona um listener para quando o vídeo terminar
        video.addEventListener('ended', () => {
            console.log('Vídeo de introdução terminou.');
            // Oculta a seção do vídeo
            videoSection.style.display = 'none';

            // Faz a área de conteúdo (categorias) subir
            contentArea.style.marginTop = '0'; // Isso ativará a transição definida no CSS

            // Optional: Remove a video element completely from DOM to free up resources
            // videoSection.parentNode.removeChild(videoSection);
        });

        // Se o vídeo não tiver autoplay (ou se quiser garantir), você pode iniciá-lo aqui.
        // if (video.paused) {
        //     video.play().catch(error => {
        //         console.error('Erro ao tentar reproduzir o vídeo automaticamente:', error);
        //     });
        // }
    } else {
        console.warn('Elemento de vídeo com ID "introVideo" não encontrado. As categorias aparecerão no topo.');
        // Se o vídeo não existe, garanta que as categorias estejam na posição inicial correta
        contentArea.style.marginTop = '0';
        if (videoSection) {
            videoSection.style.display = 'none'; // Esconde a seção de vídeo se ela estiver lá sem o vídeo
        }
    }


    // --- Lógica do Carrossel de Categorias ---
    const track = document.querySelector('.carousel-track');
    const cards = Array.from(track.children);
    const prevButton = document.querySelector('.carousel-button.prev');
    const nextButton = document.querySelector('.carousel-button.next');

    if (cards.length === 0) {
        console.error('Nenhum card encontrado com a classe .carousel-card dentro de .carousel-track. Verifique seu HTML.');
        return;
    }

    console.log(`Encontrados ${cards.length} cards.`);

    let currentIndex = 1;

    let isHovering = false;
    let hoveredCard = null;

    function updateCarousel() {
        console.log('updateCarousel chamado. currentIndex:', currentIndex);

        cards.forEach(card => card.classList.remove('active'));

        if (cards[currentIndex]) {
            cards[currentIndex].classList.add('active');
            console.log('Card ativo:', cards[currentIndex].querySelector('p').innerText.replace(/\n/g, ' '));
        } else {
            console.warn('currentIndex fora do limite:', currentIndex);
            currentIndex = Math.max(0, Math.min(currentIndex, cards.length - 1));
            cards[currentIndex].classList.add('active');
        }

        const activeCard = cards[currentIndex];
        if (activeCard) {
            const trackContainerWidth = track.parentElement.offsetWidth;
            const activeCardCenterInTrack = activeCard.offsetLeft + (activeCard.offsetWidth / 2);
            const visibleAreaCenter = trackContainerWidth / 2;
            const newOffset = visibleAreaCenter - activeCardCenterInTrack;

            track.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            track.style.transform = `translateX(${newOffset}px)`;
            console.log(`Calculated track translateX: ${newOffset}px`);
        } else {
            console.error('Card ativo não encontrado para centralização. currentIndex:', currentIndex);
        }

        prevButton.disabled = currentIndex === 0;
        nextButton.disabled = currentIndex === cards.length - 1;
        console.log(`Botões: Prev Disabled = ${prevButton.disabled}, Next Disabled = ${nextButton.disabled}`);
    }

    prevButton.addEventListener('click', () => {
        if (currentIndex > 0)