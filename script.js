// Navigation Setup - Add to all pages
document.addEventListener('DOMContentLoaded', () => {
    // Preload law data in background
    loadLawData().catch(err => console.error('Failed to preload law data:', err));
    
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const floatToggle = document.getElementById('floatToggle');
    const floatingNav = document.getElementById('floatingNav');

    // Mobile hamburger menu toggle
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });

        // Close menu when a link is clicked
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });
    }

    // Floating navigation toggle
    if (floatToggle) {
        floatToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            floatingNav.classList.toggle('expanded');
        });

        // Close floating nav when a link is clicked
        const floatButtons = floatingNav.querySelectorAll('a.float-btn');
        floatButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                floatingNav.classList.remove('expanded');
            });
        });
    }

    // Close floating nav when clicking outside
    document.addEventListener('click', () => {
        if (floatingNav && floatingNav.classList.contains('expanded')) {
            floatingNav.classList.remove('expanded');
        }
    });

    // Page transition fade in
    document.body.style.opacity = '1';
    document.body.style.transition = 'opacity 0.5s ease-in';
});

// JSON Data Cache
let lawDataCache = null;
let isCacheLoading = false;

// Preload and cache JSON data
async function loadLawData() {
    if (lawDataCache) {
        return lawDataCache;
    }
    
    if (isCacheLoading) {
        // Wait for ongoing load
        return new Promise(resolve => {
            const checkInterval = setInterval(() => {
                if (lawDataCache) {
                    clearInterval(checkInterval);
                    resolve(lawDataCache);
                }
            }, 100);
        });
    }
    
    isCacheLoading = true;
    try {
        const response = await fetch('lawdata.json');
        if (!response.ok) {
            throw new Error('Could not load laws data');
        }
        lawDataCache = await response.json();
        isCacheLoading = false;
        console.log('✓ Law data loaded successfully');
        return lawDataCache;
    } catch (error) {
        console.error('Error loading law data:', error);
        isCacheLoading = false;
        return null;
    }
}

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
        const data = await loadLawData();
        if (!data) {
            throw new Error('Law data not available');
        }
        
        // Helper to format a law object
        function formatLaw(law) {
            if (typeof law === 'string') {
                return law;
            }
            if (law.law && law.description) {
                // Handle description as either string or array
                let descriptionText = law.description;
                if (Array.isArray(law.description)) {
                    descriptionText = law.description.join('\n');
                }
                return `📜 ${law.law}\n${descriptionText}`;
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

// Function to get subcategories from JSON file
async function getSubcategoriesFromJSON(category) {
    try {
        const data = await loadLawData();
        if (!data) {
            throw new Error('Law data not available');
        }
        
        if (data[category]) {
            return Object.keys(data[category]);
        }
        return [];
    } catch (error) {
        console.error('Error fetching subcategories:', error);
        return [];
    }
}

// Fallback subcategories if JSON doesn't load
function getSubcategoriesFallback(category) {
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

// Get subcategories with JSON priority
async function getSubcategories(category) {
    const jsonSubcategories = await getSubcategoriesFromJSON(category);
    return jsonSubcategories.length > 0 ? jsonSubcategories : getSubcategoriesFallback(category);
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
                const subcategories = await getSubcategories(cat);
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
                        const [title, ...descLines] = law.split('\n');
                        lawMessage.innerHTML = `<strong>${title}</strong>\n${descLines.join('\n')}`;
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
                    const subcategories = await getSubcategories(cat);
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
                const subcategories = await getSubcategories(category);
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
                                const [title, ...descLines] = law.split('\n');
                                lawMessage.innerHTML = `<strong>${title}</strong>\n${descLines.join('\n')}`;
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
                            const [title, ...descLines] = law.split('\n');
                            lawMessage.innerHTML = `<strong>${title}</strong>\n${descLines.join('\n')}`;
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

// Handle clickable categories and laws in categories.html
document.addEventListener('DOMContentLoaded', () => {
    // Get all law items (li elements) in categories
    const lawItems = document.querySelectorAll('.category li');
    const categoryHeaders = document.querySelectorAll('.category h2');
    
    // Make law items clickable
    lawItems.forEach(item => {
        item.style.cursor = 'pointer';
        item.style.transition = 'all 0.3s ease';
        item.style.padding = '8px 5px';
        
        item.addEventListener('mouseenter', () => {
            item.style.backgroundColor = '#e3f2fd';
            item.style.transform = 'translateX(5px)';
            item.style.borderRadius = '5px';
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.backgroundColor = 'transparent';
            item.style.transform = 'translateX(0)';
        });
        
        item.addEventListener('click', () => {
            // Get the category name from the parent h2
            const category = item.closest('.category').querySelector('h2').textContent;
            const lawName = item.textContent;
            
            // Store the search query in sessionStorage
            sessionStorage.setItem('searchQuery', lawName);
            sessionStorage.setItem('selectedCategory', category);
            
            // Redirect to index.html (chatbot page)
            window.location.href = 'index.html';
        });
    });
    
    // Make category headers clickable as well
    categoryHeaders.forEach(header => {
        header.style.cursor = 'pointer';
        header.style.transition = 'all 0.3s ease';
        
        header.addEventListener('mouseenter', () => {
            header.style.color = '#0056b3';
            header.style.transform = 'scale(1.05)';
        });
        
        header.addEventListener('mouseleave', () => {
            header.style.color = 'navy';
            header.style.transform = 'scale(1)';
        });
        
        header.addEventListener('click', () => {
            const categoryName = header.textContent;
            
            // Store the search query in sessionStorage
            sessionStorage.setItem('searchQuery', categoryName);
            sessionStorage.setItem('selectedCategory', categoryName);
            
            // Redirect to index.html (chatbot page)
            window.location.href = 'index.html';
        });
    });
});

// Handle search functionality in categories.html
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const micButton = document.getElementById('micButton');
    const categories = document.querySelectorAll('.category');
    
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            
            categories.forEach(category => {
                const categoryName = category.querySelector('h2').textContent.toLowerCase();
                const laws = Array.from(category.querySelectorAll('li')).map(li => li.textContent.toLowerCase());
                
                const matches = categoryName.includes(searchTerm) || laws.some(law => law.includes(searchTerm));
                
                if (searchTerm === '' || matches) {
                    category.style.display = 'block';
                    category.style.animation = 'slideIn 0.3s ease-out';
                } else {
                    category.style.display = 'none';
                }
            });
        });
    }
    
    // Add voice search functionality to the microphone button in categories.html
    if (micButton && micButton.closest('.search-bar')) {
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
                    if (searchInput) {
                        searchInput.value = transcript;
                        searchInput.dispatchEvent(new Event('input'));
                    }
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
    }
});

// Handle restoration of search query on chatbot page
document.addEventListener('DOMContentLoaded', () => {
    const userInput = document.getElementById('user-input');
    const searchQuery = sessionStorage.getItem('searchQuery');
    
    if (userInput && searchQuery) {
        userInput.value = searchQuery;
        sessionStorage.removeItem('searchQuery');
        sessionStorage.removeItem('selectedCategory');
    }
});
