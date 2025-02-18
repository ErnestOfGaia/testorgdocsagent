// Configuration
const GOOGLE_SHEETS_API_URL = 'https://script.google.com/macros/s/AKfycbzvSsoNXLnYHq1tTcxX60FI_wBwraVhN666fJfo9PgNmzM_70wTtecoegLH2YqxXvLl/exec<AKfycbzvSsoNXLnYHq1tTcxX60FI_wBwraVhN666fJfo9PgNmzM_70wTtecoegLH2YqxXvLl>/exec';
const ADMIN_NFT_CONTRACT = "0x0C41798fCc6353C1f8686aA1D43De57677B41C9A";

// NFT Contract ABI
const ADMIN_NFT_ABI = [
  {
    "inputs": [{"internalType": "address", "name": "owner", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
];

// Add to the top of script.js
const termDefinitions = {
    "multi-stakeholder cooperative": "A business owned and democratically controlled by different groups that have a stake in the organization's success, such as workers, consumers, and investors.",
    "onchain technology": "Technology that operates on a blockchain, providing transparent and immutable record-keeping of transactions and data.",
    "Public Benefit Corporation": "A for-profit corporation that includes positive impact on society, workers, the community and the environment in addition to profit as its legally defined goals.",
    "Limited Cooperative Association": "A legal entity that combines cooperative principles with limited liability protection, as defined by state law.",
    "democratic governance": "A system where members have equal voting rights in making organizational decisions.",
    "smart contract automation": "Self-executing contracts with terms directly written into code that automatically enforce and execute agreements.",
    "decentralized cooperative governance": "A governance model where decision-making power is distributed among members rather than centralized in a single authority.",
    // Add more terms and definitions
};

const legalKnowledge = {
    retirement: {
        "IRA": "Individual Retirement Account - A tax-advantaged investment account for retirement savings, governed by IRC Section 408.",
        "401(k)": "A tax-qualified, defined-contribution pension account defined in subsection 401(k) of the Internal Revenue Code.",
        "ERISA": "The Employee Retirement Income Security Act of 1974 - Federal law that sets minimum standards for retirement and health plans in private industry.",
        // Add more retirement-related terms
    },
    regulations: {
        "SEC": "Securities and Exchange Commission - Federal agency responsible for enforcing federal securities laws and regulating the securities industry.",
        "FINRA": "Financial Industry Regulatory Authority - A private corporation that acts as a self-regulatory organization.",
        // Add more regulatory terms
    }
    // Add more categories
};

// Connect wallet function
async function connectWallet() {
    if (typeof window.ethereum !== 'undefined') {
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            if (accounts.length > 0) {
                updateUIForConnectedWallet();
                return accounts[0];
            }
        } catch (error) {
            console.error('Error connecting wallet:', error);
        }
    } else {
        alert('Please install MetaMask to use this feature!');
    }
    return null;
}

// Check if wallet is admin
function checkIfAdmin(walletAddress) {
    return ADMIN_ADDRESSES.includes(walletAddress);
}

// Update UI based on connected wallet
function updateUIForConnectedWallet() {
    if (!window.ethereum || !window.ethereum.selectedAddress) {
        document.querySelectorAll('.admin-only').forEach(el => {
            el.style.display = 'none';
        });
        return;
    }
    const walletAddress = window.ethereum.selectedAddress;
    const isAdmin = checkIfAdmin(walletAddress);
    
    document.querySelectorAll('.admin-only').forEach(el => {
        el.style.display = isAdmin ? 'block' : 'none';
    });
}

// Delete suggestion
function deleteSuggestion(suggestionId) {
    const suggestion = document.getElementById(`suggestion-${suggestionId}`);
    if (suggestion) {
        suggestion.remove();
        suggestions = suggestions.filter(s => s.id !== suggestionId);
        
        // Call Google Sheets API to delete suggestion
        fetch(`${GOOGLE_SHEETS_API_ENDPOINT}?action=delete&id=${suggestionId}`, {
            method: 'POST'
        });
    }
}

// Add suggestion handling functions
function createSuggestionElement(suggestion) {
    const suggestionDiv = document.createElement('div');
    suggestionDiv.classList.add('suggestion-item');
    suggestionDiv.id = `suggestion-${suggestion.id}`;
    
    suggestionDiv.innerHTML = `
        <div class="suggestion-text">${suggestion.text}</div>
        <div class="suggestion-actions">
            <button class="vote-button" 
                    onclick="voteSuggestion('${suggestion.id}', 'up')" 
                    data-tooltip="Give this suggestion a honey pot!">
                <i class="fas fa-thumbs-up"></i>
                <span class="vote-count">${suggestion.upvotes}</span>
            </button>
            <button class="vote-button" 
                    onclick="voteSuggestion('${suggestion.id}', 'down')" 
                    data-tooltip="This suggestion needs more work">
                <i class="fas fa-thumbs-down"></i>
                <span class="vote-count">${suggestion.downvotes}</span>
            </button>
            <button class="resolve-button" 
                    onclick="showConfirmationDialog('${suggestion.id}')" 
                    data-tooltip="Mark as resolved">
                <i class="fas fa-check"></i>
            </button>
        </div>
    `;
    
    return suggestionDiv;
}

// Add confirmation dialog HTML to the page
document.body.insertAdjacentHTML('beforeend', `
    <div id="confirmationDialog" class="confirmation-dialog">
        <div class="confirmation-dialog-content">
            <h3>Resolve Suggestion?</h3>
            <p>Are you sure you want to mark this suggestion as resolved? This action cannot be undone.</p>
            <div class="confirmation-buttons">
                <button class="confirm-button" onclick="confirmResolve()">Yes, Resolve</button>
                <button class="cancel-button" onclick="closeConfirmationDialog()">Cancel</button>
            </div>
        </div>
    </div>
`);

// Confirmation dialog functions
let currentSuggestionId = null;

function showConfirmationDialog(suggestionId) {
    currentSuggestionId = suggestionId;
    document.getElementById('confirmationDialog').style.display = 'block';
}

function closeConfirmationDialog() {
    document.getElementById('confirmationDialog').style.display = 'none';
    currentSuggestionId = null;
}

function confirmResolve() {
    if (currentSuggestionId) {
        resolveSuggestion(currentSuggestionId);
        closeConfirmationDialog();
    }
}

// Updated resolveSuggestion function
function resolveSuggestion(suggestionId) {
    const suggestionElement = document.getElementById(`suggestion-${suggestionId}`);
    if (suggestionElement) {
        suggestionElement.style.animation = 'fadeOut 0.5s ease';
        
        setTimeout(() => {
            suggestionElement.remove();
            suggestions = suggestions.filter(s => s.id !== suggestionId);
            appendMessage("🐻 Suggestion has been marked as resolved and stored in my honey pot!", 'bot');
        }, 500);
    }
}

// Add click outside handler for confirmation dialog
document.addEventListener('click', function(event) {
    const dialog = document.getElementById('confirmationDialog');
    if (event.target === dialog) {
        closeConfirmationDialog();
    }
});

function voteSuggestion(suggestionId, voteType) {
    const suggestion = suggestions.find(s => s.id === suggestionId);
    if (!suggestion) return;
    
    if (voteType === 'up') {
        suggestion.upvotes++;
    } else {
        suggestion.downvotes++;
    }
    
    updateSuggestionDisplay(suggestionId);
}

// Enhance message processing to include term definitions
function processMessage(message) {
    const lowerMessage = message.toLowerCase();
    
    // Check for term definition requests
    for (const term in termDefinitions) {
        if (lowerMessage.includes(`what is ${term}`) || 
            lowerMessage.includes(`define ${term}`) ||
            lowerMessage.includes(`explain ${term}`)) {
            return `${term}: ${termDefinitions[term]}`;
        }
    }
    
    // Check for legal term requests
    for (const category in legalKnowledge) {
        for (const term in legalKnowledge[category]) {
            if (lowerMessage.includes(term.toLowerCase())) {
                return `${term}: ${legalKnowledge[category][term]}`;
            }
        }
    }
    
    // Original message processing logic...
    // (keep existing conditions)
    
    // Add more context-aware responses
    if (lowerMessage.includes('law') || lowerMessage.includes('legal')) {
        return "I can help explain various laws and regulations related to retirement accounts and cooperative organizations. What specific aspect would you like to know about?";
    }
    
    if (lowerMessage.includes('term') || lowerMessage.includes('define')) {
        return "I can help define terms used in our documentation. Which term would you like me to explain?";
    }
    
    // Default response
    return "I'm here to help you understand our organization, its terms, and related laws. Feel free to ask about specific terms or concepts!";
}

// Update submitEdit function to handle suggestion display
function submitEdit(event) {
    event.preventDefault();
    
    const section = document.getElementById('sectionSelect').value;
    const suggestionText = document.getElementById('editSuggestion').value;
    
    if (!section || !suggestionText) return;
    
    const suggestion = {
        id: Date.now().toString(),
        text: suggestionText,
        section: section,
        timestamp: new Date(),
        upvotes: 0,
        downvotes: 0
    };
    
    // Add to suggestions array
    suggestions.push(suggestion);
    
    // Add to display
    const suggestionsContainer = document.getElementById(`${section}-suggestions`);
    suggestionsContainer.appendChild(createSuggestionElement(suggestion));
    
    // Add to chat
    appendMessage(`Suggestion for ${section} section recorded:\n${suggestionText}`, 'user');
    appendMessage("Thank you for your suggestion! It has been added to the document for review.", 'bot');
    
    closeEditModal();
}

// Chat and UI state management
let chatHistory = [];
const synth = window.speechSynthesis;
let isReading = false;

// Initialize when the page loads
document.addEventListener('DOMContentLoaded', function() {
    const welcomeMessage = `Hi! I'm IRA Bear, your document assistant. I specialize in retirement accounts, cooperative structures, and US financial regulations. I can help you understand our documentation and explain any terms or concepts. What would you like to know?`;
    appendMessage(welcomeMessage, 'bot');
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

function addMessage(text, isBot = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isBot ? 'bot-message' : 'user-message'}`;
    messageDiv.textContent = text;
    
    const chatContainer = document.getElementById('chatContainer');
    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value.trim();
    
    if (message) {
        // Add user message
        addMessage(message, false);
        
        // Simulate bot response
        setTimeout(() => {
            addMessage("Hi! I'm IRA Bear. I can help you understand the document. What would you like to know?", true);
        }, 500);
        
        // Clear input
        messageInput.value = '';
    }
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

// Add to script.js
const iraBearPersonality = {
    expertise: [
        "Retirement account regulations",
        "Cooperative business structures",
        "US securities laws",
        "Tax implications of different retirement vehicles",
        "Corporate governance models"
    ],
    background: "I'm programmed with comprehensive knowledge of US retirement laws, cooperative structures, and financial regulations. I stay updated with the latest changes in relevant legislation.",
    style: "friendly and informative, using clear language to explain complex legal and financial concepts",
};

// Enhance the initial greeting
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        addMessage("Hello! I'm IRA Bear. I can help you understand the document or suggest edits. What would you like to know?", true);
    }, 500);
});

// Helper function to format timestamps
function formatTimestamp(date) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

