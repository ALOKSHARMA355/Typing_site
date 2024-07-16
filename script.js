const textDisplay = document.getElementById('textDisplay');
const textInput = document.getElementById('textInput');
const timerElement = document.getElementById('timer');
const wpmElement = document.getElementById('wpm');
const startButton = document.getElementById('startButton');

const sampleTexts = [
     "A journey of a thousand miles begins with a single step.",
     "Call me Ishmael. Some years ago-never mind how long precisely-having little or no money in my purse, and nothing particular to interest me on shore, I thought I would sail about a little and see the watery part of the world."
 ,"It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife. However little known the feelings or views of such a man may be on his first entering a neighbourhood, this truth is so well fixed in the minds of the surrounding families, that he is considered the rightful property of some one or other of their daughters.",
        "In my younger and more vulnerable years my father gave me some advice that I've been turning over in my mind ever since. 'Whenever you feel like criticizing anyone,' he told me, 'just remember that all the people in this world haven't had the advantages that you've had."
   ,
    
    ];

let startTime;
let timerInterval;
let words = [];
let currentWordIndex = 0;
let correctChars = 0;

startButton.addEventListener('click', startGame);

function startGame() {
    resetGame();
    const randomText = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
    words = randomText.split(' ');
    textDisplay.innerHTML = words.map((word, index) => `<span class="word" id="word-${index}">${word}</span>`).join('');
    highlightCurrentWord();
    textInput.focus();
    textInput.addEventListener('input', checkInput);
    startTime = new Date();
    timerInterval = setInterval(updateTimer, 1000);
}

function resetGame() {
    clearInterval(timerInterval);
    textInput.value = '';
    timerElement.textContent = 'Time: 60s';
    wpmElement.textContent = 'WPM: 0';
    textInput.disabled = false;
    textDisplay.innerHTML = '';
    currentWordIndex = 0;
    correctChars = 0;
}

function updateTimer() {
    const currentTime = new Date();
    const elapsedTime = Math.floor((currentTime - startTime) / 1000);
    const remainingTime = 60 - elapsedTime;

    if (remainingTime <= 0) {
        clearInterval(timerInterval);
        calculateWPM();
        textInput.removeEventListener('input', checkInput);
        textInput.disabled = true;
    }

    timerElement.textContent = `Time: ${remainingTime}s`;
}

function checkInput() {
    const inputText = textInput.value;
    const currentWord = words[currentWordIndex];
    const wordElement = document.getElementById(`word-${currentWordIndex}`);

    if (currentWord.startsWith(inputText.trim())) {
        wordElement.classList.remove('incorrect');
    } else {
        wordElement.classList.add('incorrect');
    }

    if (inputText.endsWith(' ')) {
        const typedWord = inputText.trim();
        if (typedWord === currentWord) {
            wordElement.classList.remove('incorrect');
            wordElement.classList.add('correct');
            correctChars += currentWord.length + 1; // include space
            textInput.value = '';
            currentWordIndex++;
            highlightCurrentWord();
            if (currentWordIndex === words.length) {
                clearInterval(timerInterval);
                calculateWPM();
                textInput.removeEventListener('input', checkInput);
                textInput.disabled = true;
            }
        } else {
            wordElement.classList.add('incorrect');
        }
    }
}

function highlightCurrentWord() {
    document.querySelectorAll('.word').forEach((wordElement, index) => {
        wordElement.classList.remove('current');
        if (index === currentWordIndex) {
            wordElement.classList.add('current');
        }
    });
}

function calculateWPM() {
    const elapsedTime = (new Date() - startTime) / 1000 / 60;
    const wordCount = currentWordIndex; // Total words correctly typed
    const wpm = Math.floor(wordCount / elapsedTime);
    wpmElement.textContent = `WPM: ${wpm}`;
}
