/**
 * Modern Assistant Chatbot Logic
 */

// DOM Elements
const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const themeToggle = document.getElementById('theme-toggle');

// Audio elements for sound effects
const sendSound = document.getElementById('send-sound');
const receiveSound = document.getElementById('receive-sound');

// Constants
const BOT_DELAY_MS = 1200;

// Initialize time for the first greeting
document.getElementById('initial-time').innerText = getCurrentTime();

// --- Event Listeners ---

// Theme Toggle
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    updateThemeIcon();
});

// Message Sending
sendBtn.addEventListener('click', handleUserInput);
userInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        handleUserInput();
    }
});

// --- Core Functions ---

/**
 * Handles the main workflow when user submits a message.
 */
function handleUserInput() {
    const text = userInput.value.trim();
    if (!text) return;

    // 1. Display user message
    appendMessage(text, 'user-message');
    playSound(sendSound);
    userInput.value = '';

    // 2. Display typing indicator
    const typingIndicatorId = showTypingIndicator();

    // 3. Process bot response after a realistic delay
    setTimeout(() => {
        removeElement(typingIndicatorId);
        
        const responseData = getBotResponse(text.toLowerCase());
        appendMessage(responseData.text, 'bot-message', responseData.gif);
        playSound(receiveSound);
    }, BOT_DELAY_MS);
}

/**
 * Creates and appends a message bubble to the chat box.
 * @param {string} text - The message text
 * @param {string} className - 'user-message' or 'bot-message'
 * @param {string|null} gifUrl - Optional URL for a GIF
 */
function appendMessage(text, className, gifUrl = null) {
    const messageArticle = document.createElement('article');
    messageArticle.className = `message ${className} slide-in`;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    // Add text paragraph
    const textElement = document.createElement('p');
    textElement.textContent = text;
    contentDiv.appendChild(textElement);
    
    // Attach GIF if provided
    if (gifUrl) {
        const gifImg = document.createElement('img');
        gifImg.src = gifUrl;
        gifImg.alt = "Reaction GIF";
        gifImg.className = "chat-gif";
        // Ensure scroll updates after image loads
        gifImg.onload = scrollToBottom;
        contentDiv.appendChild(gifImg);
    }
    
    // Add timestamp
    const timeElement = document.createElement('span');
    timeElement.className = 'timestamp';
    timeElement.textContent = getCurrentTime();
    contentDiv.appendChild(timeElement);
    
    messageArticle.appendChild(contentDiv);
    chatBox.appendChild(messageArticle);
    
    scrollToBottom();
}

/**
 * Rule-based logic engine for the chatbot.
 * @param {string} input - Lowercase user input
 * @returns {Object} { text: string, gif: string|null }
 */
function getBotResponse(input) {
    // Small, professional GIFs from Giphy
    const GIF_WELCOME = "https://media.giphy.com/media/IThjAlJnD9WNO/giphy.gif"; // professional wave
    const GIF_SUCCESS = "https://media.giphy.com/media/11sBLVxNs7v6WA/giphy.gif"; // subtle smile
    const GIF_GOODBYE = "https://media.giphy.com/media/8m5dIgHoQiGec/giphy.gif"; // elegant goodbye/wave

    if (matchesAny(input, ['hi', 'hello', 'hey', 'greetings'])) {
        return { 
            text: "Hello! How can I assist you today? 😊", 
            gif: GIF_WELCOME 
        };
    }
    
    if (matchesAny(input, ['name', 'who are you'])) {
        return { 
            text: "I am Nexus, your virtual assistant. I'm here to help answer your questions.", 
            gif: null 
        };
    }
    
    if (matchesAny(input, ['how are you', 'doing well', 'good'])) {
        return { 
            text: "I'm functioning perfectly, thank you. What can we work on today? 😄", 
            gif: GIF_SUCCESS 
        };
    }
    
    if (matchesAny(input, ['weather'])) {
        return { 
            text: "While I don't have real-time weather integration yet, I recommend checking a dedicated weather app for the most accurate forecast. ⛅", 
            gif: null 
        };
    }
    
    if (matchesAny(input, ['bye', 'exit', 'quit', 'goodbye'])) {
        return { 
            text: "Goodbye! Feel free to reach out if you need assistance in the future.", 
            gif: GIF_GOODBYE 
        };
    }
    
    // Default fallback
    return { 
        text: "I'm not sure I understand. Could you please rephrase that?", 
        gif: null 
    };
}

// --- Utility Functions ---

/**
 * Helper to check if input contains any of the target keywords
 */
function matchesAny(input, keywords) {
    return keywords.some(keyword => input.includes(keyword));
}

/**
 * Appends the typing indicator dots to the chat window.
 * @returns {string} The ID of the indicator element for later removal
 */
function showTypingIndicator() {
    const id = 'typing-indicator-' + Date.now();
    
    const typingArticle = document.createElement('article');
    typingArticle.className = 'message bot-message slide-in';
    typingArticle.id = id;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    // Animated dots for typing indicator
    contentDiv.innerHTML = `
        <div class="typing-dots" aria-label="Bot is typing...">
            <span></span>
            <span></span>
            <span></span>
        </div>
    `;
    
    typingArticle.appendChild(contentDiv);
    chatBox.appendChild(typingArticle);
    scrollToBottom();
    
    return id;
}

/**
 * Removes an element by ID safely.
 */
function removeElement(id) {
    const element = document.getElementById(id);
    if (element) {
        element.remove();
    }
}

/**
 * Smoothly scrolls the chat container to the bottom.
 */
function scrollToBottom() {
    // Slight delay to ensure DOM layout has updated
    setTimeout(() => {
        chatBox.scrollTop = chatBox.scrollHeight;
    }, 10);
}

/**
 * Returns the current time formatted as HH:MM AM/PM
 */
function getCurrentTime() {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    hours = hours % 12 || 12;
    minutes = minutes.toString().padStart(2, '0');
    
    return `${hours}:${minutes} ${ampm}`;
}

/**
 * Safely plays audio, catching browser autoplay restrictions.
 */
function playSound(audioElement) {
    if (audioElement) {
        audioElement.currentTime = 0;
        audioElement.play().catch(() => {
            // Silently ignore autoplay restrictions
        });
    }
}

/**
 * Updates the theme toggle icon between moon and sun
 */
function updateThemeIcon() {
    const isDark = document.body.classList.contains('dark-mode');
    themeToggle.innerHTML = isDark 
        ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
           </svg>`
        : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
           </svg>`;
}
