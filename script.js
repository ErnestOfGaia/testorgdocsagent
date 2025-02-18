// Constants and Configuration
const CONFIG = {
    ANIMATION_DURATION: 500,
    RESPONSE_DELAY: 500,
    DEBOUNCE_DELAY: 300
};

// Knowledge Base
const termDefinitions = {
    "multi-stakeholder cooperative": "A business owned and democratically controlled by different groups that have a stake in the organization's success, such as workers, consumers, and investors.",
    "onchain technology": "Technology that operates on a blockchain, providing transparent and immutable record-keeping of transactions and data.",
    "Public Benefit Corporation": "A for-profit corporation that includes positive impact on society, workers, the community and the environment in addition to profit as its legally defined goals.",
    "Limited Cooperative Association": "A legal entity that combines cooperative principles with limited liability protection, as defined by state law.",
    "democratic governance": "A system where members have equal voting rights in making organizational decisions.",
    "smart contract automation": "Self-executing contracts with terms directly written into code that automatically enforce and execute agreements.",
    "decentralized cooperative governance": "A governance model where decision-making power is distributed among members rather than centralized in a single authority."
};

const legalKnowledge = {
    retirement: {
        "IRA": "Individual Retirement Account - A tax-advantaged investment account for retirement savings, governed by IRC Section 408.",
        "401(k)": "A tax-qualified, defined-contribution pension account defined in subsection 401(k) of the Internal Revenue Code.",
        "ERISA": "The Employee Retirement Income Security Act of 1974 - Federal law that sets minimum standards for retirement and health plans in private industry."
    },
    regulations: {
        "SEC": "Securities and Exchange Commission - Federal agency responsible for enforcing federal securities laws and regulating the securities industry.",
        "FINRA": "Financial Industry Regulatory Authority - A private corporation that acts as a self-regulatory organization."
    }
};

// State Management
let state = {
    chatHistory: [],
    suggestions: [],
    isReading: false,
    currentSuggestionId: null,
    synth: window.speechSynthesis
};

// Utility Functions
const utils = {
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    formatTimestamp: (date) => {
        return date.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    },

    generateId: () => `suggestion-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
};

// DOM Manipulation
const DOM = {
    getElement: (id) => document.getElementById(id),
    
    createElement: (type, className, innerHTML) => {
        const element = document.createElement(type);
        if (className) element.className = className;
        if (innerHTML) element.innerHTML = innerHTML;
        return element;
    },

    createSuggestionElement: (suggestion) => {
        const suggestionDiv = DOM.createElement('div', 'suggestion-item');
        suggestionDiv.id = `suggestion-${suggestion.id}`;
        
        suggestionDiv.innerHTML = `
            <div class="suggestion-header">
                <span class="section-badge">${suggestion.section}</span>
                <span class="timestamp">${utils.formatTimestamp(suggestion.timestamp)}</span>
            </div>
            <div class="suggestion-text">${suggestion.text}</div>
            <div class="suggestion-actions">
                <button class="vote-button" 
                    onclick="suggestionHandler.vote('${suggestion.id}', 'up')" 
                    data-tooltip="Give this suggestion a honey pot!">
                    <i class="fas fa-thumbs-up"></i>
                    <span class="vote-count">${suggestion.upvotes}</span>
                </button>
                <button class="vote-button" 
                    onclick="suggestionHandler.vote('${suggestion.id}', 'down')" 
                    data-tooltip="This suggestion needs more work">
                    <i class="fas fa-thumbs-down"></i>
                    <span class="vote-count">${suggestion.downvotes}</span>
                </button>
                <button class="resolve-button" 
                    onclick="suggestionHandler.showConfirmDialog('${suggestion.id}')" 
                    data-tooltip="Mark as resolved">
                    <i class="fas fa-check"></i>
                </button>
            </div>
        `;
        
        return suggestionDiv;
    }
};

// Suggestion Handler
const suggestionHandler = {
    vote: (id, type) => {
        const suggestion = state.suggestions.find(s => s.id === id);
        if (!suggestion) return;

        if (type === 'up') {
            suggestion.upvotes++;
        } else {
            suggestion.downvotes++;
        }

        const voteCount = DOM.getElement(`suggestion-${id}`)
            .querySelector(`.vote-button:${type === 'up' ? 'first' : 'last'}-of-type .vote-count`);
        voteCount.textContent = type === 'up' ? suggestion.upvotes : suggestion.downvotes;
    },

    showConfirmDialog: (id) => {
        state.currentSuggestionId = id;
        DOM.getElement('confirmationDialog').style.display = 'block';
    },

    resolve: (id) => {
        const element = DOM.getElement(`suggestion-${id}`);
        if (!element) return;

        element.style.animation = 'fadeOut 0.5s ease';
        
        setTimeout(() => {
            element.remove();
            state.suggestions = state.suggestions.filter(s => s.id !== id);
            chatHandler.appendMessage("🐻 Suggestion has been marked as resolved and stored in my honey pot!", 'bot');
        }, CONFIG.ANIMATION_DURATION);
    }
};

// Chat Handler
const chatHandler = {
    appendMessage: (message, sender) => {
        const container = DOM.getElement('chatContainer');
        const messageElement = DOM.createElement('div', `chat-message ${sender}-message`, message);
        
        container.appendChild(messageElement);
        container.scrollTop = container.scrollHeight;
        
        state.chatHistory.push({ 
            message, 
            sender, 
            timestamp: new Date() 
        });
    },

    processMessage: utils.debounce((message) => {
        const lowerMessage = message.toLowerCase();
        let response;

        // Check for term definitions
        for (const term in termDefinitions) {
            if (lowerMessage.includes(`what is ${term}`) || 
                lowerMessage.includes(`define ${term}`) ||
                lowerMessage.includes(`explain ${term}`)) {
                response = `${term}: ${termDefinitions[term]}`;
                break;
            }
        }

        // Check for legal terms
        if (!response) {
            for (const category in legalKnowledge) {
                for (const term in legalKnowledge[category]) {
                    if (lowerMessage.includes(term.toLowerCase())) {
                        response = `${term}: ${legalKnowledge[category][term]}`;
                        break;
                    }
                }
                if (response) break;
            }
        }

        // Context-based responses
        if (!response) {
            if (lowerMessage.includes('mission')) {
                response = "Our mission focuses on being a member-owned cooperative that uses blockchain technology for financial solutions. Would you like me to explain any specific part?";
            } else if (lowerMessage.includes('vision')) {
                response = "Our vision is about creating equal access to retirement savings using modern technology. What aspect interests you most?";
            } else if (lowerMessage.includes('values')) {
                response = "We have five core values: Democratic Governance, Security & Compliance, Innovation & Accessibility, Transparency & Trust, and Cooperation & Growth. Which would you like to learn more about?";
            } else {
                response = "I'm here to help you understand our organization better. Feel free to ask about our mission, vision, or core values!";
            }
        }

        setTimeout(() => {
            chatHandler.appendMessage(response, 'bot');
        }, CONFIG.RESPONSE_DELAY);
    }, CONFIG.DEBOUNCE_DELAY)
};

// Text-to-Speech Handler
const speechHandler = {
    readSection: (sectionId) => {
        if (state.isReading) {
            speechHandler.stop();
            return;
        }

        const section = DOM.getElement(`${sectionId}-text`);
        if (!section) return;

        const utterance = new SpeechSynthesisUtterance(section.textContent);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        
        state.isReading = true;
        const button = section.parentElement.querySelector('.play-button i');
        button.classList.replace('fa-play', 'fa-pause');
        
        utterance.onend = () => {
            state.isReading = false;
            button.classList.replace('fa-pause', 'fa-play');
        };
        
        state.synth.speak(utterance);
    },

    stop: () => {
        if (state.synth.speaking) {
            state.synth.cancel();
        }
        state.isReading = false;
        document.querySelectorAll('.play-button i')
            .forEach(icon => icon.classList.replace('fa-pause', 'fa-play'));
    }
};

// Event Handlers
const eventHandlers = {
    sendMessage: () => {
        const input = DOM.getElement('messageInput');
        const message = input.value.trim();
        
        if (message) {
            chatHandler.appendMessage(message, 'user');
            chatHandler.processMessage(message);
            input.value = '';
        }
    },

    submitEdit: (event) => {
        event.preventDefault();
        
        const section = DOM.getElement('sectionSelect').value;
        const text = DOM.getElement('editSuggestion').value;
        
        if (!section || !text) return;
        
        const suggestion = {
            id: utils.generateId(),
            text,
            section,
            timestamp: new Date(),
            upvotes: 0,
            downvotes: 0
        };
        
        state.suggestions.push(suggestion);
        
        const container = DOM.getElement(`${section}-suggestions`);
        container.appendChild(DOM.createSuggestionElement(suggestion));
        
        chatHandler.appendMessage(`Suggestion for ${section} section:\n${text}`, 'user');
        chatHandler.appendMessage("Thank you for your suggestion! It has been added for review.", 'bot');
        
        modalHandler.close();
    }
};

// Modal Handler
const modalHandler = {
    open: () => {
        DOM.getElement('editModal').style.display = 'block';
        DOM.getElement('sectionSelect').value = '';
        DOM.getElement('editSuggestion').value = '';
    },

    close: () => {
        DOM.getElement('editModal').style.display = 'none';
    }
};

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    // Welcome message
    chatHandler.appendMessage(
        "Hi! I'm IRA Bear, your document assistant. I can help you understand our mission, vision, and core values. What would you like to know?",
        'bot'
    );

    // Event listeners
    DOM.getElement('messageInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            eventHandlers.sendMessage();
        }
    });

    window.addEventListener('click', (e) => {
        if (e.target === DOM.getElement('editModal')) {
            modalHandler.close();
        }
        if (e.target === DOM.getElement('confirmationDialog')) {
            DOM.getElement('confirmationDialog').style.display = 'none';
        }
    });

    document.querySelectorAll('.play-button').forEach(button => {
        button.addEventListener('click', () => {
            if (state.isReading) {
                speechHandler.stop();
            }
        });
    });
});
