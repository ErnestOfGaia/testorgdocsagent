// Tab switching functionality
const tabs = document.querySelectorAll('.tab');
const content = document.getElementById('mainContent');

// Function to load HTML content
async function loadContent(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const content = await response.text();
        return content;
    } catch (error) {
        console.error('Error loading content:', error);
        return '<p>Error loading content. Please try again.</p>';
    }
}

// Handle tab switching
tabs.forEach(tab => {
    tab.addEventListener('click', async () => {
        // Remove active class from all tabs
        tabs.forEach(t => t.classList.remove('active'));
        // Add active class to clicked tab
        tab.classList.add('active');
        
        // Load appropriate content based on tab
        if (tab.textContent === 'Section 1') {
            const sectionContent = await loadContent('section1.html');
            content.innerHTML = sectionContent;
        } else if (tab.textContent === 'Section 2') {
            content.innerHTML = '<p>This is the content for section 2.</p>';
        } else if (tab.textContent === 'Section 3') {
            content.innerHTML = '<p>This is the content for section 3.</p>';
        }
    });
});

// Chatbot functionality
const chatInput = document.querySelector('.chat-input input');
const chatButton = document.querySelector('.chat-input button');
const chatMessages = document.getElementById('chatMessages');
const suggestionsList = document.getElementById('suggestionsList');
let suggestions = [];

function addMessage(message, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.style.marginBottom = '10px';
    messageDiv.style.textAlign = isUser ? 'right' : 'left';
    messageDiv.innerHTML = `<strong>${isUser ? 'You' : 'Bear'}</strong>: ${message}`;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function addSuggestion(suggestion) {
    suggestions.push(suggestion);
    updateSuggestionsList();
}

function updateSuggestionsList() {
    suggestionsList.innerHTML = suggestions.map((suggestion, index) => `
        <div class="suggestion-item">
            <span>${suggestion}</span>
            <button class="remove-suggestion" onclick="removeSuggestion(${index})">✓</button>
        </div>
    `).join('');
}

function removeSuggestion(index) {
    suggestions.splice(index, 1);
    updateSuggestionsList();
}

chatButton.addEventListener('click', () => {
    const message = chatInput.value.trim();
    if (message) {
        addMessage(message, true);
        // Simulate bear response
        setTimeout(() => {
            const suggestion = `Consider revising: "${message}"`;
            addMessage(`I suggest: ${suggestion}`);
            addSuggestion(suggestion);
        }, 500);
        chatInput.value = '';
    }
});

chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        chatButton.click();
    }
});

// Load Section 1 content by default when the page loads
window.addEventListener('DOMContentLoaded', async () => {
    const sectionContent = await loadContent('section1.html');
    content.innerHTML = sectionContent;
});
