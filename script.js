let timer;
let isRunning = false;
let startTime = null;
let elapsedTime = 0;

const display = document.getElementById('display');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const resetBtn = document.getElementById('resetBtn');

// WebSocket connection
const ws = new WebSocket('wss://server-14eb.onrender.com/');

ws.onmessage = (event) => {
    const data = JSON.parse(event.data);

    if (data.type === 'start' && data.startTime) {
        startTime = data.startTime;
        isRunning = true;
        runTimer();
    }

    if (data.type === 'stop') {
        clearInterval(timer);
        isRunning = false;
    }

    if (data.type === 'reset') {
        clearInterval(timer);  // Stop the timer
        startTime = null;
        elapsedTime = 0;
        isRunning = false;
        display.textContent = formatTime(0, 0);  // Reset the display to 00:00.00
    }
};

// Start button functionality
startBtn.addEventListener('click', () => {
    if (!isRunning) {
        ws.send(JSON.stringify({ type: 'start' }));
    }
});

// Stop button functionality
stopBtn.addEventListener('click', () => {
    clearInterval(timer);
    isRunning = false;
    elapsedTime = Date.now() - startTime;
    ws.send(JSON.stringify({ type: 'stop' }));
});

// Reset button functionality
resetBtn.addEventListener('click', () => {
    ws.send(JSON.stringify({ type: 'reset' }));
});

// Function to run the timer
function runTimer() {
    clearInterval(timer);
    timer = setInterval(() => {
        const now = Date.now();
        const timePassed = now - startTime;
        const seconds = Math.floor(timePassed / 1000);
        const milliseconds = timePassed % 1000;
        display.textContent = formatTime(seconds, milliseconds);
    }, 10);
}

// Format time for display
function formatTime(seconds, milliseconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    const ms = Math.floor(milliseconds / 10);
    return `${pad(hours)}:${pad(minutes)}:${pad(secs)}.${pad(ms, 2)}`;
}

// Pad single digit numbers with leading zeroes
function pad(num, size = 2) {
    return num.toString().padStart(size, '0');
}
