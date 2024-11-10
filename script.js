document.addEventListener('DOMContentLoaded', () => {
    // Fondo base al cargar la página
    document.body.style.backgroundImage = "url('images/background.gif')";
    document.body.style.backgroundSize = "cover";

    const cardsArray = [
        { name: 'image1', img: 'images/image1.png' },
        { name: 'image1', img: 'images/image1.1.png' },
        { name: 'image2', img: 'images/image2.png' },
        { name: 'image2', img: 'images/image2.1.png' },
        { name: 'image3', img: 'images/image3.png' },
        { name: 'image3', img: 'images/image3.1.png' },
        { name: 'image4', img: 'images/image4.png' },
        { name: 'image4', img: 'images/image4.1.png' },
        { name: 'image5', img: 'images/image5.png' },
        { name: 'image5', img: 'images/image5.1.png' },
        { name: 'image6', img: 'images/image6.png' },
        { name: 'image6', img: 'images/image6.1.png' }
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
    let countdownDisplay, countdownInterval;

        // Al cargar la página, comprobamos si el fondo es 'background.gif' y ocultamos los elementos
        checkBackground();

    // Muestra la alerta de inicio del juego
    startButton.addEventListener('click', showStartAlert);

    function showStartAlert() {
        // Se asegura de que el fondo es 'background.gif' y oculta los controles
        document.body.style.backgroundImage = "url('images/background.gif')";
        document.body.style.backgroundSize = "cover";

        // Oculta los controles (pausar, timer) antes de la alerta
        hideControlsForAlert();

        // Oculta el tablero de cartas y el temporizador antes de la cuenta regresiva
        gameBoard.style.display = 'none';
        timerDisplay.style.display = 'none';
        pauseButton.style.display = 'none'; // Oculta también el botón de pausa

        // Muestra la alerta de inicio del juego con SweetAlert
        Swal.fire({
            title: '¿Listo para comenzar?',
            text: '¡La partida comenzará en 5 segundos, prepárate!',
            icon: 'info',
            confirmButtonText: 'Ok',
            allowOutsideClick: false, // No permite la interacción fuera de la alerta
            backdrop: true, // Se asegura de que el fondo se oscurezca mientras está visible la alerta
        }).then((result) => {
            if (result.isConfirmed) {
                // Después de que se confirme la alerta, inicia el fondo de video y la cuenta regresiva
                changeBackgroundToVideo();
                startCountdown();
    
                // Vuelve a mostrar el tablero de cartas y el temporizador después de iniciar la partida
                gameBoard.style.visibility = 'visible';
                timerDisplay.style.visibility = 'visible';
                pauseButton.style.visibility = 'visible';
            }
        });
    }

    function hideControlsForAlert() {
        // Esconde los controles durante la alerta
        pauseButton.style.visibility = 'hidden';
        timerDisplay.style.visibility = 'hidden';
    }

    function hideControlsForBackground() {
        // Se oculta el temporizador y el botón de pausa si el fondo es 'background.gif' o 'instructions.mp4'
        const backgroundImage = document.body.style.backgroundImage;
        if (backgroundImage.includes('background.gif') || backgroundImage.includes('instructions.mp4')) {
            timerDisplay.style.display = 'none';
            pauseButton.style.display = 'none';
        } else {
            timerDisplay.style.display = 'block';
            pauseButton.style.display = 'block';
        }
    }

    // Cambia el fondo a instrucciones y oculta los controles
    function changeBackgroundToVideo() {
        document.body.style.backgroundImage = 'none';
        document.body.style.backgroundColor = 'black';
    
        // Oculta el temporizador y el botón de pausa
        hideControlsForBackground();
    
        const videoElement = document.createElement('video');
        videoElement.src = 'images/instructions.mp4';
        videoElement.autoplay = true;
        videoElement.muted = true;
        videoElement.loop = true;
        videoElement.style.position = 'fixed';
        videoElement.style.top = '0';
        videoElement.style.left = '0';
        videoElement.style.width = '100%';
        videoElement.style.height = '100%';
        videoElement.style.objectFit = 'cover';
        document.body.appendChild(videoElement);
    }

// Inicia el contador mientras se muestran las instrucciones
    function startCountdown() {
        countdownDisplay = document.createElement('div');
        countdownDisplay.style.position = 'fixed';
        countdownDisplay.style.top = '10px';
        countdownDisplay.style.right = '10px';
        countdownDisplay.style.fontSize = '20px';
        countdownDisplay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        countdownDisplay.style.color = 'white';
        countdownDisplay.style.padding = '5px 10px';
        countdownDisplay.style.borderRadius = '5px';
        document.body.appendChild(countdownDisplay);

        let countdownTime = 5;
        countdownDisplay.textContent = `Comienza en: ${countdownTime}`;

        countdownInterval = setInterval(() => {
            countdownTime--;
            countdownDisplay.textContent = `Comienza en: ${countdownTime}`;

            if (countdownTime === 0) {
                clearInterval(countdownInterval);
                countdownDisplay.remove();
                changeBackgroundToBoard(); // Cambia el fondo al tablero antes de iniciar el juego
                startGame(); // Inicia el juego después del contador
            }
        }, 1000);
    }

    function changeBackgroundToBoard() {
        // Cambia el fondo al tablero cuando el juego inicia
        document.body.style.backgroundImage = "url('images/tablero.jpg')";
        document.body.style.backgroundSize = "cover";
    
        // Elimina el video de instrucciones si existe
        const videoElement = document.querySelector('video');
        if (videoElement) {
            videoElement.remove();
        }

    // Muestra el tablero y el temporizador
    gameBoard.style.display = 'grid';
    timerDisplay.style.display = 'block';
    pauseButton.style.display = 'block'; // Muestra el botón de pausa al comenzar el juego
}

    // Función para reiniciar el juego
    function startGame() {
        resetBoard();
        createBoard();
        resetTimer();
        startTimer();
        startButton.style.display = 'none';
        pauseButton.style.display = 'block';
        timerDisplay.style.display = 'block';
    }

    // Evento para ir al inicio y recargar el fondo al original
    document.getElementById('menuButton').addEventListener('click', navigateHome);

    // Vuelve al fondo inicial (background.gif) al hacer clic en "Inicio"
    function navigateHome() {
        // Recarga la página para restablecer el fondo original
        location.reload();
        
        // Comprueba si el fondo es background.gif y oculta los elementos si es así
        if (document.body.style.backgroundImage.includes('background.gif')) {
            timerDisplay.style.display = 'none';
            pauseButton.style.display = 'none';
        }
    }

    // Se agregan los eventos de inicio y pausa
    startButton.addEventListener('click', startGame);
    pauseButton.addEventListener('click', togglePause);

    // Crea el tablero de juego
    function createBoard() {
        gameBoard.innerHTML = ''; // Limpia el tablero previo
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

    // Voltea la carta
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

    // Comprueba si las cartas coinciden
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

    // Deshabilita las cartas cuando coinciden
    function disableCards() {
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);
        resetBoardState();
    }

    // Vuelve a voltear las cartas si no coinciden
    function unflipCards() {
        setTimeout(() => {
            firstCard.classList.remove('flip');
            secondCard.classList.remove('flip');
            resetBoardState();
        }, 1000);
    }

    // Reinicia el estado de las cartas
    function resetBoardState() {
        [firstCard, secondCard] = [null, null];
        lockBoard = false;
    }

    // Función de confetti
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

    //Función para resetear el temporizador
    function resetTimer() {
        clearInterval(timer);
        time = 0;
        timerDisplay.textContent = 'Tiempo: 0:00';
    }

    // Pausar y reanudar el juego
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

    // Revisa si el fondo es 'background.gif' para ocultar los elementos
    function checkBackground() {
        if (document.body.style.backgroundImage.includes('background.gif')) {
            timerDisplay.style.display = 'none';
            pauseButton.style.display = 'none';
        }
    }

    // Función para reiniciar el juego
    function resetBoard() {
        resetTimer();
        gameBoard.innerHTML = '';
        lockBoard = false;
        isPaused = false;
        pauseButton.textContent = 'Pausar';
        startButton.style.display = 'block'; // Muestra el botón de iniciar al reiniciar
        pauseButton.style.display = 'none'; // Oculta el botón de pausar después de reiniciar
        firstCard = null;
        secondCard = null;
        matchedPairs = 0;
        timerDisplay.style.display = 'block'; // Se asegura que el temporizador vuelva a aparecer
    }

// Muestra el mensaje de felicitaciones con SweetAlert
function showCompletionMessage() {
    pauseButton.style.display = 'none'; // Oculta el botón de pausar cuando aparece el mensaje de felicitaciones
    timerDisplay.style.display = 'none'; // Oculta el temporizador al mostrar la sweet alert
    launchConfetti();  // Inicia el confetti antes de la sweet alert
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
            popup: 'sweetalert-with-confetti'
        }
    }).then(() => {
        // Redirige a la pantalla de instrucciones
        changeBackgroundToVideo();
        startCountdown();  // Inicia el contador nuevamente
        resetBoard();  // Reinicia el juego al cerrar la sweet alert
        pauseButton.style.display = 'none'; // Se asegura de que el botón de pausar no se vea al reiniciar
    });
}
});