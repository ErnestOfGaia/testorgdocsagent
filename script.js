// Chat and UI state
let chatHistory = [];
const initialGreeting = "Hello! I'm IRA Bear, your document assistant. How can I help you today?";

// Initialize chat when the page loads
document.addEventListener('DOMContentLoaded', function() {
    // Display initial greeting
    appendMessage(initialGreeting, 'bot');
    
    // Add event listener for Enter key in message input
    document.getElementById('messageInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
});

// Function to send a message
function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value.trim();
    
    if (message) {
        appendMessage(message, 'user');
        processMessage(message);
        messageInput.value = '';
    }
}

// Function to process incoming messages and generate responses
function processMessage(message) {
    // Simple response logic - can be expanded
    let response;
    
    if (message.toLowerCase().includes('edit')) {
        response = "If you'd like to suggest an edit, please use the 'Suggest Edit' button below.";
    } else if (message.toLowerCase().includes('help')) {
        response = "I can help you understand our mission, vision, and core values. You can also suggest edits to improve the content. What would you like to know?";
    } else if (message.toLowerCase().includes('mission')) {
        response = "Our mission is to provide innovative, member-focused financial solutions through our cooperative structure. Would you like me to explain any specific aspect?";
    } else if (message.toLowerCase().includes('vision')) {
        response = "Our vision focuses on providing equal access to secure retirement savings using modern technology. Would you like to know more about any particular aspect?";
    } else if (message.toLowerCase().includes('values')) {
        response = "Our core values include democratic governance, security, innovation, transparency, and cooperation. Which value would you like to learn more about?";
    } else {
        response = "I'm here to help you understand our organization better. Feel free to ask about our mission, vision, or core values!";
    }
    
    // Add slight delay to simulate processing
    setTimeout(() => {
        appendMessage(response, 'bot');
    }, 500);
}

// Function to append messages to the chat container
function appendMessage(message, sender) {
    const chatContainer = document.getElementById('chatContainer');
    const messageElement = document.createElement('div');
    messageElement.classList.add('chat-message', `${sender}-message`);
    messageElement.textContent = message;
    chatContainer.appendChild(messageElement);
    chatContainer.scrollTop = chatContainer.scrollHeight;
    
    // Add to chat history
    chatHistory.push({ message, sender });
}

// Modal functions
function openEditModal() {
    document.getElementById('editModal').style.display = 'block';
}

function closeEditModal() {
    document.getElementById('editModal').style.display = 'none';
}

// Function to handle edit submissions
function submitEdit(event) {
    event.preventDefault();
