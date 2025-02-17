// Store document content
const documentContent = {
    mission: "myIRA.Fund is a multi-stakeholder cooperative leveraging onchain technology to provide innovative, member-focused financial solutions. As a Colorado Public Benefit Corporation (PBC) operating as a Limited Cooperative Association (LCA), we are member-owned and governed, ensuring every participant has a voice in shaping their financial future.",
    vision: "We envision a future where every individual has equal access to secure, transparent, and community-driven retirement savings, leveraging AI-driven financial insights, smart contract automation, and decentralized cooperative governance.",
    values: [
        "Democratic Governance & Member Ownership",
        "Security & Compliance",
        "Innovation & Accessibility",
        "Transparency & Trust",
        "Cooperation & Collective Growth"
    ]
};

// Store suggestions
const suggestions = [];

function askQuestion() {
    const questionInput = document.getElementById('question');
    const question = questionInput.value.trim();
    
    if (!question) {
        showNotification('Please enter a question.');
        return;
    }
    
    let answer = analyzeSingleQuestion(question);
    document.getElementById('answer').innerHTML = `
        <p><strong>Q:</strong> ${question}</p>
        <p><strong>A:</strong> ${answer}</p>
    `;
    
    // Clear input after submission
    questionInput.value = '';
}

function analyzeSingleQuestion(question) {
    question = question.toLowerCase();
    
    // Enhanced keyword matching
    if (question.includes('mission') || question.includes('purpose')) {
        return documentContent.mission;
    } else if (question.includes('vision') || question.includes('future')) {
        return documentContent.vision;
    } else if (question.includes('values') || question.includes('core values') || question.includes('principles')) {
        return "Our core values are: " + documentContent.values.join(", ");
    } else if (question.includes('cooperative') || question.includes('co-op')) {
        return "myIRA.Fund is a multi-stakeholder cooperative operating as a Colorado Public Benefit Corporation (PBC) and Limited Cooperative Association (LCA).";
    } else if (question.includes('governance') || question.includes('member')) {
        return "We are member-owned and governed, ensuring every participant has a voice in shaping their financial future.";
    } else {
        return "I apologize, but I'm not sure about that specific question. Try asking about our mission, vision, core values, cooperative structure, or governance model.";
    }
}

function submitSuggestion() {
    const sectionSelect = document.getElementById('section-select');
    const suggestionInput = document.getElementById('suggestion');
    
    const section = sectionSelect.value;
    const suggestion = suggestionInput.value.trim();
    
    if (!suggestion) {
        showNotification('Please enter a suggestion.');
        return;
    }
    
    const timestamp = new Date().toLocaleString();
    suggestions.unshift({
        section,
        suggestion,
        timestamp
    });
    
    updateSuggestionsList();
    suggestionInput.value = '';
    showNotification('Suggestion submitted successfully!');
}

function updateSuggestionsList() {
    const list = document.getElementById('suggestions-list');
    list.innerHTML = suggestions.map(s => `
        <li>
            <strong>${capitalizeFirstLetter(s.section)}</strong>
            <span class="timestamp">${s.timestamp}</span>
            <p>${s.suggestion}</p>
        </li>
    `).join('');
}

function showNotification(message) {
    // You can enhance this with a proper notification system
    alert(message);
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Add these functions to your existing JavaScript

// Initialize speech synthesis
const speechSynthesis = window.speechSynthesis;
let currentUtterance = null;

// Bear voice settings
const bearVoiceSettings = {
    pitch: 0.8,  // Slightly deeper voice
    rate: 0.9,   // Slightly slower
    volume: 1
};

// Reading states
let isReading = false;
let activeButton = null;

function readSection(section) {
    // If already reading, stop current reading
    if (isReading) {
        stopReading();
        return;
    }

    const button = event.currentTarget;
    let textToRead = '';

    // Get text based on section
    switch(section) {
        case 'mission':
            textToRead = document.getElementById('mission-text').textContent;
            break;
        case 'vision':
            textToRead = document.getElementById('vision-text').textContent;
            break;
        case 'values':
            textToRead = "Our core values are: " + 
                        Array.from(document.getElementById('values-text').children)
                            .map(li => li.textContent)
                            .join(". ");
            break;
    }

    // Create and configure utterance
    const utterance = new SpeechSynthesisUtterance(textToRead);
    Object.assign(utterance, bearVoiceSettings);

    // Add bear personality
    const bearIntro = {
        mission: "Hey there! IRA Bear here. Let me tell you about our amazing mission!",
        vision: "Oh boy! Let me share our exciting vision with you!",
        values: "These values are beary important to us!"
    };

    // Combine intro and content
    utterance.text = bearIntro[section] + " " + textToRead;

    // Handle start of speech
    utterance.onstart = () => {
        isReading = true;
        button.classList.add('playing');
        button.innerHTML = '<i class="fas fa-pause"></i>';
        activeButton = button;
    };

    // Handle end of speech
    utterance.onend = () => {
        stopReading();
    };

    // Handle errors
    utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        stopReading();
    };

    // Store current utterance and start speaking
    currentUtterance = utterance;
    speechSynthesis.speak(utterance);
}

function stopReading() {
    if (currentUtterance) {
        speechSynthesis.cancel();
    }
    isReading = false;
    if (activeButton) {
        activeButton.classList.remove('playing');
        activeButton.innerHTML = '<i class="fas fa-play"></i>';
        activeButton = null;
    }
}

// Create a simple bear mascot animation
document.addEventListener('DOMContentLoaded', () => {
    // Add random bear movements
    const mascot = document.querySelector('.mascot-image');
    if (mascot) {
        setInterval(() => {
            const randomAnimation = Math.random() > 0.5 ? 'bounce' : 'pulse';
            mascot.style.animation = `${randomAnimation} 2s`;
            setTimeout(() => {
                mascot.style.animation = '';
            }, 2000);
        }, 5000);
    }
}
                         
    // Add these new features to the existing script.js

// Enhanced document content with context and explanations
const documentContext = {
    mission: {
        text: documentContent.mission,
        keywords: ['cooperative', 'technology', 'member', 'PBC', 'LCA', 'governance'],
        context: {
            'cooperative': 'A business owned and managed by its members for their benefit',
            'PBC': 'Public Benefit Corporation - a for-profit corporation with a social mission',
            'LCA': 'Limited Cooperative Association - combines cooperative and LLC features'
        }
    },
    vision: {
        text: documentContent.vision,
        keywords: ['DeFi', 'AI', 'smart contract', 'retirement', 'savings'],
        context: {
            'DeFi': 'Decentralized Finance - blockchain-based financial services',
            'smart contract': 'Self-executing contracts with terms directly written into code'
        }
    },
    values: {
        text: documentContent.values,
        keywords: ['governance', 'compliance', 'innovation', 'transparency', 'cooperation']
    }
};

// IRA Bear's personalities
const bearPersonalities = {
    helpful: {
        intros: [
            "🐻 Greetings! IRA Bear at your service!",
            "🐻 Hi there! Let me help you understand that!",
            "🐻 Oh, great question! Let me explain!"
        ],
        uncertain: [
            "🤔 Hmm, let me think about that...",
            "🐻 That's an interesting question! Let me try to help..."
        ]
    },
    educational: {
        intros: [
            "🎓 Bear Professor here! Let me break this down...",
            "📚 Here's what you need to know..."
        ]
    },
    playful: {
        reactions: [
            "🍯 Sweet question!",
            "🐾 Paw-some suggestion!",
            "🌲 Let's break this down bear-style!"
        ]
    }
};

// Enhanced question handling
function askQuestion() {
    const questionInput = document.getElementById('question');
    const question = questionInput.value.trim().toLowerCase();
    
    if (!question) {
        showBearMessage("🐻 Don't be shy! Ask me anything about myIRA.Fund!");
        return;
    }

    // Get random personality intro
    const intro = bearPersonalities.helpful.intros[Math.floor(Math.random() * bearPersonalities.helpful.intros.length)];
    
    // Analyze question and generate response
    const answer = generateBearResponse(question);
    
    // Display response with bear personality
    const answerBox = document.getElementById('answer');
    answerBox.innerHTML = `
        <div class="bear-response">
            <p class="bear-intro">${intro}</p>
            <p class="bear-answer">${answer}</p>
            ${generateRelatedInfo(question)}
        </div>
    `;

    // Animate bear when responding
    animateBearResponse();
    
    // Clear input after response
    questionInput.value = '';
}

function generateBearResponse(question) {
    // Check for specific keyword matches
    for (const [section, content] of Object.entries(documentContext)) {
        for (const keyword of content.keywords) {
            if (question.includes(keyword.toLowerCase())) {
                return explainConcept(keyword, section);
            }
        }
    }

    // Check for section-specific questions
    if (question.includes('mission')) {
        return `The mission of myIRA.Fund is all about bringing together cooperative principles and modern technology. ${documentContent.mission}`;
    } else if (question.includes('vision')) {
        return `Our vision is super exciting! ${documentContent.vision}`;
    } else if (question.includes('values') || question.includes('principles')) {
        return `Our values are the honey that keeps us together! We believe in: ${documentContent.values.join(', ')}`;
    }

    // General questions about the organization
    if (question.includes('what is') || question.includes('tell me about')) {
        return `myIRA.Fund is a innovative cooperative that combines traditional retirement planning with modern blockchain technology. We're member-owned and focused on providing secure, transparent financial solutions.`;
    }

    // Default response
    return `I'm not quite sure about that specific question, but I'd be happy to tell you about our mission, vision, or values! Just ask about any of those topics!`;
}

function explainConcept(keyword, section) {
    const context = documentContext[section].context;
    if (context && context[keyword]) {
        return `${context[keyword]}. This is important because ${documentContent[section]}`;
    }
    return documentContent[section];
}

// Enhanced suggestion handling
function submitSuggestion() {
    const sectionSelect = document.getElementById('section-select');
    const suggestionInput = document.getElementById('suggestion');
    
    const section = sectionSelect.value;
    const suggestion = suggestionInput.value.trim();
    
    if (!suggestion) {
        showBearMessage("🐻 Oops! Please write your suggestion first!");
        return;
    }

    // Get random playful reaction
    const reaction = bearPersonalities.playful.reactions[Math.floor(Math.random() * bearPersonalities.playful.reactions.length)];
    
    const timestamp = new Date().toLocaleString();
    suggestions.unshift({
        section,
        suggestion,
        timestamp,
        status: 'pending'
    });
    
    updateSuggestionsList();
    suggestionInput.value = '';
    
    showBearMessage(`${reaction} Thanks for your suggestion for our ${section}! I'll make sure the team sees it!`);
}

// Enhanced suggestions list display
function updateSuggestionsList() {
    const list = document.getElementById('suggestions-list');
    list.innerHTML = suggestions.map(s => `
        <li class="suggestion-item ${s.status}">
            <div class="suggestion-header">
                <strong>${capitalizeFirstLetter(s.section)}</strong>
                <span class="timestamp">${s.timestamp}</span>
            </div>
            <p class="suggestion-text">${s.suggestion}</p>
            <div class="suggestion-status">
                Status: ${capitalizeFirstLetter(s.status)}
            </div>
        </li>
    `).join('');
}

// Bear UI feedback
function showBearMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'bear-message';
    messageDiv.textContent = message;
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.classList.add('show');
        setTimeout(() => {
            messageDiv.classList.remove('show');
            setTimeout(() => {
                messageDiv.remove();
            }, 300);
        }, 3000);
    }, 100);
}

// Bear animations
function animateBearResponse() {
    const mascot = document.querySelector('.mascot-image');
    if (mascot) {
        mascot.classList.add('talking');
        setTimeout(() => {
            mascot.classList.remove('talking');
        }, 2000);
    }
}

// Add these new styles to your styles.css:

// Initialize the suggestions list
document.addEventListener('DOMContentLoaded', () => {
    updateSuggestionsList();
});
