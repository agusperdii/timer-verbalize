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
const toggleControlsBtn = document.getElementById('toggle-controls-btn');
const timerContainer = document.querySelector('.timer-container');

let interval; // To store the setInterval instance
let totalSeconds; // To store the current seconds for the countdown/stopwatch
let initialTotalSeconds = 0; // Store initial time for countdown to calculate elapsed
let isPaused = false; // To track if the timer is paused
let currentMode = 'timer'; // 'timer' or 'stopwatch'
let controlsHidden = false; // Track controls visibility

/**
 * Updates the background color based on elapsed seconds.
 * @param {number} elapsedSeconds - The number of seconds passed since start.
 */
function updateBackgroundColor(elapsedSeconds) {
    document.body.classList.remove('orange-bg', 'red-bg');

    // 0-1 minute (0-60s): Orange
    if (elapsedSeconds >= 0 && elapsedSeconds < 60) {
        document.body.classList.add('orange-bg');
    }
    // 6-7 minutes (360-420s): Orange
    else if (elapsedSeconds >= 360 && elapsedSeconds < 420) {
        document.body.classList.add('orange-bg');
    }
    // 7+ minutes (420s+): Red
    else if (elapsedSeconds >= 420) {
        document.body.classList.add('red-bg');
    }
    // 1-6 minutes: Default (no class)
}

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
        initialTotalSeconds = totalSeconds;
    }

    isPaused = false;
    
    // Initial update
    updateBackgroundColor(initialTotalSeconds - totalSeconds);

    interval = setInterval(() => {
        totalSeconds--;
        
        const elapsed = initialTotalSeconds - totalSeconds;
        updateBackgroundColor(elapsed);

        if (totalSeconds < 0) {
            clearInterval(interval);
            interval = null;
            timerDisplay.textContent = '0:00';
            return;
        }

        displayTime(totalSeconds);

        // Ring at 1 minute elapsed (first 60 seconds) or 1 minute remaining
        if (elapsed === 60 || totalSeconds === 60) {
            bellSound.currentTime = 0;
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
    
    // Initial update
    updateBackgroundColor(totalSeconds);

    interval = setInterval(() => {
        totalSeconds++;
        displayTime(totalSeconds);
        updateBackgroundColor(totalSeconds);

        // Ring bell at 1 minute elapsed
        const isOneMinuteElapsed = totalSeconds === 60;
        // Ring bell 1 minute before max time
        const isMinuteMark = totalSeconds % 60 === 0 && totalSeconds > 0;

        if (isOneMinuteElapsed || isMinuteMark) {
            bellSound.currentTime = 0;
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

    // Play bell sound when starting
    bellSound.currentTime = 0;
    bellSound.play();

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
    document.body.classList.remove('orange-bg', 'red-bg'); // Reset background

    if (currentMode === 'timer') {
        const minutes = parseInt(minutesInput.value, 10) || 0;
        const seconds = parseInt(secondsInput.value, 10) || 0;
        totalSeconds = (minutes * 60) + seconds;
        initialTotalSeconds = totalSeconds;
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

/**
 * Toggles the visibility of controls.
 */
function toggleControls() {
    controlsHidden = !controlsHidden;
    if (controlsHidden) {
        timerContainer.classList.add('controls-hidden');
        toggleControlsBtn.textContent = 'Show Controls';
    } else {
        timerContainer.classList.remove('controls-hidden');
        toggleControlsBtn.textContent = 'Hide Controls';
    }
}

// Event Listeners
startBtn.addEventListener('click', start);
pauseBtn.addEventListener('click', pause);
resetBtn.addEventListener('click', reset);
minutesInput.addEventListener('input', reset);
secondsInput.addEventListener('input', reset);
timerModeBtn.addEventListener('click', () => setMode('timer'));
stopwatchModeBtn.addEventListener('click', () => setMode('stopwatch'));
toggleControlsBtn.addEventListener('click', toggleControls);

// Initial display setup when the page loads
setMode('timer');
