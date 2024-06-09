document.addEventListener('DOMContentLoaded', function () {
    let levels = [
        { image: 'url("IMAGENES/cambiavias1.png")', answers: ['1', '4', '5'] },
        { image: 'url("IMAGENES/cambiavias2.png")', answers: ['1', '4', '6'] },
        { image: 'url("IMAGENES/cambiavias3.png")', answers: ['1', '3', '5'] },
        { image: 'url("IMAGENES/cambiavias4.png")', answers: ['1', '3', '6'] },
        { image: 'url("IMAGENES/cambiavias5.png")', answers: ['1', '3', '5'] },
        { image: 'url("IMAGENES/cambiavias6.png")', answers: ['2', '3', '5'] },
        { image: 'url("IMAGENES/cambiavias7.png")', answers: ['2', '3', '5'] },
        { image: 'url("IMAGENES/cambiavias8.png")', answers: ['2', '3', '6'] },
        { image: 'url("IMAGENES/cambiavias9.png")', answers: ['2', '4', '5'] },
        { image: 'url("IMAGENES/cambiavias10.png")', answers: ['2', '4', '6'] }
    ];

    const preLevelImages = [
        'IMAGENES/paso8.png',
        'IMAGENES/paso7.png',
        'IMAGENES/paso6.png',
        'IMAGENES/paso5.png',
        'IMAGENES/paso4.png',
        'IMAGENES/paso3.png',
        'IMAGENES/paso2.png',
        'IMAGENES/paso1.png'
    ];

    let currentLevel = 0;
    const backgroundSlider = document.querySelector('.background-slider');
    const buttonSections = document.querySelectorAll('.button-group');
    const badMessage = document.getElementById('bad-message');
    const greatMessage = document.getElementById('great-message');
    const startMessage = document.getElementById('start-message');
    const gameBox = document.querySelector('.game-box');

    let pressedButtons = [];
    let sectionButtonsPressed = [false, false, false]; // Para controlar si se ha presionado un botón en cada sección
    let preLevelInterval;

    function shuffleLevels() {
        // Shuffle the levels array
        for (let i = levels.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [levels[i], levels[j]] = [levels[j], levels[i]];
        }
    }

    function changeLevel() {
        if (currentLevel < levels.length) {
            backgroundSlider.style.backgroundImage = levels[currentLevel].image;
            startMessage.innerHTML = "GO"; // Cambia el contenido del mensaje
            startMessage.style.display = 'block'; // Muestra el mensaje
            startMessage.style.fontSize = '100px'; // Tamaño grande
            startMessage.style.color = 'white'; // Color blanco
            startMessage.style.textAlign = 'center'; // Alineación central
            startMessage.style.top = 'calc(30% + 10px)'; // Posición más arriba con ajuste de 10px
            startMessage.style.webkitTextFillColor = 'white'; // Color de relleno blanco
            startMessage.style.webkitTextStroke = '1px black'; // Borde blanco
            setTimeout(function () {
                startMessage.style.display = 'none'; // Oculta el mensaje después de un tiempo
            }, 2000); // Cambia el tiempo según lo necesites
        } else {
            // Si todos los niveles se han completado, baraja los niveles y vuelve al primero
            shuffleLevels();
            currentLevel = 0;
            changeLevel();
        }
    }

    function checkLevelCompletion() {
        if (sectionButtonsPressed.every((section, index) => section || !levels[currentLevel].answers.includes((index + 1).toString())) && pressedButtons.length === 3 && levels[currentLevel].answers.every(answer => pressedButtons.includes(answer))) {
            currentLevel++;
            pressedButtons = [];
            sectionButtonsPressed = [false, false, false]; // Reiniciar la variable para la próxima ronda
            buttonSections.forEach(section => {
                section.querySelectorAll('.game-button').forEach(button => {
                    button.classList.remove('active');
                });
            });
            greatMessage.style.display = 'block';
            setTimeout(function () {
                greatMessage.style.display = 'none';
                changeLevel();
            }, 1000);
        } else if (pressedButtons.length === 3 && (!sectionButtonsPressed.every((section, index) => section) || levels[currentLevel].answers.some(answer => !pressedButtons.includes(answer)))) {
            badMessage.style.display = 'block';
            setTimeout(function () {
                badMessage.style.display = 'none';
                resetLevel();
            }, 1000);
        }
    }

    function resetLevel() {
        pressedButtons = [];
        buttonSections.forEach(section => {
            section.querySelectorAll('.game-button').forEach(button => {
                button.classList.remove('active');
            });
        });
    }

    function activateButtons() {
        buttonSections.forEach((section, index) => {
            const buttons = section.querySelectorAll('.game-button');
            buttons.forEach(button => {
                button.addEventListener('click', function () {
                    if (!this.classList.contains('active')) {
                        buttons.forEach(btn => btn.classList.remove('active'));
                        this.classList.add('active');
                        pressedButtons.push(this.id.split('-')[1]);
                        sectionButtonsPressed[index] = true;
                        checkLevelCompletion();
                    }
                });
            });
        });
    }

    function startImageLoop() {
        let imageIndex = 0;
        preLevelInterval = setInterval(() => {
            backgroundSlider.style.backgroundImage = `url(${preLevelImages[imageIndex]})`;
            imageIndex = (imageIndex + 1) % preLevelImages.length;
        }, 100); // Cambia la imagen cada 100 ms
    }

    function startGame() {
        clearInterval(preLevelInterval); // Detener el bucle de imágenes
        startMessage.style.display = 'none';
        changeLevel(); // Inicializa el primer nivel
        activateButtons(); // Activar los eventos de los botones
    }

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            startGame();
        }
    });

    gameBox.addEventListener('click', function () {
        startGame();
    });

    startMessage.style.display = 'block'; // Muestra el mensaje de inicio
    startImageLoop(); // Inicia el bucle de imágenes antes de empezar el juego
});
