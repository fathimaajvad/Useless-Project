// script.js

// DOM Elements
const timerDisplay = document.getElementById('timerDisplay');
const timerStatus = document.getElementById('timerStatus');
const progressBar = document.getElementById('progressBar');
const messageBox = document.getElementById('messageBox');
const startButton = document.getElementById('startButton');
const resetButton = document.getElementById('resetButton');
const excuseButton = document.getElementById('excuseButton');
const achievementsButton = document.getElementById('achievementsButton');
const achievementsCounter = document.getElementById('achievementsCounter');
const weedContainer = document.getElementById('weedContainer');

// New DOM elements for custom timer lengths
const workTimeInput = document.getElementById('workTimeInput');
const breakTimeInput = document.getElementById('breakTimeInput');

// State variables
let timerInterval;
let isRunning = false;
let totalTimeInSeconds = 25 * 60; // Default work time
let currentTimeInSeconds = totalTimeInSeconds;
let isWorkTime = true;
let achievementCount = 0;
let weedGrowth = 0; // State variable for weed growth
let weedInterval; // Interval for weed growth

// Sound for notifications
const notificationSound = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3');

// Initial setup
const updateTimerDisplay = () => {
    const minutes = Math.floor(currentTimeInSeconds / 60);
    const seconds = currentTimeInSeconds % 60;
    timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const updateProgressBar = () => {
    const progress = (currentTimeInSeconds / totalTimeInSeconds) * 100;
    progressBar.style.width = `${progress}%`;
};

// Functions for custom timer lengths
const updateTimesFromInputs = () => {
    // Ensure inputs are valid numbers, default to 25 and 5 if not
    const workMinutes = parseInt(workTimeInput.value) || 25;
    const breakMinutes = parseInt(breakTimeInput.value) || 5;
    
    if (isWorkTime) {
        totalTimeInSeconds = workMinutes * 60;
    } else {
        totalTimeInSeconds = breakMinutes * 60;
    }
    
    currentTimeInSeconds = totalTimeInSeconds;
    updateTimerDisplay();
    updateProgressBar();
};

// Functions for speech synthesis
const speakMessage = (message) => {
    const synth = window.speechSynthesis;
    if (!synth) {
        console.log("Speech synthesis not supported.");
        return;
    }
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.voice = synth.getVoices().find(voice => voice.name === 'Google UK English Male');
    synth.speak(utterance);
};


// Functions for the "Virtual Weed" feature
const startWeedGrowth = () => {
    // Clear any existing interval to prevent duplicates
    if (weedInterval) clearInterval(weedInterval);
    weedInterval = setInterval(() => {
        weedGrowth++;
        let weeds = '🌱';
        for (let i = 0; i < weedGrowth; i++) {
            weeds += '🌱';
        }
        weedContainer.textContent = weeds;
    }, 60000); // Grow a new weed every 60 seconds (1 minute) of inactivity
};

// Initial display update and weed growth start
updateTimesFromInputs();
startWeedGrowth(); // Start the weed growth immediately


// Timer functions
const startTimer = () => {
    if (isRunning) return;

    // Clear the weed growth interval when the timer starts
    clearInterval(weedInterval);
    weedContainer.textContent = ''; // Clear the weeds

    // Call this here to ensure the timer starts with the correct value
    updateTimesFromInputs(); 

    isRunning = true;
    startButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm4-1a1 1 0 012 0v4a1 1 0 11-2 0V7z" clip-rule="evenodd" />
                             </svg>
                             Pause`;
    
    roastUser();

    timerInterval = setInterval(() => {
        currentTimeInSeconds--;
        updateTimerDisplay();
        updateProgressBar();
        
        if (currentTimeInSeconds <= 0) {
            clearInterval(timerInterval);
            notificationSound.play();
            isWorkTime = !isWorkTime;
            switchTimerMode();
            startTimer();
        }
    }, 1000);
};

const pauseTimer = () => {
    isRunning = false;
    startButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
                            </svg>
                            Start`;
    clearInterval(timerInterval);
    startWeedGrowth(); // Restart weed growth when paused
};

const toggleTimer = () => isRunning ? pauseTimer() : startTimer();

const resetTimer = () => {
    pauseTimer();
    isWorkTime = true;
    updateTimesFromInputs();
    timerStatus.textContent = 'Work Time';
    messageBox.textContent = 'Ready to procrastinate productively?';

    // Reset weed growth on timer reset
    clearInterval(weedInterval);
    weedGrowth = 0;
    weedContainer.textContent = '';
    startWeedGrowth();
};

const switchTimerMode = () => {
    isWorkTime ? (timerStatus.textContent = 'Work Time', messageBox.textContent = 'Okay, back to work... eventually.') : (timerStatus.textContent = 'Break Time', messageBox.textContent = 'You earned this... or did you?');
    updateTimesFromInputs();
};

// Additional features
const excuses = [
    "The dog ate my laptop.",
    "I need to reorganize my entire desktop folder structure.",
    "My cat is asleep on my keyboard, it's a sacred moment.",
    "I'm waiting for the perfect moment of inspiration.",
    "I'm actually just staring at the wall, thinking about the work.",
    "The WiFi signal isn't strong enough for my brain to function.",
    "I need to check the weather... just in case."
];

// The roastUser function is now an async function that calls the Gemini API.
const roastUser = async () => {
    const roastPrompt = "Give me a funny and sarcastic roast about someone who is procrastinating with a timer app. Keep it short.";
    
    // !!! IMPORTANT: Insert your API key here !!!
    const apiKey = "AIzaSyAJntV0z5BCtizry4VnWGW1emjlfiwIlZI";

    if (!apiKey || apiKey === "YOUR_API_KEY_HERE") {
      messageBox.textContent = "Error: API key is not configured. Please add your API key to the code.";
      console.error("API Key is missing or invalid.");
      return;
    }
    
    messageBox.textContent = "AI is thinking of a great roast...";

    let chatHistory = [];
    chatHistory.push({ role: "user", parts: [{ text: roastPrompt }] });
    const payload = { contents: chatHistory };
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        
        if (!response.ok) {
            throw new Error(`API call failed with status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.candidates && result.candidates.length > 0 &&
            result.candidates[0].content && result.candidates[0].content.parts &&
            result.candidates[0].content.parts.length > 0) {
            const aiRoast = result.candidates[0].content.parts[0].text;
            messageBox.textContent = aiRoast;
            speakMessage(aiRoast);
        } else {
            messageBox.textContent = "Error: Couldn't generate a roast. The API response was unexpected.";
            console.error("Unexpected API response structure:", result);
        }
    } catch (error) {
        console.error("Error fetching AI roast:", error);
        messageBox.textContent = `Network or API error: ${error.message}. Try clicking the excuse button instead!`;
    }
};

const getAchievementTitle = (count) => {
    switch(count) {
        case 1: return "The Procrastinator's Apprentice";
        case 2: return "Master of Distraction";
        case 3: return "Virtuoso of Vapid Tasks";
        case 4: return "Zenith of Zero Productivity";
        case 5: return "The Inevitable Deadline Avoider";
        default: return "Just... Why?";
    }
};

const generateExcuse = () => {
    const randomExcuse = excuses[Math.floor(Math.random() * excuses.length)];
    messageBox.textContent = randomExcuse;
    speakMessage(randomExcuse); // Call the new function here
};


const unlockAchievement = () => {
    achievementCount++;
    achievementsCounter.textContent = `Achievements: ${achievementCount}`;
    messageBox.textContent = `Achievement Unlocked: "${getAchievementTitle(achievementCount)}"!`;
};

// Event Listeners
startButton.addEventListener('click', toggleTimer);
resetButton.addEventListener('click', resetTimer);
excuseButton.addEventListener('click', generateExcuse);
achievementsButton.addEventListener('click', unlockAchievement);

// Add these listeners to update the timer display when input values change
workTimeInput.addEventListener('input', updateTimesFromInputs);
breakTimeInput.addEventListener('input', updateTimesFromInputs);
