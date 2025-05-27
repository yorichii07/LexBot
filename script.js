// Define category keywords and their related category names
const categoryKeywords = {
    'traffic': 'Traffic Laws',
    'cyber': 'Cyber Laws',
    'property': 'Property Laws',
    'criminal': 'Criminal Laws',
    'family': 'Family Laws',
    'corporate': 'Corporate Laws',
    'environmental': 'Environmental Laws',
    'labor': 'Labor Laws',
    'tax': 'Tax Laws',
    'constitutional': 'Constitutional Laws',
    'intellectual': 'Intellectual Property Laws',
    'international': 'International Laws',
    'healthcare': 'Healthcare Laws',
    'education': 'Education Laws',
    'immigration': 'Immigration Laws',
    'banking': 'Banking Laws',
    'insurance': 'Insurance Laws',
    'real estate': 'Real Estate Laws',
    'consumer': 'Consumer Protection Laws',
    'media': 'Media and Entertainment Laws'
};

// Function to find the related category based on user input
function findCategory(input) {
    const words = input.toLowerCase().split(' ');
    for (const word of words) {
        if (categoryKeywords[word]) {
            return categoryKeywords[word];
        }
    }
    // Check for partial matches
    for (const keyword in categoryKeywords) {
        if (input.toLowerCase().includes(keyword)) {
            return categoryKeywords[keyword];
        }
    }
    return null;
}

// Function to get detailed information about laws in India for a given category or subcategory from local JSON
async function getLawDetails(category, subcategory = null) {
    try {
        const response = await fetch('lawdata.json');
        if (!response.ok) {
            throw new Error('Could not load laws data');
        }
        const data = await response.json();
        // Helper to format a law object
        function formatLaw(law) {
            if (typeof law === 'string') {
                return law;
            }
            if (law.law && law.description) {
                return `📜 ${law.law}\n${law.description}`;
            }
            return JSON.stringify(law);
        }
        if (subcategory && data[category] && data[category][subcategory]) {
            return data[category][subcategory].map(formatLaw).join('\n\n');
        } else if (data[category]) {
            // Return all subcategories and their laws
            return Object.entries(data[category])
                .map(([sub, laws]) => `${sub}:\n${laws.map(formatLaw).join('\n\n')}`)
                .join('\n\n');
        } else {
            return 'No detailed information available for this category or subcategory.';
        }
    } catch (error) {
        console.error('Error fetching law details:', error);
        return 'Error fetching law details. Please try again later.';
    }
}

// Function to get subcategories for a given category
function getSubcategories(category) {
    const subcategories = {
        'Traffic Laws': ['Speed Limits', 'Drunk Driving', 'Helmet Rules'],
        'Cyber Laws': ['Data Privacy', 'Cybercrime', 'Digital Signatures'],
        'Property Laws': ['Land Rights', 'Property Tax', 'Ownership Disputes'],
        'Criminal Laws': ['Theft', 'Assault', 'Fraud'],
        'Family Laws': ['Marriage', 'Divorce', 'Child Custody'],
        'Corporate Laws': ['Company Formation', 'Tax Compliance', 'Consumer Rights'],
        'Environmental Laws': ['Pollution Control', 'Wildlife Protection', 'Climate Change'],
        'Labor Laws': ['Worker Rights', 'Workplace Safety', 'Minimum Wage'],
        'Tax Laws': ['Income Tax', 'GST', 'VAT'],
        'Constitutional Laws': ['Fundamental Rights', 'Duties', 'Separation of Powers'],
        'Intellectual Property Laws': ['Copyright', 'Trademarks', 'Patents'],
        'International Laws': ['Diplomatic Relations', 'Trade', 'Human Rights'],
        'Healthcare Laws': ['Patient Rights', 'Malpractice', 'Health Insurance'],
        'Education Laws': ['Right to Education', 'School Regulations', 'Student Loans'],
        'Immigration Laws': ['Visas', 'Residency', 'Citizenship'],
        'Banking Laws': ['Loans', 'Credit', 'Investment Protection'],
        'Insurance Laws': ['Insurance Companies', 'Policies', 'Regulations'],
        'Real Estate Laws': ['Real Estate Transactions', 'Buyer Protection', 'Property Regulations'],
        'Consumer Protection Laws': ['Consumer Rights', 'Product Liability', 'Advertising'],
        'Media and Entertainment Laws': ['Films', 'Television', 'Digital Media']
    };
    return subcategories[category] || [];
}

// Add styles for the chat container and messages
const style = document.createElement('style');
style.textContent = `
    .chat-container {
        max-width: 800px;
        margin: 0 auto;
        background: #f8f9fa;
        border-radius: 15px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        height: calc(100vh - 200px); /* Increased space from bottom */
        display: flex;
        flex-direction: column;
        position: fixed;
        top: 80px;
        left: 50%;
        transform: translateX(-50%);
        width: 90%;
        max-width: 800px;
        z-index: 100;
        bottom: 80px; /* Increased bottom spacing */
    }

    .chat-header {
        background: #2c3e50;
        color: white;
        padding: 12px 20px;
        font-size: 1.2em;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 10px;
        flex-shrink: 0;
    }

    .chat-header::before {
        content: '🤖';
        font-size: 1.4em;
    }

    .chat-messages {
        flex: 1;
        overflow-y: auto;
        padding: 10px 20px;
        display: flex;
        flex-direction: column;
        gap: 8px;
        height: calc(100% - 100px); /* Adjusted for new container height */
    }

    .user-message {
        background: #e3f2fd;
        color: #1565c0;
        padding: 12px 18px;
        border-radius: 15px 15px 0 15px;
        max-width: 80%;
        align-self: flex-end;
        animation: slideIn 0.3s ease-out;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }

    .bot-message {
        background: #007bff;
        color: white;yy
        margin: 2px 0;
        padding: 8px 12px;
        border-radius: 15px 15px 15px 0;
        max-width: 85%;
        align-self: flex-start;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        animation: slideIn 0.3s ease-out;
        white-space: pre-line;
        font-size: 14px;
        line-height: 1.4;
    }

    .bot-message strong {
        color: #fff;
        font-size: 1.1em;
        display: block;
        margin-bottom: 5px;
    }

    .input-container {
        padding: 10px 15px;
        background: white;
        border-top: 1px solid #eee;
        display: flex;
        gap: 10px;
        position: sticky;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 10;
        flex-shrink: 0;
    }

    #user-input {
        flex: 1;
        padding: 12px 15px;
        border: 2px solid #e0e0e0;
        border-radius: 25px;
        font-size: 14px;
        transition: all 0.3s ease;
    }

    #user-input:focus {
        outline: none;
        border-color: #007bff;
        box-shadow: 0 0 0 3px rgba(0,123,255,0.1);
    }

    #send-button {
        background: #007bff;
        color: white;
        border: none;
        padding: 12px 25px;
        border-radius: 25px;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 5px;
    }

    #send-button:hover {
        background: #0056b3;
        transform: translateY(-1px);
    }

    #micButton {
        background: #28a745;
        color: white;
        border: none;
        padding: 12px;
        border-radius: 50%;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    #micButton:hover {
        background: #218838;
        transform: scale(1.05);
    }

    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }

    .typing-indicator {
        display: flex;
        gap: 5px;
        padding: 10px 15px;
        background: #e9ecef;
        border-radius: 15px;
        width: fit-content;
        margin: 5px 0;
    }

    .typing-dot {
        width: 8px;
        height: 8px;
        background: #6c757d;
        border-radius: 50%;
        animation: typingAnimation 1s infinite ease-in-out;
    }

    .typing-dot:nth-child(2) { animation-delay: 0.2s; }
    .typing-dot:nth-child(3) { animation-delay: 0.4s; }

    @keyframes typingAnimation {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-5px); }
    }

    /* Scrollbar styling */
    .chat-messages::-webkit-scrollbar {
        width: 8px;
    }

    .chat-messages::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 4px;
    }

    .chat-messages::-webkit-scrollbar-thumb {
        background: #888;
        border-radius: 4px;
    }

    .chat-messages::-webkit-scrollbar-thumb:hover {
        background: #555;
    }
`;
document.head.appendChild(style);

// Initialize the chat container
document.addEventListener('DOMContentLoaded', () => {
    // Get references to elements
    const sendButton = document.getElementById('send-button');
    const userInput = document.getElementById('user-input');
    const micButton = document.getElementById('micButton');
    const chatMessages = document.getElementById('chat-messages');

    // Function to add a message to the chat
    function addMessage(text, isUser = false) {
        const message = document.createElement('div');
        message.className = isUser ? 'user-message' : 'bot-message';
        message.textContent = text;
        chatMessages.appendChild(message);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Add welcome message
    const welcomeMessage = document.createElement('div');
    welcomeMessage.className = 'bot-message';
    welcomeMessage.style.padding = '8px 12px';
    welcomeMessage.style.margin = '5px 0';
    welcomeMessage.style.fontSize = '14px';
    welcomeMessage.style.lineHeight = '1.3';
    welcomeMessage.innerHTML = `
        <strong>👋 Hello!</strong>
        How can I help you today?
    `;
    chatMessages.appendChild(welcomeMessage);

    // Function to process user input
    async function processUserInput() {
        const input = userInput.value.trim();
        if (input === '') return;

        // Add user message
        addMessage(input, true);

        // Clear input
        userInput.value = '';

        try {
            // First check for exact subcategory match across all categories
            let matchedCategory = null;
            let matchedSubcategory = null;
            
            const allCategories = Object.keys(categoryKeywords).map(k => categoryKeywords[k]);
            const uniqueCategories = [...new Set(allCategories)];
            
            for (const cat of uniqueCategories) {
                const subcategories = getSubcategories(cat);
                const exactMatch = subcategories.find(sub => 
                    input.toLowerCase() === sub.toLowerCase()
                );
                if (exactMatch) {
                    matchedCategory = cat;
                    matchedSubcategory = exactMatch;
                    break;
                }
            }

            if (matchedCategory && matchedSubcategory) {
                // Direct match found - show law details immediately
                const lawDetails = await getLawDetails(matchedCategory, matchedSubcategory);
                addMessage(`Here are the details about ${matchedSubcategory}:`);

                const laws = lawDetails.split('\n\n').filter(law => law.trim());
                laws.forEach(law => {
                    const lawMessage = document.createElement('div');
                    lawMessage.className = 'bot-message';
                    lawMessage.style.whiteSpace = 'pre-line';
                    lawMessage.style.fontSize = '14px';
                    lawMessage.style.lineHeight = '1.4';
                    
                    if (law.startsWith('📜')) {
                        const [title, description] = law.split('\n');
                        lawMessage.innerHTML = `<strong>${title}</strong>\n${description}`;
                    } else {
                        lawMessage.textContent = law;
                    }
                    
                    chatMessages.appendChild(lawMessage);
                });
                return;
            }

            // If no exact subcategory match, proceed with normal category matching
            let category = findCategory(input);
            
            if (!category) {
                // Try to match a subcategory
                for (const cat of uniqueCategories) {
                    const subcategories = getSubcategories(cat);
                    matchedSubcategory = subcategories.find(sub => 
                        input.toLowerCase().includes(sub.toLowerCase())
                    );
                    if (matchedSubcategory) {
                        category = cat;
                        break;
                    }
                }
            }

            if (category) {
                const subcategories = getSubcategories(category);
                if (subcategories.length > 0) {
                    if (!matchedSubcategory) {
                        matchedSubcategory = subcategories.find(sub => input.toLowerCase().includes(sub.toLowerCase()));
                    }
                    if (matchedSubcategory) {
                        // Show law details
                        const lawDetails = await getLawDetails(category, matchedSubcategory);
                        addMessage(`You asked about ${matchedSubcategory} under ${category}. Here are the details:`);

                        const laws = lawDetails.split('\n\n').filter(law => law.trim());
                        laws.forEach(law => {
                            const lawMessage = document.createElement('div');
                            lawMessage.className = 'bot-message';
                            lawMessage.style.whiteSpace = 'pre-line';
                            lawMessage.style.fontSize = '14px';
                            lawMessage.style.lineHeight = '1.4';
                            
                            if (law.startsWith('📜')) {
                                const [title, description] = law.split('\n');
                                lawMessage.innerHTML = `<strong>${title}</strong>\n${description}`;
                            } else {
                                lawMessage.textContent = law;
                            }
                            
                            chatMessages.appendChild(lawMessage);
                        });
                    } else {
                        // Show subcategories
                        addMessage(`You asked about ${category}. Which subcategory would you like to know more about?`);
                        subcategories.forEach(subcategory => {
                            addMessage(subcategory);
                        });
                    }
                } else {
                    // Show category details
                    const lawDetails = await getLawDetails(category);
                    addMessage(`You asked about ${category}. Here are the details:`);

                    const laws = lawDetails.split('\n\n').filter(law => law.trim());
                    laws.forEach(law => {
                        const lawMessage = document.createElement('div');
                        lawMessage.className = 'bot-message';
                        lawMessage.style.whiteSpace = 'pre-line';
                        lawMessage.style.fontSize = '14px';
                        lawMessage.style.lineHeight = '1.4';
                        
                        if (law.startsWith('📜')) {
                            const [title, description] = law.split('\n');
                            lawMessage.innerHTML = `<strong>${title}</strong>\n${description}`;
                        } else {
                            lawMessage.textContent = law;
                        }
                        
                        chatMessages.appendChild(lawMessage);
                    });
                }
            } else {
                addMessage('I couldn\'t find a matching category or subcategory. Please try asking about a specific category like "traffic", "cyber", or "property".');
            }
        } catch (error) {
            console.error('Error processing input:', error);
            addMessage('Sorry, there was an error processing your request. Please try again.');
        }
    }

    // Add click event listener for send button
    sendButton.addEventListener('click', processUserInput);

    // Add keypress event listener for Enter key
    userInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            processUserInput();
        }
    });

    // Add click event listener for mic button
    micButton.addEventListener('click', () => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            let recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
            recognition.lang = "en-US";
            
            recognition.onstart = function() {
                console.log("Voice recognition started...");
                micButton.style.backgroundColor = '#dc3545';
            };

            recognition.onresult = function(event) {
                let transcript = event.results[0][0].transcript;
                userInput.value = transcript;
                console.log("Recognized text: ", transcript);
            };

            recognition.onerror = function(event) {
                console.log("Error occurred in recognition: ", event.error);
                micButton.style.backgroundColor = '#28a745';
            };

            recognition.onend = function() {
                micButton.style.backgroundColor = '#28a745';
            };

            recognition.start();
        } else {
            alert("Speech recognition is not supported in your browser.");
        }
    });

    // Focus the input field when the page loads
    userInput.focus();
});
