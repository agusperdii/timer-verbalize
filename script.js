// ================= DOM =================
const timerDisplay = document.getElementById('timer-display');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');
const minutesInput = document.getElementById('minutes');
const secondsInput = document.getElementById('seconds');
const bellSound = document.getElementById('bell-sound');
const timerModeBtn = document.getElementById('timer-mode-btn');
const stopwatchModeBtn = document.getElementById('stopwatch-mode-btn');
const minutesLabel = document.getElementById('minutes-label');
const secondsLabel = document.getElementById('seconds-label');
const toggleControlsBtn = document.getElementById('toggle-controls-btn');
const timerContainer = document.querySelector('.timer-container');

// ================= GLOBAL STATE =================
let interval = null;
let currentMode = 'timer';
let controlsHidden = false;

// ================= UTIL =================
function displayTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    timerDisplay.textContent = `${m}:${s < 10 ? '0' : ''}${s}`;
}

function playBell() {
    bellSound.currentTime = 0;
    bellSound.play();
}

// ================= TIMER ENGINE =================
class TimerEngine {
    constructor() {
        this.totalSeconds = 0;
        this.initialSeconds = 0;
        this.isPaused = false;
    }

    start(callback) {
        if (interval) return;

        interval = setInterval(() => {
            callback();
        }, 1000);
    }

    stop() {
        clearInterval(interval);
        interval = null;
    }

    reset(seconds = 0) {
        this.stop();
        this.totalSeconds = seconds;
        this.initialSeconds = seconds;
        this.isPaused = false;
        displayTime(seconds);
    }
}

const engine = new TimerEngine();

// ================= COUNTDOWN TIMER =================
class CountdownTimer {
    start() {
        const min = +minutesInput.value || 0;
        const sec = +secondsInput.value || 0;

        if (min === 0 && sec === 0) {
            alert('Masukkan waktu yang valid');
            return;
        }

        if (!engine.isPaused) {
            engine.totalSeconds = min * 60 + sec;
            engine.initialSeconds = engine.totalSeconds;
        }

        engine.isPaused = false;
        playBell();
        document.body.classList.add('orange-bg');

        engine.start(() => {
            engine.totalSeconds--;

            if (engine.totalSeconds < 0) {
                engine.stop();
                displayTime(0);
                return;
            }

            displayTime(engine.totalSeconds);

            const elapsed = engine.initialSeconds - engine.totalSeconds;

            // 60 detik pertama selesai → remove orange
            if (elapsed === 60) {
                document.body.classList.remove('orange-bg');
            }

            // Sisa 80 detik → add orange
            if (engine.totalSeconds === 80) {
                document.body.classList.add('orange-bg');
                playBell();
            }
        });
    }

    pause() {
        engine.stop();
        engine.isPaused = true;
    }

    reset() {
        const min = +minutesInput.value || 0;
        const sec = +secondsInput.value || 0;
        engine.reset(min * 60 + sec);
    }
}

// ================= STOPWATCH =================
class StopwatchTimer {
    start() {
        const maxMin = +minutesInput.value || 0;
        const maxSec = +secondsInput.value || 0;
        const max = maxMin * 60 + maxSec;

        if (!engine.isPaused) engine.totalSeconds = 0;

        engine.isPaused = false;
        playBell();
        document.body.classList.add('orange-bg');

        engine.start(() => {
            engine.totalSeconds++;
            displayTime(engine.totalSeconds);

            if (engine.totalSeconds === 60) {
                playBell()
                document.body.classList.remove('orange-bg');
            }
            if (max > 0 && engine.totalSeconds === max - 80){
                playBell();
                document.body.classList.add('orange-bg');
            }

            if (max > 0 && engine.totalSeconds >= max) {
                engine.stop();
            }
        });
    }

    pause() {
        engine.stop();
        engine.isPaused = true;
    }

    reset() {
        engine.reset(0);
        document.body.classList.remove('orange-bg');
    }
}

const timer = new CountdownTimer();
const stopwatch = new StopwatchTimer();

// ================= MODE HANDLER =================
function start() {
    currentMode === 'timer' ? timer.start() : stopwatch.start();
}

function pause() {
    currentMode === 'timer' ? timer.pause() : stopwatch.pause();
}

function reset() {
    currentMode === 'timer' ? timer.reset() : stopwatch.reset();
}

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

// ================= UI =================
function toggleControls() {
    controlsHidden = !controlsHidden;
    timerContainer.classList.toggle('controls-hidden');
    toggleControlsBtn.textContent = controlsHidden ? 'Show Controls' : 'Hide Controls';
}

// ================= EVENTS =================
startBtn.addEventListener('click', start);
pauseBtn.addEventListener('click', pause);
resetBtn.addEventListener('click', reset);
minutesInput.addEventListener('input', reset);
secondsInput.addEventListener('input', reset);
timerModeBtn.addEventListener('click', () => setMode('timer'));
stopwatchModeBtn.addEventListener('click', () => setMode('stopwatch'));
toggleControlsBtn.addEventListener('click', toggleControls);

// Init
setMode('timer');
