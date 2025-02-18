// Tab switching functionality
const tabs = document.querySelectorAll('.tab');
const content = document.getElementById('mainContent');
const sections = {
    'Section 1': 'This is the content for section 1.',
    'Section 2': 'This is the content for section 2.',
    'Section 3': 'This is the content for section 3.'
};

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        content.innerHTML = `<p>${sections[tab.textContent]}</p>`;
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
