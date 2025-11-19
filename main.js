document.addEventListener('DOMContentLoaded', function () {
    // DOM Elements
    const modelSelect = document.getElementById('model');
    const reasoningEffortSelect = document.getElementById('reasoning-effort');
    const systemPromptSelect = document.getElementById('system-prompt');
    const boardSelect = document.getElementById('board');
    const classSelect = document.getElementById('class');
    const subjectSelect = document.getElementById('subject');
    const topicTypeSelect = document.getElementById('topic-type');
    const chapterSelect = document.getElementById('chapter');
    const topicSelect = document.getElementById('topic');
    const subtopicSelect = document.getElementById('subtopic');
    const sendBtn = document.getElementById('send-btn');
    const quickActionsSelect = document.getElementById('quick-actions');
    const messagesContainer = document.getElementById('messages-container');
    const loading = document.getElementById('loading');
    const systemPreview = document.getElementById('system-preview');
    const userPreview = document.getElementById('user-preview');



    // User prompt templates
    const userTemplates = {
        'practice-problems': "Generate 5 practice problems on '{topic}' - specifically '{subtopic}' from chapter '{chapter}' with step-by-step solutions. Make them appropriate for {class} level studying {subject} under {board} curriculum.",
        'explain-concept': "Explain the concept of '{topic}' with focus on '{subtopic}' from chapter '{chapter}' in simple terms suitable for a {class} student. Use analogies and real-life examples from {subject} context.",
        'study-plan': "Create a 1-week study plan for learning '{topic}' - specifically '{subtopic}' from chapter '{chapter}' in {subject} for a {class} {board} student. Include daily topics and practice activities.",
        'quiz': "Create a 10-question quiz on '{topic}' covering '{subtopic}' from chapter '{chapter}' for {class} {subject}. Include multiple choice questions with answers and explanations.",
        'examples': "Provide 5 real-life examples and applications of '{topic}' focusing on '{subtopic}' from chapter '{chapter}' in {subject} that a {class} student can relate to.",
        'summary': "Provide a comprehensive summary of '{topic}' - '{subtopic}' from chapter '{chapter}' in {subject} for {class} {board} students. Highlight key points and formulas.",
        'differences': "Compare and contrast different aspects of '{topic}' and its subtopics, especially '{subtopic}' from chapter '{chapter}' in {subject} for {class} level.",
        'formulas': "List all important formulas and equations related to '{topic}' - '{subtopic}' from chapter '{chapter}' in {subject} for {class} {board} students with explanations.",
        'definitions': "Provide key definitions and terminology for '{topic}' - '{subtopic}' from chapter '{chapter}' in {subject} suitable for {class} level students.",
        'project-ideas': "Suggest 3 creative project ideas based on '{topic}' - '{subtopic}' from chapter '{chapter}' in {subject} for {class} {board} students with implementation steps.",
        'common-mistakes': "List common mistakes students make when studying '{topic}' - specifically '{subtopic}' from chapter '{chapter}' in {subject} for {class} level and how to avoid them.",
        'advanced-questions': "Generate 3 challenging advanced questions on '{topic}' - '{subtopic}' from chapter '{chapter}' in {subject} for gifted {class} {board} students with detailed solutions.",
        'visual-learning': "Create visual learning aids and diagrams explanation for '{topic}' - '{subtopic}' from chapter '{chapter}' in {subject} suitable for {class} students.",
        'revision-notes': "Prepare concise revision notes for '{topic}' - '{subtopic}' from chapter '{chapter}' in {subject} for {class} {board} exam preparation.",
        'mind-map': "Create a mind map structure for '{topic}' - '{subtopic}' from chapter '{chapter}' in {subject} showing connections and key concepts for {class} level."
    };

    // System prompt templates
    const systemTemplates = {
        'tutor': 'Act as a friendly tutor for a {board} {class} {subject} student. Explain concepts in simple language, use real-life examples, and check understanding with questions.',
        'teacher': 'Act as a strict but fair teacher for a {board} {class} {subject} student. Provide structured explanations, emphasize fundamentals, and include challenging questions.',
        'explainer': 'Act as a concept explainer for a {board} {class} {subject} student. Break down complex ideas into simple steps, use analogies, and focus on understanding.',
        'simplifier': 'Act as a content simplifier for a {board} {class} {subject} student. Make difficult topics accessible, avoid jargon, and use everyday examples.',
        'examiner': 'Act as an experienced examiner for {board} {class} {subject}. Focus on important exam topics, common question patterns, and marking scheme insights for {topic} and {subtopic}.',
        'career-guide': 'Act as a career guidance counselor specializing in {subject} for {class} {board} students. Connect {topic} - {subtopic} to real-world careers and higher education opportunities.',
        'storyteller': 'Act as an engaging storyteller teaching {subject} to {class} {board} students. Present {topic} - {subtopic} through stories, historical context, and narrative examples.',
        'scientist': 'Act as a {subject} scientist/researcher explaining {topic} - {subtopic} to {class} {board} students. Share experimental approaches and scientific methodology.',
        'problem-solver': 'Act as an expert problem-solver in {subject} for {class} {board} students. Focus on step-by-step problem solving techniques for {topic} - {subtopic}.',
        'motivator': 'Act as a motivational coach for {class} {board} students learning {subject}. Encourage persistence with {topic} - {subtopic} and share success strategies.',
        'visual-teacher': 'Act as a visual learning specialist for {board} {class} {subject}. Use descriptive imagery, diagrams, and spatial reasoning to explain {topic} - {subtopic}.',
        'critical-thinker': 'Act as a critical thinking guide for {class} {board} {subject} students. Encourage analytical thinking and questioning about {topic} - {subtopic}.',
        'practical-guide': 'Act as a practical applications expert for {subject} with {class} {board} students. Focus on hands-on learning and real-world use of {topic} - {subtopic}.',
        'quick-learner': 'Act as an accelerated learning coach for {board} {class} {subject}. Provide efficient learning strategies and memory techniques for mastering {topic} - {subtopic}.',
        'doubt-solver': 'Act as a dedicated doubt-solving assistant for {class} {board} {subject} students. patiently address misconceptions and clarify {topic} - {subtopic} thoroughly.'
    };

    // Debug: Log DOM elements
    console.debug('modelSelect:', modelSelect);
    console.debug('reasoningEffortSelect:', reasoningEffortSelect);
    console.debug('systemPromptSelect:', systemPromptSelect);
    console.debug('boardSelect:', boardSelect);
    console.debug('classSelect:', classSelect);
    console.debug('subjectSelect:', subjectSelect);
    console.debug('topicTypeSelect:', topicTypeSelect);
    console.debug('chapterSelect:', chapterSelect);
    console.debug('sendBtn:', sendBtn);
    console.debug('quickActionsSelect:', quickActionsSelect);
    console.debug('messagesContainer:', messagesContainer);
    console.debug('loading:', loading);
    console.debug('systemPreview:', systemPreview);
    console.debug('userPreview:', userPreview);

    // Event Listeners (with null checks)
    [systemPromptSelect, boardSelect, classSelect, subjectSelect, topicTypeSelect, chapterSelect].forEach((select, idx) => {
        if (select) {
            select.addEventListener('change', updatePreview);
        } else {
            console.warn('Dropdown element missing at index', idx);
        }
    });

    if (sendBtn) {
        sendBtn.addEventListener('click', generateContent);
    } else {
        console.warn('sendBtn not found');
    }
    if (quickActionsSelect) {
        quickActionsSelect.addEventListener('change', handleQuickAction);
    } else {
        console.warn('quickActionsSelect not found');
    }

    // Functions
    function updatePreview() {
        const systemRole = systemPromptSelect.value;
        const board = boardSelect.value;
        const cls = classSelect.value;
        const subject = subjectSelect.value;
        const topicType = topicTypeSelect.value;
        const chapter = chapterSelect.value;
        const topic = topicSelect.value;
        const subtopic = subtopicSelect.value;
        console.debug('Updating preview with:', {
            systemRole,
            board,
            cls,
            subject,
            topicType,
            chapter,
            topic,
            subtopic
        });

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
            .replace(/{topic}/g, topic) // Placeholder for topic
            .replace(/{subtopic}/g, subtopic) // Placeholder for subtopic
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
        const topic = topicSelect.value;
        const subtopic = subtopicSelect.value;
        console.debug('Generating content with:', {
            model,
            reasoningEffort,
            systemRole,
            board,
            cls,
            subject,
            topicType,
            chapter,
            topic,
            subtopic
        });

        // Build prompts
        const systemContent = systemTemplates[systemRole]
            .replace('{board}', board)
            .replace('{class}', cls)
            .replace('{subject}', subject);

        const userContent = userTemplates[topicType]
            .replace(/{chapter}/g, chapter)
            .replace(/{board}/g, board)
            .replace(/{class}/g, cls)
            .replace(/{topic}/g, topic)
            .replace(/{subtopic}/g, subtopic)
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

        switch (action) {
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
            case 'step-by-step':
                followUpMessage = 'Can you break this down into smaller steps with detailed explanations?';
                break;
            case 'common-mistakes':
                followUpMessage = 'What are common mistakes students make with this topic and how to avoid them?';
                break;
            case 'real-world':
                followUpMessage = 'Can you provide more real-world applications and practical uses?';
                break;
            case 'visual-aids':
                followUpMessage = 'Can you provide visual explanations, diagrams, or charts to help understand this better?';
                break;
            case 'practice-questions':
                followUpMessage = 'Can you give me more practice questions with varying difficulty levels?';
                break;
            case 'key-points':
                followUpMessage = 'Can you summarize the most important key points and takeaways?';
                break;
            case 'formulas':
                followUpMessage = 'Can you list all the important formulas and equations related to this topic?';
                break;
            case 'definitions':
                followUpMessage = 'Can you provide key definitions, terminology, and concepts I should memorize?';
                break;
            case 'study-tips':
                followUpMessage = 'What are the best study strategies and tips for mastering this topic?';
                break;
            case 'exam-tips':
                followUpMessage = 'What exam-specific tips and important questions should I focus on?';
                break;
            case 'advanced-concepts':
                followUpMessage = 'Can you explain more advanced concepts related to this topic?';
                break;
            case 'career-connections':
                followUpMessage = 'How is this topic used in real careers and professional fields?';
                break;
            case 'project-ideas':
                followUpMessage = 'What are some interesting projects or experiments I can do related to this topic?';
                break;
            case 'mind-map':
                followUpMessage = 'Can you create a mind map showing how different concepts in this topic connect?';
                break;
            case 'compare-contrast':
                followUpMessage = 'Can you compare and contrast this topic with similar or related concepts?';
                break;
            case 'history-context':
                followUpMessage = 'What is the historical background and development of this concept?';
                break;
            case 'quick-revision':
                followUpMessage = 'Can you provide quick revision notes or a cheat sheet for this topic?';
                break;
            case 'difficulty-increase':
                followUpMessage = 'Can you make this more challenging with advanced problems and concepts?';
                break;
            case 'difficulty-decrease':
                followUpMessage = 'Can you explain this at a more basic level with simpler examples?';
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
    messagesContainer.addEventListener('contextmenu', function (e) {
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
    document.addEventListener('click', function (e) {
        if (!contextMenu.contains(e.target)) {
            contextMenu.style.display = 'none';
        }
    });

    // Ask follow-up question with selected text
    askFollowup.addEventListener('click', function (e) {
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
    addToQueue.addEventListener('click', function (e) {
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
            queueList.innerHTML = sentenceQueue.map((txt, i) => `<div style='margin-bottom:4px;'>${i + 1}. ${txt}</div>`).join('');
        }
    }

    // Clear queue
    clearQueueBtn.addEventListener('click', function () {
        sentenceQueue = [];
        updateQueuePanel();
        sentenceBuilderPanel.style.display = 'none';
    });

    // Send queue to AI
    sendQueueBtn.addEventListener('click', function () {
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

    // Document management
    let documents = JSON.parse(localStorage.getItem('documents') || '{}');
    let currentDocument = null;
    let lastAIResponse = '';

    function updateDocumentList() {
        const docList = document.getElementById('document-list');
        docList.innerHTML = '<option value="">Select Document</option>';
        Object.keys(documents).forEach(name => {
            docList.innerHTML += `<option value="${name}">${name}</option>`;
        });
    }

    function saveDocumentsToStorage() {
        localStorage.setItem('documents', JSON.stringify(documents));
    }

    document.getElementById('create-document-btn').addEventListener('click', function() {
        const name = prompt('Enter new document name:');
        if (name && !documents[name]) {
            documents[name] = [];
            saveDocumentsToStorage();
            updateDocumentList();
            document.getElementById('document-list').value = name;
            currentDocument = name;
        } else if (documents[name]) {
            alert('Document with this name already exists.');
        }
    });

    document.getElementById('document-list').addEventListener('change', function() {
        currentDocument = this.value;
    });

    document.getElementById('save-response-btn').addEventListener('click', function() {
        if (!currentDocument) {
            alert('Select or create a document first.');
            return;
        }
        if (!lastAIResponse) {
            alert('No AI response to save.');
            return;
        }
        documents[currentDocument].push(lastAIResponse);
        saveDocumentsToStorage();
        alert('Response saved to document.');
    });

    document.getElementById('view-document-btn').addEventListener('click', function() {
        if (!currentDocument) {
            alert('Select a document to view.');
            return;
        }
        const viewer = document.getElementById('document-viewer');
        viewer.innerHTML = `<h3>Document: ${currentDocument}</h3>` + documents[currentDocument].map((entry, i) => `<div style='margin-bottom:12px;'><strong>Entry ${i+1}:</strong><div>${entry}</div></div>`).join('');
        viewer.classList.remove('hidden');
    });

    document.getElementById('delete-document-btn').addEventListener('click', function() {
        if (!currentDocument) {
            alert('Select a document to delete.');
            return;
        }
        if (confirm('Are you sure you want to delete this document?')) {
            delete documents[currentDocument];
            saveDocumentsToStorage();
            updateDocumentList();
            document.getElementById('document-viewer').classList.add('hidden');
            currentDocument = null;
        }
    });

    document.getElementById('export-json-btn').addEventListener('click', function() {
        if (!currentDocument) {
            alert('Select a document to export.');
            return;
        }
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(documents[currentDocument], null, 2));
        const dlAnchor = document.createElement('a');
        dlAnchor.setAttribute("href", dataStr);
        dlAnchor.setAttribute("download", currentDocument + ".json");
        dlAnchor.click();
    });

    document.getElementById('export-pdf-btn').addEventListener('click', function() {
        if (!currentDocument) {
            alert('Select a document to export.');
            return;
        }
        const docContent = documents[currentDocument].map((entry, i) => `Entry ${i+1}:\n${entry}\n\n`).join('');
        const win = window.open('', '_blank');
        win.document.write(`<pre>${docContent}</pre>`);
        win.print();
    });

    updateDocumentList();

    // Save last AI response after each assistant message
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

        if (role === 'assistant') {
            lastAIResponse = content;
        }
    }

    // Restore last selections from localStorage
    const lastSelections = JSON.parse(localStorage.getItem('lastSelections') || '{}');

    function setDropdownValue(select, value) {
        if (select && value) {
            select.value = value;
        }
    }

    function saveSelections() {
        localStorage.setItem('lastSelections', JSON.stringify({
            class: classSelect.value,
            subject: subjectSelect.value,
            chapter: chapterSelect.value,
            topic: topicSelect.value,
            subtopic: subtopicSelect.value
        }));
    }

    // Attach change listeners to save selections
    [classSelect, subjectSelect, chapterSelect, topicSelect, subtopicSelect].forEach((select) => {
        if (select) {
            select.addEventListener('change', saveSelections);
        }
    });

    // Load topics hierarchy and restore selections
    let topicsHierarchy = {};
    fetch('topics-hierarchy.json')
        .then(res => res.json())
        .then(data => {
            topicsHierarchy = data;
            populateClassDropdown();
            // Restore selections step by step
            setDropdownValue(classSelect, lastSelections.class);
            showGroup('subject-group', !!lastSelections.class);
            if (lastSelections.class && topicsHierarchy[lastSelections.class]) {
                Object.keys(topicsHierarchy[lastSelections.class]).forEach(subject => {
                    subjectSelect.innerHTML += `<option value="${subject}">${subject}</option>`;
                });
                setDropdownValue(subjectSelect, lastSelections.subject);
                showGroup('chapter-group', !!lastSelections.subject);
            }
            if (lastSelections.class && lastSelections.subject && topicsHierarchy[lastSelections.class][lastSelections.subject]) {
                Object.keys(topicsHierarchy[lastSelections.class][lastSelections.subject]).forEach(chapter => {
                    chapterSelect.innerHTML += `<option value="${chapter}">${chapter}</option>`;
                });
                setDropdownValue(chapterSelect, lastSelections.chapter);
                showGroup('topic-group', !!lastSelections.chapter);
            }
            if (lastSelections.class && lastSelections.subject && lastSelections.chapter && topicsHierarchy[lastSelections.class][lastSelections.subject][lastSelections.chapter]) {
                const topicsObj = topicsHierarchy[lastSelections.class][lastSelections.subject][lastSelections.chapter].Topics || topicsHierarchy[lastSelections.class][lastSelections.subject][lastSelections.chapter].Chapters || topicsHierarchy[lastSelections.class][lastSelections.subject][lastSelections.chapter].Prose?.Chapters || topicsHierarchy[lastSelections.class][lastSelections.subject][lastSelections.chapter].ShortStories?.Chapters;
                if (topicsObj) {
                    Object.keys(topicsObj).forEach(topic => {
                        topicSelect.innerHTML += `<option value="${topic}">${topic}</option>`;
                    });
                    setDropdownValue(topicSelect, lastSelections.topic);
                    showGroup('subtopic-group', !!lastSelections.topic);
                }
            }
            if (lastSelections.class && lastSelections.subject && lastSelections.chapter && lastSelections.topic && topicsHierarchy[lastSelections.class][lastSelections.subject][lastSelections.chapter]) {
                let subtopicsArr = [];
                const topicsObj = topicsHierarchy[lastSelections.class][lastSelections.subject][lastSelections.chapter].Topics || topicsHierarchy[lastSelections.class][lastSelections.subject][lastSelections.chapter].Chapters || topicsHierarchy[lastSelections.class][lastSelections.subject][lastSelections.chapter].Prose?.Chapters || topicsHierarchy[lastSelections.class][lastSelections.subject][lastSelections.chapter].ShortStories?.Chapters;
                if (topicsObj && topicsObj[lastSelections.topic]) {
                    subtopicsArr = topicsObj[lastSelections.topic].Subtopics || topicsObj[lastSelections.topic];
                }
                if (Array.isArray(subtopicsArr)) {
                    subtopicsArr.forEach(subtopic => {
                        subtopicSelect.innerHTML += `<option value="${subtopic}">${subtopic}</option>`;
                    });
                    setDropdownValue(subtopicSelect, lastSelections.subtopic);
                }
            }
            updatePreview();
        });

    function populateClassDropdown() {
        classSelect.innerHTML = '<option value="">Select Class</option>';
        Object.keys(topicsHierarchy).forEach(cls => {
            classSelect.innerHTML += `<option value="${cls}">${cls.replace('Class', '')} Grade</option>`;
        });
        subjectSelect.innerHTML = '<option value="">Select Subject</option>';
        chapterSelect.innerHTML = '<option value="">Select Chapter/Topic</option>';
        topicSelect.innerHTML = '<option value="">Select Topic</option>';
        subtopicSelect.innerHTML = '<option value="">Select Subtopic</option>';
    }

    // Helper to show/hide form groups
    function showGroup(id, show) {
        const el = document.getElementById(id);
        if (el) {
            el.classList.toggle('hidden', !show);
        }
    }

    classSelect.addEventListener('change', function () {
        subjectSelect.innerHTML = '<option value="">Select Subject</option>';
        chapterSelect.innerHTML = '<option value="">Select Chapter/Topic</option>';
        topicSelect.innerHTML = '<option value="">Select Topic</option>';
        subtopicSelect.innerHTML = '<option value="">Select Subtopic</option>';
        const cls = classSelect.value;
        showGroup('subject-group', !!cls);
        showGroup('chapter-group', false);
        showGroup('topic-group', false);
        showGroup('subtopic-group', false);
        if (cls && topicsHierarchy[cls]) {
            Object.keys(topicsHierarchy[cls]).forEach(subject => {
                subjectSelect.innerHTML += `<option value="${subject}">${subject}</option>`;
            });
        }
    });

    subjectSelect.addEventListener('change', function () {
        chapterSelect.innerHTML = '<option value="">Select Chapter/Topic</option>';
        topicSelect.innerHTML = '<option value="">Select Topic</option>';
        subtopicSelect.innerHTML = '<option value="">Select Subtopic</option>';
        const cls = classSelect.value;
        const subject = subjectSelect.value;
        showGroup('chapter-group', !!subject);
        showGroup('topic-group', false);
        showGroup('subtopic-group', false);
        if (cls && subject && topicsHierarchy[cls][subject]) {
            Object.keys(topicsHierarchy[cls][subject]).forEach(chapter => {
                chapterSelect.innerHTML += `<option value="${chapter}">${chapter}</option>`;
            });
        }
    });

    chapterSelect.addEventListener('change', function () {
        topicSelect.innerHTML = '<option value="">Select Topic</option>';
        subtopicSelect.innerHTML = '<option value="">Select Subtopic</option>';
        const cls = classSelect.value;
        const subject = subjectSelect.value;
        const chapter = chapterSelect.value;
        showGroup('topic-group', !!chapter);
        showGroup('subtopic-group', false);
        if (cls && subject && chapter && topicsHierarchy[cls][subject][chapter]) {
            const topicsObj = topicsHierarchy[cls][subject][chapter].Topics || topicsHierarchy[cls][subject][chapter].Chapters || topicsHierarchy[cls][subject][chapter].Prose?.Chapters || topicsHierarchy[cls][subject][chapter].ShortStories?.Chapters;
            if (topicsObj) {
                Object.keys(topicsObj).forEach(topic => {
                    topicSelect.innerHTML += `<option value="${topic}">${topic}</option>`;
                });
            } else if (Array.isArray(topicsHierarchy[cls][subject][chapter])) {
                topicsHierarchy[cls][subject][chapter].forEach(topic => {
                    topicSelect.innerHTML += `<option value="${topic}">${topic}</option>`;
                });
            }
        }
    });

    topicSelect.addEventListener('change', function () {
        subtopicSelect.innerHTML = '<option value="">Select Subtopic</option>';
        const cls = classSelect.value;
        const subject = subjectSelect.value;
        const chapter = chapterSelect.value;
        const topic = topicSelect.value;
        showGroup('subtopic-group', !!topic);
        if (cls && subject && chapter && topic && topicsHierarchy[cls][subject][chapter]) {
            let subtopicsArr = [];
            const topicsObj = topicsHierarchy[cls][subject][chapter].Topics || topicsHierarchy[cls][subject][chapter].Chapters || topicsHierarchy[cls][subject][chapter].Prose?.Chapters || topicsHierarchy[cls][subject][chapter].ShortStories?.Chapters;
            if (topicsObj && topicsObj[topic]) {
                subtopicsArr = topicsObj[topic].Subtopics || topicsObj[topic];
            }
            if (Array.isArray(subtopicsArr)) {
                subtopicsArr.forEach(subtopic => {
                    subtopicSelect.innerHTML += `<option value="${subtopic}">${subtopic}</option>`;
                });
            }
        }
    });

    // Initialize preview
    updatePreview();
});
