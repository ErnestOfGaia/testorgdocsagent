// Chat and UI state management
let chatHistory = [];
const synth = window.speechSynthesis;
let isReading = false;

// Initialize when the page loads
document.addEventListener('DOMContentLoaded', function() {
    // Display welcome message
    const welcomeMessage = "Hi! I'm IRA Bear, your document assistant. I can help you understand our mission, vision, and core values. You can also suggest edits to improve the content. What would you like to know?";
    appendMessage(welcomeMessage, 'bot');
    
    // Add event listeners
    setupEventListeners();
});

function setupEventListeners() {
    // Message input enter key handler
    document.getElementById('messageInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        const modal = document.getElementById('editModal');
        if (e.target === modal) {
            closeEditModal();
        }
    });

    // Stop reading when play button is clicked again
    document.querySelectorAll('.play-button').forEach(button => {
        button.addEventListener('click', function() {
            if (isReading) {
                stopReading();
            }
        });
    });
}

// Message handling functions
function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value.trim();
    
    if (message) {
        appendMessage(message, 'user');
        processMessage(message);
        messageInput.value = '';
    }
}

function processMessage(message) {
    // Convert message to lowercase for easier matching
    const lowerMessage = message.toLowerCase();
    
    // Prepare response based on message content
    let response;
    
    if (lowerMessage.includes('mission')) {
        response = "Our mission focuses on being a member-owned cooperative that uses blockchain technology for financial solutions. We're structured as a Colorado Public Benefit Corporation and Limited Cooperative Association. Would you like me to explain any specific part of our mission?";
    }
    else if (lowerMessage.includes('vision')) {
        response = "Our vision is about creating equal access to retirement savings using modern technology like AI and smart contracts. We want to make retirement planning more accessible and community-driven. What aspect of our vision interests you most?";
    }
    else if (lowerMessage.includes('values')) {
        response = "We have five core values: Democratic Governance, Security & Compliance, Innovation & Accessibility, Transparency & Trust, and Cooperation & Growth. Which value would you like to learn more about?";
    }
    else if (lowerMessage.includes('edit') || lowerMessage.includes('change') || lowerMessage.includes('suggest')) {
        response = "You can suggest edits by clicking the 'Suggest Edit' button below. Choose the section you want to edit and provide your suggested changes.";
    }
    else if (lowerMessage.includes('help') || lowerMessage.includes('what') || lowerMessage.includes('how')) {
        response = "I can help you understand our organization's mission, vision, and values. You can:\n1. Ask questions about any section\n2. Request explanations of specific terms\n3. Suggest edits to improve the content\n\nWhat would you like to know more about?";
    }
    else {
        response = "I'm here to help you understand our organization better. Feel free to ask about our mission, vision, or core values. You can also suggest edits if you think something could be improved.";
    }
    
    // Add slight delay to simulate processing
    setTimeout(() => {
        appendMessage(response, 'bot');
    }, 500);
}

function appendMessage(message, sender) {
    const chatContainer = document.getElementById('chatContainer');
    const messageElement = document.createElement('div');
    messageElement.classList.add('chat-message', `${sender}-message`);
    messageElement.textContent = message;
    
    chatContainer.appendChild(messageElement);
    chatContainer.scrollTop = chatContainer.scrollHeight;
    
    // Add to chat history
    chatHistory.push({ message, sender, timestamp: new Date() });
}

// Text-to-Speech functions
function readSection(sectionId) {
    if (isReading) {
        stopReading();
        return;
    }

    const section = document.getElementById(`${sectionId}-text`);
    if (!section) return;

    const text = section.textContent;
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Configure speech settings
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    // Update UI and state
    isReading = true;
    const button = section.parentElement.querySelector('.play-button i');
    button.classList.remove('fa-play');
    button.classList.add('fa-pause');
    
    // Handle speech end
    utterance.onend = function() {
        isReading = false;
        button.classList.remove('fa-pause');
        button.classList.add('fa-play');
    };
    
    synth.speak(utterance);
}

function stopReading() {
    if (synth.speaking) {
        synth.cancel();
    }
    isReading = false;
    
    // Reset all play buttons
    document.querySelectorAll('.play-button i').forEach(icon => {
        icon.classList.remove('fa-pause');
        icon.classList.add('fa-play');
    });
}

// Modal handling functions
function openEditModal() {
    document.getElementById('editModal').style.display = 'block';
    document.getElementById('sectionSelect').value = '';
    document.getElementById('editSuggestion').value = '';
}

function closeEditModal() {
    document.getElementById('editModal').style.display = 'none';
}

function submitEdit(event) {
    event.preventDefault();
    
    const section = document.getElementById('sectionSelect').value;
    const suggestion = document.getElementById('editSuggestion').value;
    
    if (!section || !suggestion) return;
    
    // Create confirmation message
    const confirmMessage = `Thank you for your suggestion to improve the ${section} section! Your edit has been recorded and will be reviewed.`;
    
    // Add suggestion to chat
    appendMessage(`I suggest editing the ${section} section:\n${suggestion}`, 'user');
    appendMessage(confirmMessage, 'bot');
    
    // Store suggestion (you can implement your storage logic here)
    const editSuggestion = {
        section,
        suggestion,
        timestamp: new Date(),
    };
    console.log('Edit suggestion:', editSuggestion);
    
    // Close modal
    closeEditModal();
}

// Helper function to format timestamps
function formatTimestamp(date) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
