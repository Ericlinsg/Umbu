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
        // O loop será adicionado/removido via JS, não via HTML.
        video.removeAttribute('loop');

        // Adiciona um listener para quando o vídeo terminar
        video.addEventListener('ended', () => {
            console.log('Vídeo de introdução terminou.');
            // Oculta a seção do vídeo
            videoSection.style.display = 'none';

            // Faz a área de conteúdo (categorias) subir
            contentArea.style.marginTop = '0'; // Isso ativará a transição definida no CSS
        });

        // Tenta iniciar a reprodução do vídeo programaticamente
        // Isso é mais robusto contra políticas de autoplay dos navegadores
        if (video.paused) { // Verifica se o vídeo já não está tocando
            video.play().catch(error => {
                // Captura qualquer erro (por exemplo, bloqueio do navegador por autoplay)
                console.error('Erro ao tentar reproduzir o vídeo automaticamente:', error);
                // Se o autoplay falhar (ex: por política de navegador),
                // ocultamos o vídeo e mostramos as categorias imediatamente para não ter tela em branco.
                if (videoSection) {
                    videoSection.style.display = 'none';
                }
                if (contentArea) {
                    contentArea.style.marginTop = '0';
                }
            });
        }
    } else {
        console.warn('Elemento de vídeo com ID "introVideo" não encontrado. As categorias aparecerão no topo.');
        // Se o vídeo não existe ou há um problema, garanta que as categorias estejam na posição inicial correta
        if (videoSection) {
            videoSection.style.display = 'none'; // Esconde a seção de vídeo se ela estiver lá sem o vídeo
        }
        if (contentArea) {
            contentArea.style.marginTop = '0';
        }
    }

    // --- Lógica do Carrossel ---
    const track = document.querySelector('.carousel-track');
    const cards = Array.from(track.children); // Transforma HTMLCollection em Array para usar indexOf
    const prevButton = document.querySelector('.carousel-button.prev');
    const nextButton = document.querySelector('.carousel-button.next');
    const cardWidth = cards[0] ? cards[0].offsetWidth + parseInt(getComputedStyle(track).gap) : 0; // Largura do card + gap
    let currentIndex = 0; // Começa no primeiro card
    const visibleCards = 3; // Quantidade de cards visíveis de uma vez (ajuste conforme seu CSS)

    // Ajusta a largura do track para garantir o espaçamento correto
    // track.style.width = `calc(${cardWidth}px * ${cards.length} + ${parseInt(getComputedStyle(track).gap) * (cards.length - 1)}px)`;

    function updateCarousel() {
        // Calcula a posição de translação. Multiplica pela largura do card e pelo gap
        const offset = -currentIndex * cardWidth;
        track.style.transform = `translateX(${offset}px)`;

        // Atualiza a visibilidade dos botões
        prevButton.style.display = currentIndex > 0 ? 'flex' : 'none';
        nextButton.style.display = currentIndex < cards.length - visibleCards ? 'flex' : 'none';
    }

    // Navegação com botões
    if (nextButton) {
        nextButton.addEventListener('click', () => {
            if (currentIndex < cards.length - visibleCards) {
                currentIndex++;
                updateCarousel();
            }
        });
    }

    if (prevButton) {
        prevButton.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateCarousel();
            }
        });
    }

    // Funcionalidade de Rolagem por Arrasto (Drag/Swipe) para dispositivos móveis
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationID;

    track.addEventListener('mousedown', (e) => {
        startPos = e.clientX;
        isDragging = true;
        animationID = requestAnimationFrame(animation);
        track.style.cursor = 'grabbing'; // Muda o cursor para indicar arraste
    });

    track.addEventListener('mouseup', () => {
        isDragging = false;
        cancelAnimationFrame(animationID);
        track.style.cursor = 'grab'; // Volta o cursor ao normal
        snapToNearestCard();
    });

    track.addEventListener('mouseleave', () => {
        if (isDragging) {
            isDragging = false;
            cancelAnimationFrame(animationID);
            track.style.cursor = 'grab';
            snapToNearestCard();
        }
    });

    track.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const currentPosition = e.clientX;
        currentTranslate = prevTranslate + currentPosition - startPos;
    });

    // Touch events para mobile
    track.addEventListener('touchstart', (e) => {
        startPos = e.touches[0].clientX;
        isDragging = true;
        animationID = requestAnimationFrame(animation);
    }, { passive: true });

    track.addEventListener('touchend', () => {
        isDragging = false;
        cancelAnimationFrame(animationID);
        snapToNearestCard();
    });

    track.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const currentPosition = e.touches[0].clientX;
        currentTranslate = prevTranslate + currentPosition - startPos;
    });

    function animation() {
        // Limita o arraste para não ir muito além das bordas
        const minTranslate = -(cards.length - visibleCards) * cardWidth;
        const maxTranslate = 0;

        currentTranslate = Math.max(Math.min(currentTranslate, maxTranslate), minTranslate);

        track.style.transform = `translateX(${currentTranslate}px)`;
        if (isDragging) {
            requestAnimationFrame(animation);
        }
    }

    function snapToNearestCard() {
        prevTranslate = currentTranslate;
        const movedBy = currentTranslate % cardWidth; // Quanto foi arrastado em relação ao card mais próximo
        let targetIndex = Math.round(Math.abs(currentTranslate) / cardWidth);

        // Garante que o índice não ultrapasse os limites
        targetIndex = Math.max(0, Math.min(targetIndex, cards.length - visibleCards));

        currentIndex = targetIndex;
        updateCarousel(); // Move o carrossel para a posição final do card
    }

    // Inicializa o carrossel na posição correta ao carregar a página
    updateCarousel();
});