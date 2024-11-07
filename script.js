document.addEventListener('DOMContentLoaded', () => {
    const cardsArray = [
        { name: 'image1', img: 'images/image1.jpg' },
        { name: 'image1', img: 'images/image1.jpg' },
        { name: 'image2', img: 'images/image2.jpg' },
        { name: 'image2', img: 'images/image2.jpg' },
        { name: 'image3', img: 'images/image3.jpg' },
        { name: 'image3', img: 'images/image3.jpg' },
        { name: 'image4', img: 'images/image4.jpg' },
        { name: 'image4', img: 'images/image4.jpg' },
        { name: 'image5', img: 'images/image5.jpg' },
        { name: 'image5', img: 'images/image5.jpg' },
        { name: 'image6', img: 'images/image6.jpg' },
        { name: 'image6', img: 'images/image6.jpg' }
    ];

    let matchedCards = 0;
    let firstCard = null;
    let secondCard = null;
    let lockBoard = false;
    let timerInterval;
    let timeElapsed = 0;
    let isPaused = false;

    const gameGrid = [...cardsArray].sort(() => 0.5 - Math.random());
    const gameBoard = document.getElementById('game-board');
    const timerDisplay = document.getElementById('timer-display');
    const pauseButton = document.getElementById('pause-button');

    // Inicia el temporizador
    function startTimer() {
        timerInterval = setInterval(() => {
            if (!isPaused) {
                timeElapsed++;
                updateTimerDisplay();
            }
        }, 1000);
    }

    // Detiene el temporizador
    function stopTimer() {
        clearInterval(timerInterval);
    }

    // Actualiza la visualización del temporizador
    function updateTimerDisplay() {
        const minutes = Math.floor(timeElapsed / 60);
        const seconds = timeElapsed % 60;
        timerDisplay.textContent = `Tiempo: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }

    // Pausar/Reanudar temporizador
    pauseButton.addEventListener('click', () => {
        isPaused = !isPaused;
        pauseButton.textContent = isPaused ? 'Reanudar' : 'Pausar';
    });

    // Crea el tablero de juego
    gameGrid.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.dataset.name = card.name;

        const frontFace = document.createElement('div');
        frontFace.classList.add('front');
        frontFace.style.backgroundImage = 'url(images/reverso.png)';

        const backFace = document.createElement('div');
        backFace.classList.add('back');
        backFace.style.backgroundImage = `url(${card.img})`;

        cardElement.appendChild(frontFace);
        cardElement.appendChild(backFace);
        gameBoard.appendChild(cardElement);

        cardElement.addEventListener('click', flipCard);
    });

    // Inicia el temporizador al cargar el juego
    startTimer();

    // Función para voltear las cartas
    function flipCard() {
        if (lockBoard || this === firstCard) return;
        this.classList.add('flip');

        if (!firstCard) {
            firstCard = this;
            return;
        }

        secondCard = this;
        lockBoard = true;

        checkForMatch();
    }

    // Comprueba si las cartas coinciden
    function checkForMatch() {
        const isMatch = firstCard.dataset.name === secondCard.dataset.name;
        if (isMatch) {
            disableCards();
            matchedCards += 2;
            if (matchedCards === cardsArray.length) endGame();
        } else {
            unflipCards();
        }
    }

    // Deshabilitará las cartas que coincidan
    function disableCards() {
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);
        resetBoard();
    }

    // Volver a voltear las cartas en caso de que no coincidan
    function unflipCards() {
        setTimeout(() => {
            firstCard.classList.remove('flip');
            secondCard.classList.remove('flip');
            resetBoard();
        }, 1000);
    }

    // Reiniciar las variables del tablero
    function resetBoard() {
        [firstCard, secondCard] = [null, null];
        lockBoard = false;
    }

    // Finaliza el juego
    function endGame() {
        stopTimer();
        showCongratulations();
    }

    // Muestra una alerta animada de felicitaciones
    function showCongratulations() {
        const congratsMessage = document.createElement('div');
        congratsMessage.classList.add('congrats-message');
        congratsMessage.innerHTML = `<p>¡Felicidades! Completaste el juego en ${Math.floor(timeElapsed / 60)}:${timeElapsed % 60 < 10 ? '0' : ''}${timeElapsed % 60}.</p>`;
        document.body.appendChild(congratsMessage);
        congratsMessage.classList.add('animate');
    }
});