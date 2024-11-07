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

    const gameBoard = document.getElementById('game-board');
    const startButton = document.getElementById('start-game-button');
    const pauseButton = document.getElementById('pause-button');
    const timerDisplay = document.getElementById('timer-display');
    let firstCard = null;
    let secondCard = null;
    let lockBoard = false;
    let isPaused = false;
    let timer;
    let time = 0;
    let matchedPairs = 0;

    // Agregar eventos de inicio y pausa
    startButton.addEventListener('click', startGame);
    pauseButton.addEventListener('click', togglePause);

    // Inicia el juego
    function startGame() {
        resetBoard();
        createBoard();
        resetTimer();
        startTimer();
        startButton.style.display = 'none';  // Ocultar el botón de iniciar
        pauseButton.style.display = 'block'; // Asegurar que el botón de pausar sea visible
        timerDisplay.style.display = 'block'; // Asegurar que el temporizador sea visible al comenzar
    }

    // Crea el tablero de juego
    function createBoard() {
        gameBoard.innerHTML = ''; // Limpiar el tablero previo
        const shuffledCards = [...cardsArray].sort(() => 0.5 - Math.random());
        shuffledCards.forEach(card => {
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
        matchedPairs = 0;
    }

    // Voltear la carta
    function flipCard() {
        if (lockBoard || isPaused || this === firstCard) return;
        this.classList.add('flip');

        if (!firstCard) {
            firstCard = this;
            return;
        }

        secondCard = this;
        lockBoard = true;

        checkForMatch();
    }

    // Comprobar si las cartas coinciden
    function checkForMatch() {
        const isMatch = firstCard.dataset.name === secondCard.dataset.name;
        if (isMatch) {
            disableCards();
            matchedPairs++;
            if (matchedPairs === cardsArray.length / 2) {
                setTimeout(showCompletionMessage, 500);
            }
        } else {
            unflipCards();
        }
    }

    // Deshabilitar las cartas cuando coinciden
    function disableCards() {
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);
        resetBoardState();
    }

    // Desvoltear las cartas si no coinciden
    function unflipCards() {
        setTimeout(() => {
            firstCard.classList.remove('flip');
            secondCard.classList.remove('flip');
            resetBoardState();
        }, 1000);
    }

    // Reiniciar el estado de las cartas
    function resetBoardState() {
        [firstCard, secondCard] = [null, null];
        lockBoard = false;
    }

    // Función de confeti
    function launchConfetti() {
        const confettiContainer = document.getElementById("confetti-container");

        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement("div");
            confetti.classList.add("confetti");
            confetti.style.left = `${Math.random() * 100}vw`;
            confetti.style.animationDuration = `${Math.random() * 3 + 2}s`;
            confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
            confettiContainer.appendChild(confetti);
        }

        setTimeout(() => {
            confettiContainer.innerHTML = "";
        }, 5000);
    }

    // Función para el temporizador
    function startTimer() {
        timer = setInterval(() => {
            time++;
            const minutes = Math.floor(time / 60);
            const seconds = time % 60;
            timerDisplay.textContent = `Tiempo: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        }, 1000);
    }

    function resetTimer() {
        clearInterval(timer);
        time = 0;
        timerDisplay.textContent = 'Tiempo: 0:00';
    }

    // Función para pausar y reanudar el juego
    function togglePause() {
        isPaused = !isPaused;
        pauseButton.textContent = isPaused ? 'Reanudar' : 'Pausar';

        if (isPaused) {
            clearInterval(timer);
            lockBoard = true;
        } else {
            startTimer();
            lockBoard = false;
        }
    }

    // Reiniciar el tablero
    function resetBoard() {
        resetTimer();
        gameBoard.innerHTML = '';
        lockBoard = false;
        isPaused = false;
        pauseButton.textContent = 'Pausar';
        startButton.style.display = 'block'; // Mostrar el botón de iniciar al reiniciar
        pauseButton.style.display = 'none'; // Ocultar el botón de pausar después de reiniciar
        firstCard = null;
        secondCard = null;
        matchedPairs = 0;
        timerDisplay.style.display = 'block'; // Asegurar que el temporizador vuelva a aparecer
    }

    // Mostrar mensaje de felicitaciones con SweetAlert
    function showCompletionMessage() {
        pauseButton.style.display = 'none'; // Ocultar el botón de pausar cuando aparece el mensaje de felicitaciones
        timerDisplay.style.display = 'none'; // Ocultar el temporizador al mostrar la sweet alert
        launchConfetti();  // Inicia el confeti antes de la sweet alert
        Swal.fire({
            title: '¡Felicidades!',
            text: '¡Completaste el juego!',
            icon: 'success',
            confirmButtonText: 'Jugar de nuevo',
            backdrop: `
                rgba(0,0,0,0.5)
                left top
                no-repeat
            `,
            customClass: {
                popup: 'sweetalert-with-confetti' // Clase CSS para estilo adicional si se necesita
            }
        }).then(() => {
            resetBoard();  // Reinicia el juego al cerrar la sweet alert
            pauseButton.style.display = 'block'; // Mostrar el botón de pausar nuevamente después de reiniciar el juego
        });
    }
});