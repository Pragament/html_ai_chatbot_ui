document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const modelSelect = document.getElementById('model');
    const reasoningEffortSelect = document.getElementById('reasoning-effort');
    const systemPromptSelect = document.getElementById('system-prompt');
    const boardSelect = document.getElementById('board');
    const classSelect = document.getElementById('class');
    const subjectSelect = document.getElementById('subject');
    const topicTypeSelect = document.getElementById('topic-type');
    const chapterSelect = document.getElementById('chapter');
    const sendBtn = document.getElementById('send-btn');
    const quickActionsSelect = document.getElementById('quick-actions');
    const messagesContainer = document.getElementById('messages-container');
    const loading = document.getElementById('loading');
    const systemPreview = document.getElementById('system-preview');
    const userPreview = document.getElementById('user-preview');
    
    // System prompt templates
    const systemTemplates = {
        'tutor': 'Act as a friendly tutor for a {board} {class} {subject} student. Explain concepts in simple language, use real-life examples, and check understanding with questions.',
        'teacher': 'Act as a strict but fair teacher for a {board} {class} {subject} student. Provide structured explanations, emphasize fundamentals, and include challenging questions.',
        'explainer': 'Act as a concept explainer for a {board} {class} {subject} student. Break down complex ideas into simple steps, use analogies, and focus on understanding.',
        'simplifier': 'Act as a content simplifier for a {board} {class} {subject} student. Make difficult topics accessible, avoid jargon, and use everyday examples.'
    };
    
    // User prompt templates
    const userTemplates = {
        'practice-problems': "Generate 5 practice problems on '{chapter}' with step-by-step solutions. Make them appropriate for {class} level studying {subject} under {board} curriculum.",
        'explain-concept': "Explain the concept of '{chapter}' in simple terms suitable for a {class} student. Use analogies and real-life examples from {subject} context.",
        'study-plan': "Create a 1-week study plan for learning '{chapter}' in {subject} for a {class} {board} student. Include daily topics and practice activities.",
        'quiz': "Create a 10-question quiz on '{chapter}' for {class} {subject}. Include multiple choice questions with answers and explanations.",
        'examples': "Provide 5 real-life examples and applications of '{chapter}' from {subject} that a {class} student can relate to."
    };
    
    // Event Listeners
    [systemPromptSelect, boardSelect, classSelect, subjectSelect, topicTypeSelect, chapterSelect].forEach(select => {
        select.addEventListener('change', updatePreview);
    });
    
    sendBtn.addEventListener('click', generateContent);
    quickActionsSelect.addEventListener('change', handleQuickAction);
    
    // Initialize preview
    updatePreview();
    
    // Functions
    function updatePreview() {
        const systemRole = systemPromptSelect.value;
        const board = boardSelect.value;
        const cls = classSelect.value;
        const subject = subjectSelect.value;
        const topicType = topicTypeSelect.value;
        const chapter = chapterSelect.value;
        
        // Update system preview
        const systemContent = systemTemplates[systemRole]
            .replace('{board}', board)
            .replace('{class}', cls)
            .replace('{subject}', subject);
        systemPreview.textContent = `System: ${systemContent}`;
        
        // Update user preview
        const userContent = userTemplates[topicType]
            .replace(/{chapter}/g, chapter)
            .replace(/{board}/g, board)
            .replace(/{class}/g, cls)
            .replace(/{subject}/g, subject);
        userPreview.textContent = `User: ${userContent}`;
    }
    
    // Simulation mode detection
    const urlParams = new URLSearchParams(window.location.search);
    const simulationMode = urlParams.get('simulation') === 'true';

    function simulateApiResponse(userPrompt) {
        // Simple simulated response based on userPrompt
        return Promise.resolve({
            choices: [{ message: { content: `Simulated response for: ${userPrompt}` } }]
        });
    }
    
    async function generateContent() {
        // Get configuration values
        const model = modelSelect.value;
        const reasoningEffort = reasoningEffortSelect.value;
        const systemRole = systemPromptSelect.value;
        const board = boardSelect.value;
        const cls = classSelect.value;
        const subject = subjectSelect.value;
        const topicType = topicTypeSelect.value;
        const chapter = chapterSelect.value;
        
        // Build prompts
        const systemContent = systemTemplates[systemRole]
            .replace('{board}', board)
            .replace('{class}', cls)
            .replace('{subject}', subject);
            
        const userContent = userTemplates[topicType]
            .replace(/{chapter}/g, chapter)
            .replace(/{board}/g, board)
            .replace(/{class}/g, cls)
            .replace(/{subject}/g, subject);
        
        // Display user message in chat
        addMessage('user', userContent);
        // Show loading
        loading.style.display = 'block';
        try {
            let data;
            if (simulationMode) {
                data = await simulateApiResponse(userContent);
            } else {
                // Make API call
                const response = await fetch('https://text.pollinations.ai/openai', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        model: model,
                        reasoning_effort: reasoningEffort,
                        messages: [
                            { role: "system", content: systemContent },
                            { role: "user", content: userContent }
                        ]
                    })
                });
                if (!response.ok) {
                    throw new Error(`API request failed with status ${response.status}`);
                }
                data = await response.json();
            }
            // Hide loading
            loading.style.display = 'none';
            // Display assistant response
            if (data.choices && data.choices[0] && data.choices[0].message) {
                addMessage('assistant', data.choices[0].message.content);
            } else if (data.content) {
                addMessage('assistant', data.content);
            } else {
                addMessage('assistant', 'I received your request but the response format was unexpected. Here is the raw data: ' + JSON.stringify(data));
            }
        } catch (error) {
            // Hide loading
            loading.style.display = 'none';
            addMessage('assistant', `Sorry, I encountered an error: ${error.message}. Please try again.`);
            console.error('API Error:', error);
        }
    }
    
    function handleQuickAction() {
        const action = quickActionsSelect.value;
        if (!action) return;
        
        // Reset quick actions
        quickActionsSelect.value = '';
        
        // Create follow-up message based on quick action
        let followUpMessage = '';
        
        switch(action) {
            case 'yes':
                followUpMessage = 'yes';
                break;
            case 'more-examples':
                followUpMessage = 'Can you provide more examples or variations of these problems?';
                break;
            case 'simpler-explanation':
                followUpMessage = 'Can you explain this in even simpler terms?';
                break;
            case 'related-topics':
                followUpMessage = 'What are some related topics I should study next?';
                break;
            case 'test-knowledge':
                followUpMessage = 'Can you create a quick test to check my understanding?';
                break;
        }
        
        if (followUpMessage) {
            addMessage('user', followUpMessage);
            loading.style.display = 'block';
            // Get configuration values for context
            const model = modelSelect.value;
            const reasoningEffort = reasoningEffortSelect.value;
            const systemRole = systemPromptSelect.value;
            const board = boardSelect.value;
            const cls = classSelect.value;
            const subject = subjectSelect.value;
            
            // Build system prompt
            const systemContent = systemTemplates[systemRole]
                .replace('{board}', board)
                .replace('{class}', cls)
                .replace('{subject}', subject);
            
            if (simulationMode) {
                simulateApiResponse(followUpMessage).then(data => {
                    loading.style.display = 'none';
                    if (data.choices && data.choices[0] && data.choices[0].message) {
                        addMessage('assistant', data.choices[0].message.content);
                    } else if (data.content) {
                        addMessage('assistant', data.content);
                    } else {
                        addMessage('assistant', 'I received your request but the response format was unexpected. Here is the raw data: ' + JSON.stringify(data));
                    }
                });
            } else {
                // Make API call
                fetch('https://text.pollinations.ai/openai', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        model: model,
                        reasoning_effort: reasoningEffort,
                        messages: [
                            { role: "system", content: systemContent },
                            { role: "user", content: followUpMessage }
                        ]
                    })
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`API request failed with status ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    loading.style.display = 'none';
                    if (data.choices && data.choices[0] && data.choices[0].message) {
                        addMessage('assistant', data.choices[0].message.content);
                    } else if (data.content) {
                        addMessage('assistant', data.content);
                    } else {
                        addMessage('assistant', 'I received your request but the response format was unexpected. Here is the raw data: ' + JSON.stringify(data));
                    }
                })
                .catch(error => {
                    loading.style.display = 'none';
                    addMessage('assistant', `Sorry, I encountered an error: ${error.message}. Please try again.`);
                    console.error('API Error:', error);
                });
            }
        }
    }
    
    // Custom context menu for follow-up
    const contextMenu = document.getElementById('custom-context-menu');
    const askFollowup = document.getElementById('ask-followup');
    let selectedText = '';

    // Sentence builder queue
    let sentenceQueue = [];
    const addToQueue = document.getElementById('add-to-queue');
    const sentenceBuilderPanel = document.getElementById('sentence-builder-panel');
    const queueList = document.getElementById('queue-list');
    const clearQueueBtn = document.getElementById('clear-queue');
    const sendQueueBtn = document.getElementById('send-queue');

    // Show context menu on right-click in assistant message if text is selected
    messagesContainer.addEventListener('contextmenu', function(e) {
        const selection = window.getSelection();
        const target = e.target.closest('.assistant-message');
        if (target && selection && selection.toString().trim().length > 0) {
            e.preventDefault();
            selectedText = selection.toString().trim();
            contextMenu.style.top = e.pageY + 'px';
            contextMenu.style.left = e.pageX + 'px';
            contextMenu.style.display = 'block';
        } else {
            contextMenu.style.display = 'none';
        }
    });

    // Hide context menu on click elsewhere
    document.addEventListener('click', function(e) {
        if (!contextMenu.contains(e.target)) {
            contextMenu.style.display = 'none';
        }
    });

    // Ask follow-up question with selected text
    askFollowup.addEventListener('click', function(e) {
        if (selectedText) {
            addMessage('user', selectedText);
            loading.style.display = 'block';
            // Get configuration values for context
            const model = modelSelect.value;
            const reasoningEffort = reasoningEffortSelect.value;
            const systemRole = systemPromptSelect.value;
            const board = boardSelect.value;
            const cls = classSelect.value;
            const subject = subjectSelect.value;
            // Build system prompt
            const systemContent = systemTemplates[systemRole]
                .replace('{board}', board)
                .replace('{class}', cls)
                .replace('{subject}', subject);
            if (simulationMode) {
                simulateApiResponse(selectedText).then(data => {
                    loading.style.display = 'none';
                    if (data.choices && data.choices[0] && data.choices[0].message) {
                        addMessage('assistant', data.choices[0].message.content);
                    } else if (data.content) {
                        addMessage('assistant', data.content);
                    } else {
                        addMessage('assistant', 'I received your request but the response format was unexpected. Here is the raw data: ' + JSON.stringify(data));
                    }
                });
            } else {
                // Make API call
                fetch('https://text.pollinations.ai/openai', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        model: model,
                        reasoning_effort: reasoningEffort,
                        messages: [
                            { role: "system", content: systemContent },
                            { role: "user", content: selectedText }
                        ]
                    })
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`API request failed with status ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    loading.style.display = 'none';
                    if (data.choices && data.choices[0] && data.choices[0].message) {
                        addMessage('assistant', data.choices[0].message.content);
                    } else if (data.content) {
                        addMessage('assistant', data.content);
                    } else {
                        addMessage('assistant', 'I received your request but the response format was unexpected. Here is the raw data: ' + JSON.stringify(data));
                    }
                })
                .catch(error => {
                    loading.style.display = 'none';
                    addMessage('assistant', `Sorry, I encountered an error: ${error.message}. Please try again.`);
                    console.error('API Error:', error);
                });
            }
        }
        contextMenu.style.display = 'none';
    });

    // Add selected text to sentence builder queue
    addToQueue.addEventListener('click', function(e) {
        if (selectedText) {
            sentenceQueue.push(selectedText);
            updateQueuePanel();
            sentenceBuilderPanel.style.display = 'block';
        }
        contextMenu.style.display = 'none';
    });

    // Update queue panel display
    function updateQueuePanel() {
        queueList.innerHTML = '';
        if (sentenceQueue.length === 0) {
            queueList.textContent = 'Queue is empty.';
        } else {
            queueList.innerHTML = sentenceQueue.map((txt, i) => `<div style='margin-bottom:4px;'>${i+1}. ${txt}</div>`).join('');
        }
    }

    // Clear queue
    clearQueueBtn.addEventListener('click', function() {
        sentenceQueue = [];
        updateQueuePanel();
        sentenceBuilderPanel.style.display = 'none';
    });

    // Send queue to AI
    sendQueueBtn.addEventListener('click', function() {
        if (sentenceQueue.length > 0) {
            const fullSentence = sentenceQueue.join(' ');
            addMessage('user', fullSentence);
            loading.style.display = 'block';
            // Get configuration values for context
            const model = modelSelect.value;
            const reasoningEffort = reasoningEffortSelect.value;
            const systemRole = systemPromptSelect.value;
            const board = boardSelect.value;
            const cls = classSelect.value;
            const subject = subjectSelect.value;
            // Build system prompt
            const systemContent = systemTemplates[systemRole]
                .replace('{board}', board)
                .replace('{class}', cls)
                .replace('{subject}', subject);
            if (simulationMode) {
                simulateApiResponse(fullSentence).then(data => {
                    loading.style.display = 'none';
                    if (data.choices && data.choices[0] && data.choices[0].message) {
                        addMessage('assistant', data.choices[0].message.content);
                    } else if (data.content) {
                        addMessage('assistant', data.content);
                    } else {
                        addMessage('assistant', 'I received your request but the response format was unexpected. Here is the raw data: ' + JSON.stringify(data));
                    }
                });
            } else {
                // Make API call
                fetch('https://text.pollinations.ai/openai', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        model: model,
                        reasoning_effort: reasoningEffort,
                        messages: [
                            { role: "system", content: systemContent },
                            { role: "user", content: fullSentence }
                        ]
                    })
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`API request failed with status ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    loading.style.display = 'none';
                    if (data.choices && data.choices[0] && data.choices[0].message) {
                        addMessage('assistant', data.choices[0].message.content);
                    } else if (data.content) {
                        addMessage('assistant', data.content);
                    } else {
                        addMessage('assistant', 'I received your request but the response format was unexpected. Here is the raw data: ' + JSON.stringify(data));
                    }
                })
                .catch(error => {
                    loading.style.display = 'none';
                    addMessage('assistant', `Sorry, I encountered an error: ${error.message}. Please try again.`);
                    console.error('API Error:', error);
                });
            }
            sentenceQueue = [];
            updateQueuePanel();
            sentenceBuilderPanel.style.display = 'none';
        }
    });
    
    function addMessage(role, content) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${role}-message`;
        
        const headerDiv = document.createElement('div');
        headerDiv.className = 'message-header';
        headerDiv.textContent = role === 'user' ? 'Student' : 'Educational Assistant';
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        contentDiv.textContent = content;
        
        messageDiv.appendChild(headerDiv);
        messageDiv.appendChild(contentDiv);
        
        messagesContainer.appendChild(messageDiv);
        
        // Scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
});
