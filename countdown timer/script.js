const datetimeInput = document.getElementById('datetime-input');
const startButton = document.getElementById('start-button');
const daysDisplay = document.getElementById('days');
const hoursDisplay = document.getElementById('hours');
const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const messageContainer = document.getElementById('message-container');
const timerContainer = document.getElementById('timer-container');

let countdownInterval;
let targetTime;
let isRunning = false;

// Sound effect (using Web Audio API)
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
function playSound() {
    if (audioContext) {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // A4 note
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.8, audioContext.currentTime + 0.1); // Fade in
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 1);  // Fade out

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 1); // Sound duration
    }
}



function startCountdown() {
    if (isRunning) return;

    const inputTime = datetimeInput.value;
    if (!inputTime) {
        alert('Please select a valid date and time.');
        return;
    }

    targetTime = new Date(inputTime);
    const now = new Date();

    if (targetTime <= now) {
        alert('Target time must be in the future.');
        return;
    }

    isRunning = true;
    messageContainer.textContent = '';
    messageContainer.classList.remove('show', 'alert-visual', 'alert-sound');


    countdownInterval = setInterval(updateCountdown, 1000);
    startButton.textContent = 'Pause Countdown'; // Change button text
    datetimeInput.disabled = true;
}

function pauseCountdown() {
    if (isRunning) {
        isRunning = false;
        clearInterval(countdownInterval);
        startButton.textContent = 'Continue Countdown';
        datetimeInput.disabled = false;
    } else {
        isRunning = true;
        countdownInterval = setInterval(updateCountdown, 1000);
        startButton.textContent = 'Pause Countdown';
    }
}


function updateCountdown() {
    const now = new Date();
    const timeRemaining = targetTime.getTime() - now.getTime();

    if (timeRemaining <= 0) {
        clearInterval(countdownInterval);
        isRunning = false;
        startButton.textContent = 'Restart Countdown'; // Change button text

        messageContainer.textContent = 'Countdown Ended!';
        messageContainer.classList.add('show', 'alert-visual', 'alert-sound');
        playSound();

        // Vibrate (if supported)
        if ("vibrate" in navigator) {
            navigator.vibrate(500); // Vibrate for 500ms
        }
        return;
    }

    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

    daysDisplay.textContent = String(days).padStart(2, '0');
    hoursDisplay.textContent = String(hours).padStart(2, '0');
    minutesDisplay.textContent = String(minutes).padStart(2, '0');
    secondsDisplay.textContent = String(seconds).padStart(2, '0');
}



startButton.addEventListener('click', () => {
    if (isRunning) {
        pauseCountdown();
    } else {
        startCountdown();
    }
});

// Optional: Auto-focus on the date input on page load
datetimeInput.focus();
