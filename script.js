// DOM Elements
const timerDisplay = document.getElementById('timer-display');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');
const minutesInput = document.getElementById('minutes');
const secondsInput = document.getElementById('seconds');
const bellSound = document.getElementById('bell-sound');
const timerModeBtn = document.getElementById('timer-mode-btn');
const stopwatchModeBtn = document.getElementById('stopwatch-mode-btn');
const timeInput = document.getElementById('time-input');
const minutesLabel = document.getElementById('minutes-label');
const secondsLabel = document.getElementById('seconds-label');


let interval; // To store the setInterval instance
let totalSeconds; // To store the total seconds for the countdown/stopwatch
let isPaused = false; // To track if the timer is paused
let currentMode = 'timer'; // 'timer' or 'stopwatch'

/**
 * Updates the timer display with the given seconds.
 * @param {number} seconds - The seconds to display.
 */
function displayTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    timerDisplay.textContent = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

/**
 * Starts the countdown timer.
 */
function startCountdown() {
    const minutes = parseInt(minutesInput.value, 10) || 0;
    const seconds = parseInt(secondsInput.value, 10) || 0;

    if (minutes === 0 && seconds === 0) {
        alert('Please enter a valid number of minutes or seconds.');
        return;
    }

    if (!isPaused) {
        totalSeconds = (minutes * 60) + seconds;
    }

    isPaused = false;
    bellSound.play(); // Play sound at the start

    interval = setInterval(() => {
        totalSeconds--;

        if (totalSeconds < 0) {
            clearInterval(interval);
            interval = null;
            timerDisplay.textContent = '0:00';
            return;
        }

        displayTime(totalSeconds);

        // Play sound at the start of the last minute
        if (totalSeconds === 60) {
            bellSound.play();
        }
    }, 1000);
}

/**
 * Starts the stopwatch.
 */
function startStopwatch() {
    const maxMinutes = parseInt(minutesInput.value, 10) || 0;
    const maxSeconds = parseInt(secondsInput.value, 10) || 0;
    const maxTotalSeconds = (maxMinutes * 60) + maxSeconds;

    if (!isPaused) {
        totalSeconds = 0;
    }
    isPaused = false;
    bellSound.play();

    interval = setInterval(() => {
        totalSeconds++;
        displayTime(totalSeconds);

        // Ring bell at 1 minute
        if (totalSeconds === 60) {
            bellSound.play();
        }

        // Ring bell 1 minute before max time
        if (maxTotalSeconds > 60 && totalSeconds === maxTotalSeconds - 60) {
            bellSound.play();
        }

        // Stop at max time
        if (maxTotalSeconds > 0 && totalSeconds >= maxTotalSeconds) {
            clearInterval(interval);
            interval = null;
        }

    }, 1000);
}

/**
 * Main start function, decides which timer to start.
 */
function start() {
    if (interval) {
        return; // Timer is already running
    }

    if (currentMode === 'timer') {
        startCountdown();
    } else {
        startStopwatch();
    }
}

/**
 * Pauses the timer/stopwatch.
 */
function pause() {
    if (interval) {
        clearInterval(interval);
        interval = null;
        isPaused = true;
    }
}

/**
 * Resets the timer/stopwatch to the initial value.
 */
function reset() {
    clearInterval(interval);
    interval = null;
    isPaused = false;

    if (currentMode === 'timer') {
        const minutes = parseInt(minutesInput.value, 10) || 0;
        const seconds = parseInt(secondsInput.value, 10) || 0;
        totalSeconds = (minutes * 60) + seconds;
    } else {
        totalSeconds = 0;
    }
    displayTime(totalSeconds);
}

/**
 * Sets the current mode.
 * @param {string} mode - The mode to set ('timer' or 'stopwatch').
 */
function setMode(mode) {
    currentMode = mode;
    if (mode === 'timer') {
        timerModeBtn.classList.add('active');
        stopwatchModeBtn.classList.remove('active');
        minutesLabel.textContent = 'Set Minutes:';
        secondsLabel.textContent = 'Set Seconds:';
    } else {
        stopwatchModeBtn.classList.add('active');
        timerModeBtn.classList.remove('active');
        minutesLabel.textContent = 'Max Minutes:';
        secondsLabel.textContent = 'Max Seconds:';
    }
    reset();
}

// Event Listeners
startBtn.addEventListener('click', start);
pauseBtn.addEventListener('click', pause);
resetBtn.addEventListener('click', reset);
minutesInput.addEventListener('input', reset);
secondsInput.addEventListener('input', reset);
timerModeBtn.addEventListener('click', () => setMode('timer'));
stopwatchModeBtn.addEventListener('click', () => setMode('stopwatch'));

// Initial display setup when the page loads
setMode('timer');
