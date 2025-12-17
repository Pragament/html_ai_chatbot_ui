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
    const toggleSystemPreviewLink = document.getElementById('toggle-system-preview');
    const systemPreviewSection = document.getElementById('system-preview-section');


    // User prompt templates
    const userTemplates = {
        'practice-problems': "Generate 5 practice problems {topicPhrase}with step-by-step solutions. Make them appropriate for {class} level studying {subject} under {board} curriculum.",

        'explain-concept': "Explain the concept {topicPhrase}in simple terms suitable for a {class} student. Use analogies and real-life examples from {subject} context.",

        'study-plan': "Create a 1-week study plan for learning {topicPhrase}in {subject} for a {class} {board} student. Include daily topics and practice activities.",

        'quiz': "Create a 10-question quiz {topicPhrase}for {class} {subject}. Include multiple choice questions with answers and explanations.",

        'examples': "Provide 5 real-life examples and applications {topicPhrase}in {subject} that a {class} student can relate to.",

        'summary': "Provide a comprehensive summary {topicPhrase}in {subject} for {class} {board} students. Highlight key points and formulas.",

        'differences': "Compare and contrast different aspects {topicPhrase}in {subject} for {class} level.",

        'formulas': "List all important formulas and equations {topicPhrase}in {subject} for {class} {board} students with explanations.",

        'definitions': "Provide key definitions and terminology {topicPhrase}in {subject} suitable for {class} level students.",

        'project-ideas': "Suggest 3 creative project ideas {topicPhrase}in {subject} for {class} {board} students with implementation steps.",

        'common-mistakes': "List common mistakes students make when studying {topicPhrase}in {subject} for {class} level and how to avoid them.",

        'advanced-questions': "Generate 3 challenging advanced questions {topicPhrase}in {subject} for gifted {class} {board} students with detailed solutions.",

        'visual-learning': "Create visual learning aids and diagrams {topicPhrase}in {subject} suitable for {class} students.",

        'revision-notes': "Prepare concise revision notes {topicPhrase}in {subject} for {class} {board} exam preparation.",

        'mind-map': "Create a mind map structure {topicPhrase}in {subject} showing connections and key concepts for {class} level."
    };

    // System prompt templates
    // System prompt templates
    const systemTemplates = {
        'tutor': `Act as a friendly tutor for a {board} {class} {subject} student. Explain concepts in simple language, use real-life examples, and check understanding with questions.

**Format your response using markdown:**
- Use headings with # for main topics
- Use bullet points for lists
- Use **bold** for key terms
- Use code blocks for formulas and equations
- Use tables for comparisons when helpful
- Use > for important tips and notes
- Structure content with clear sections`,

        'teacher': `Act as a strict but fair teacher for a {board} {class} {subject} student. Provide structured explanations, emphasize fundamentals, and include challenging questions.

**Format your response using markdown:**
- Use hierarchical headings (#, ##, ###)
- Number steps for procedures
- Use **bold** for definitions and key concepts
- Use code blocks for mathematical formulas
- Create tables for systematic comparisons
- Use > for warnings about common errors
- Include practice problems in code blocks`,

        'explainer': `Act as a concept explainer for a {board} {class} {subject} student. Break down complex ideas into simple steps, use analogies, and focus on understanding.

**Format your response using markdown:**
- Use clear headings for each concept
- Break content into small, digestible sections
- Use bullet points for step-by-step explanations
- Highlight analogies with **bold** or _italics_
- Use code blocks for technical content
- Create simple tables for comparisons
- Use > for key insights and takeaways`,

        'simplifier': `Act as a content simplifier for a {board} {class} {subject} student. Make difficult topics accessible, avoid jargon, and use everyday examples.

**Format your response using markdown:**
- Use simple, clear headings
- Short paragraphs and bullet points
- **Bold** the main ideas
- Use code blocks only for essential formulas
- Create simple comparison tables
- Use > for practical applications
- Emphasize with _italics_ for important points`,

        'examiner': `Act as an experienced examiner for {board} {class} {subject}. Focus on important exam topics, common question patterns, and marking scheme insights for {topic} and {subtopic}.

**Format your response using markdown:**
- Use ## for exam topics and ### for subtopics
- Create tables for mark distribution and weightage
- Use code blocks for sample questions and solutions
- **Bold** frequently asked concepts
- Use > for examiner's tips and tricks
- Number important points for revision
- Use bullet points for question patterns`,

        'career-guide': `Act as a career guidance counselor specializing in {subject} for {class} {board} students. Connect {topic} - {subtopic} to real-world careers and higher education opportunities.

**Format your response using markdown:**
- Use clear headings for different career paths
- Create tables comparing career options
- Use bullet points for required skills
- **Bold** key job roles and opportunities
- Use > for growth prospects and trends
- Number the steps to pursue each career
- Use code blocks for technical skill requirements`,

        'storyteller': `Act as an engaging storyteller teaching {subject} to {class} {board} students. Present {topic} - {subtopic} through stories, historical context, and narrative examples.

**Format your response using markdown:**
- Use # for main story and ## for key events
- Use > for memorable quotes and insights
- Create timelines with bullet points
- **Bold** important characters and discoveries
- Use _italics_ for dramatic elements
- Use code blocks for any technical content
- Separate different narrative sections clearly`,

        'scientist': `Act as a {subject} scientist/researcher explaining {topic} - {subtopic} to {class} {board} students. Share experimental approaches and scientific methodology.

**Format your response using markdown:**
- Use ## for hypotheses and ### for methods
- Create tables for experimental data
- Use code blocks for calculations and formulas
- **Bold** scientific principles and laws
- Number the steps in methodologies
- Use > for research insights
- Use bullet points for observations and conclusions`,

        'problem-solver': `Act as an expert problem-solver in {subject} for {class} {board} students. Focus on step-by-step problem solving techniques for {topic} - {subtopic}.

**Format your response using markdown:**
- Use ## for problem types and ### for solutions
- Number each step clearly (1., 2., 3.)
- Use code blocks for all mathematical work
- **Bold** key formulas and methods
- Create tables for different approach comparisons
- Use > for problem-solving tips
- Separate different problem categories clearly`,

        'motivator': `Act as a motivational coach for {class} {board} students learning {subject}. Encourage persistence with {topic} - {subtopic} and share success strategies.

**Format your response using markdown:**
- Use inspiring headings with #
- Use > for motivational quotes and tips
- Create bullet points for action steps
- **Bold** key mindset shifts
- Number progress tracking methods
- Use tables for goal-setting frameworks
- Use code blocks for study schedule templates`,

        'visual-teacher': `Act as a visual learning specialist for {board} {class} {subject}. Use descriptive imagery, diagrams, and spatial reasoning to explain {topic} - {subtopic}.

**Format your response using markdown:**
- Use clear hierarchical headings
- Create ASCII diagrams in code blocks
- Use tables to represent spatial relationships
- **Bold** visual concepts and patterns
- Use bullet points for visual observation steps
- Use > for visualization techniques
- Structure content to build mental images`,

        'critical-thinker': `Act as a critical thinking guide for {class} {board} {subject} students. Encourage analytical thinking and questioning about {topic} - {subtopic}.

**Format your response using markdown:**
- Use ## for questions and ### for analysis
- Create tables for argument comparisons
- Use numbered lists for logical steps
- **Bold** critical thinking frameworks
- Use > for thought-provoking questions
- Use code blocks for logical proofs
- Use bullet points for evidence evaluation`,

        'practical-guide': `Act as a practical applications expert for {subject} with {class} {board} students. Focus on hands-on learning and real-world use of {topic} - {subtopic}.

**Format your response using markdown:**
- Use ## for applications and ### for methods
- Create numbered step-by-step guides
- Use tables for tool/material comparisons
- **Bold** safety precautions and tips
- Use code blocks for measurements and calculations
- Use > for practical warnings
- Bullet points for required materials`,

        'quick-learner': `Act as an accelerated learning coach for {board} {class} {subject}. Provide efficient learning strategies and memory techniques for mastering {topic} - {subtopic}.

**Format your response using markdown:**
- Use ## for techniques and ### for examples
- Create tables for method comparisons
- Number the learning steps sequentially
- **Bold** memory techniques and acronyms
- Use code blocks for practice exercises
- Use > for time-saving tips
- Bullet points for quick review points`,

        'doubt-solver': `Act as a dedicated doubt-solving assistant for {class} {board} {subject} students. Patiently address misconceptions and clarify {topic} - {subtopic} thoroughly.

**Format your response using markdown:**
- Use ## for common doubts and ### for clarifications
- Create comparison tables for correct vs wrong concepts
- Number the clarification steps
- **Bold** key corrections
- Use code blocks for corrected solutions
- Use > for important clarifications
- Bullet points for misconception signs`
    };

    // Debug logging control
    const debugMode = new URLSearchParams(window.location.search).get('debug') === 'true';
    function debugLog(...args) {
        if (debugMode) console.log(...args);
    }
    function debugLogObj(obj) {
        if (debugMode) console.debug(obj);
    }

    // Debug: Log DOM elements
    debugLog('modelSelect:', modelSelect);
    debugLog('reasoningEffortSelect:', reasoningEffortSelect);
    debugLog('systemPromptSelect:', systemPromptSelect);
    debugLog('boardSelect:', boardSelect);
    debugLog('classSelect:', classSelect);
    debugLog('subjectSelect:', subjectSelect);
    debugLog('topicTypeSelect:', topicTypeSelect);
    debugLog('chapterSelect:', chapterSelect);
    debugLog('sendBtn:', sendBtn);
    debugLog('quickActionsSelect:', quickActionsSelect);
    debugLog('messagesContainer:', messagesContainer);
    debugLog('loading:', loading);
    debugLog('systemPreview:', systemPreview);
    debugLog('userPreview:', userPreview);

    // System preview collapse/expand
    if (toggleSystemPreviewLink && systemPreviewSection) {
        toggleSystemPreviewLink.addEventListener('click', function (e) {
            e.preventDefault();
            const isHidden = systemPreviewSection.classList.toggle('hidden');
            toggleSystemPreviewLink.textContent = isHidden
                ? 'Show system configuration'
                : 'Hide system configuration';
        });
    }

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
        const chapter = getSelectedChapters();
        const topic = getSelectedTopics();
        const subtopic = getSelectedSubtopics();
        debugLog('Updating preview with:', {
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

        // Build the topic phrase dynamically
        let topicPhrase = '';
        if (topic && topic.trim() !== '') {
            if (subtopic && subtopic.trim() !== '') {
                topicPhrase = `on '${topic}' - specifically '${subtopic}' from chapter '${chapter}' `;
            } else {
                topicPhrase = `on '${topic}' from chapter '${chapter}' `;
            }
        } else {
            topicPhrase = `from chapter '${chapter}' `;
        }

        const userContent = userTemplates[topicType]
            .replace(/{board}/g, board)
            .replace(/{class}/g, cls)
            .replace(/{subject}/g, subject)
            .replace(/{topicPhrase}/g, topicPhrase);
        // Update user preview
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

    // Disable send button if required fields not selected
    function updateSendBtnState() {
        return true;
        if (sendBtn) {
            sendBtn.disabled = !(classSelect && classSelect.value && subjectSelect && subjectSelect.value && getSelectedChapters().length);
        }
    }
    if (classSelect) classSelect.addEventListener('change', updateSendBtnState);
    if (subjectSelect) subjectSelect.addEventListener('change', updateSendBtnState);

    async function generateContent() {
        // Get configuration values
        const model = modelSelect.value;
        const reasoningEffort = reasoningEffortSelect.value;
        const systemRole = systemPromptSelect.value;
        const board = boardSelect.value;
        const cls = classSelect.value;
        const subject = subjectSelect.value;
        const topicType = topicTypeSelect.value;
        const chapter = getSelectedChapters();
        const topic = getSelectedTopics();
        const subtopic = getSelectedSubtopics();
        debugLog('Generating content with:', {
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

        // Build the topic phrase dynamically
        let topicPhrase = '';
        if (topic && topic.trim() !== '') {
            if (subtopic && subtopic.trim() !== '') {
                topicPhrase = `on '${topic}' - specifically '${subtopic}' from chapter '${chapter}' `;
            } else {
                topicPhrase = `on '${topic}' from chapter '${chapter}' `;
            }
        } else {
            topicPhrase = `from chapter '${chapter}' `;
        }

        const userContent = userTemplates[topicType]
            .replace(/{board}/g, board)
            .replace(/{class}/g, cls)
            .replace(/{subject}/g, subject)
            .replace(/{topicPhrase}/g, topicPhrase);
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
    let documentOrder = JSON.parse(localStorage.getItem('documentOrder') || '[]');

    function updateDocumentList() {
        const container = document.getElementById('document-list-container');
        container.innerHTML = '';
        // Sort by most recent (documentOrder)
        documentOrder = documentOrder.filter(name => documents[name]);
        Object.keys(documents).forEach(name => {
            if (!documentOrder.includes(name)) documentOrder.unshift(name);
        });
        localStorage.setItem('documentOrder', JSON.stringify(documentOrder));
        documentOrder.forEach(name => {
            const item = document.createElement('div');
            item.textContent = name;
            item.className = 'document-list-item';
            item.style.cursor = 'pointer';
            item.style.padding = '8px 12px';
            item.style.borderBottom = '1px solid #eee';
            item.onclick = function () {
                currentDocument = name;
                showDocumentModal(name);
            };
            container.appendChild(item);
        });
    }

    function saveDocumentsToStorage() {
        localStorage.setItem('documents', JSON.stringify(documents));
        localStorage.setItem('documentOrder', JSON.stringify(documentOrder));
        updateViewDocumentsBtn();
    }

    function updateViewDocumentsBtn() {
        const btn = document.getElementById('view-documents-btn');
        btn.style.display = Object.keys(documents).length > 0 ? '' : 'none';
    }

    document.getElementById('create-document-btn').addEventListener('click', function () {
        const name = prompt('Enter new document name:');
        if (name && !documents[name]) {
            documents[name] = [];
            documentOrder.unshift(name);
            saveDocumentsToStorage();
            updateDocumentList();
            currentDocument = name;
        } else if (documents[name]) {
            alert('Document with this name already exists.');
        }
    });

    document.getElementById('view-documents-btn').addEventListener('click', function () {
        showDocumentModal(currentDocument || documentOrder[0]);
    });

    function showDocumentModal(name) {
        debugLog('Opening document modal for:', name);
        currentDocument = name; // Ensure currentDocument is set to the displayed document
        const documentModal = document.getElementById('document-modal');
        const modalTitle = document.getElementById('modal-document-title');
        const modalEntries = document.getElementById('modal-document-entries');
        const modalSidebar = document.getElementById('modal-sidebar');
        modalSidebar.innerHTML = '';
        documentOrder.forEach(filename => {
            const item = document.createElement('div');
            item.textContent = filename;
            item.className = 'document-list-item';
            item.style.cursor = 'pointer';
            item.style.padding = '10px 18px';
            item.style.borderBottom = '1px solid #eee';
            if (filename === name) {
                item.style.background = '#e9ecef';
                item.style.fontWeight = 'bold';
            }
            item.onclick = function () {
                currentDocument = filename;
                showDocumentModal(filename);
            };
            modalSidebar.appendChild(item);
        });
        modalTitle.textContent = name || '';
        modalEntries.innerHTML = '';
        if (name && documents[name]) {
            documents[name].forEach((entry, i) => {
                const entryDiv = document.createElement('div');
                entryDiv.style.marginBottom = '18px';
                entryDiv.style.display = 'flex';
                entryDiv.style.flexDirection = 'column';
                entryDiv.style.alignItems = 'stretch';
                entryDiv.innerHTML = `<strong style='min-width:80px;'>Entry ${i + 1}:</strong>`;

                // Markdown toolbar
                const toolbar = document.createElement('div');
                toolbar.style.display = 'flex';
                toolbar.style.gap = '6px';
                toolbar.style.margin = '6px 0';
                const buttons = [
                    { label: 'B', action: '**', title: 'Bold' },
                    { label: 'I', action: '_', title: 'Italic' },
                    { label: 'H1', action: '# ', title: 'Heading 1' },
                    { label: 'H2', action: '## ', title: 'Heading 2' },
                    { label: 'List', action: '- ', title: 'List' },
                    { label: 'Code', action: '`', title: 'Inline Code' }
                ];
                // Markdown textarea
                const textarea = document.createElement('textarea');
                textarea.value = entry;
                textarea.className = 'markdown-editor';
                textarea.style.width = '100%';
                textarea.style.minHeight = '80px';
                textarea.style.marginBottom = '6px';
                textarea.style.border = '1px solid #ccc';
                textarea.style.borderRadius = '6px';
                textarea.style.padding = '8px';
                textarea.style.fontFamily = 'monospace';
                // Toolbar button actions
                buttons.forEach(btn => {
                    const b = document.createElement('button');
                    b.textContent = btn.label;
                    b.title = btn.title;
                    b.className = 'btn';
                    b.style.padding = '4px 10px';
                    b.onclick = function () {
                        const start = textarea.selectionStart;
                        const end = textarea.selectionEnd;
                        let val = textarea.value;
                        if (btn.action === '**') {
                            textarea.value = val.substring(0, start) + '**' + val.substring(start, end) + '**' + val.substring(end);
                        } else if (btn.action === '_') {
                            textarea.value = val.substring(0, start) + '_' + val.substring(start, end) + '_' + val.substring(end);
                        } else if (btn.action === '# ' || btn.action === '## ') {
                            textarea.value = val.substring(0, start) + '\n' + btn.action + val.substring(start, end) + '\n' + val.substring(end);
                        } else if (btn.action === '- ') {
                            textarea.value = val.substring(0, start) + '\n- ' + val.substring(start, end) + '\n' + val.substring(end);
                        } else if (btn.action === '`') {
                            textarea.value = val.substring(0, start) + '`' + val.substring(start, end) + '`' + val.substring(end);
                        }
                        textarea.focus();

                        renderMarkdown(textarea.value);
                    };
                    toolbar.appendChild(b);
                });
                entryDiv.appendChild(toolbar);
                entryDiv.appendChild(textarea);
                // Markdown preview
                const preview = document.createElement('div');
                preview.className = 'markdown-preview';
                preview.style.border = '1px solid #eee';
                preview.style.background = '#f9f9f9';
                preview.style.borderRadius = '6px';
                preview.style.padding = '8px';
                preview.style.marginTop = '4px';
                preview.style.fontSize = '0.98em';
                function renderMarkdown(md) {
                    if (window.marked) {
                        preview.innerHTML = window.marked.parse(md);
                    } else {
                        // Fallback: basic markdown to HTML
                        preview.innerHTML = md.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
                            .replace(/_(.*?)_/g, '<i>$1</i>')
                            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
                            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
                            .replace(/\n- (.*)/g, '<ul><li>$1</li></ul>')
                            .replace(/`([^`]+)`/g, '<code>$1</code>')
                            .replace(/\n/g, '<br>');
                    }
                }
                renderMarkdown(textarea.value);
                textarea.addEventListener('input', function () {
                    renderMarkdown(textarea.value);
                });
                entryDiv.appendChild(preview);
                // Remove button
                const removeBtn = document.createElement('button');
                removeBtn.textContent = 'Remove Entry';
                removeBtn.className = 'btn';
                removeBtn.style.marginTop = '6px';
                removeBtn.onclick = function () {
                    documents[name].splice(i, 1);
                    saveDocumentsToStorage();
                    showDocumentModal(name);
                };
                entryDiv.appendChild(removeBtn);
                modalEntries.appendChild(entryDiv);
            });
        }
        documentModal.classList.remove('hidden');
    }

    const closeModalBtn = document.getElementById('close-document-modal');
    if (closeModalBtn) {
        closeModalBtn.onclick = function () {
            debugLog('Closing document modal');
            document.getElementById('document-modal').classList.add('hidden');
        };
    }

    document.getElementById('modal-save-btn').addEventListener('click', function () {
        if (!currentDocument) return;
        debugLog('Saving document:', currentDocument);
        const modalEntries = document.getElementById('modal-document-entries');
        const editors = modalEntries.querySelectorAll('.markdown-editor');
        documents[currentDocument] = Array.from(editors).map(ed => ed.value);
        saveDocumentsToStorage();
        alert('Document saved.');
    });

    document.getElementById('modal-delete-btn').addEventListener('click', function () {
        if (!currentDocument) return;
        debugLog('Deleting document:', currentDocument);
        if (confirm('Are you sure you want to delete this document?')) {
            delete documents[currentDocument];
            documentOrder = documentOrder.filter(n => n !== currentDocument);
            saveDocumentsToStorage();
            updateDocumentList();
            document.getElementById('document-modal').classList.add('hidden');
            currentDocument = null;
        }
    });

    document.getElementById('modal-json-btn').addEventListener('click', function () {
        if (!currentDocument) return;
        debugLog('Exporting document as JSON:', currentDocument);
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(documents[currentDocument], null, 2));
        const dlAnchor = document.createElement('a');
        dlAnchor.setAttribute("href", dataStr);
        dlAnchor.setAttribute("download", currentDocument + ".json");
        dlAnchor.click();
    });

    document.getElementById('modal-pdf-btn').addEventListener('click', async function () {
        const pdfError = document.getElementById('modal-pdf-error');
        pdfError.classList.add('hidden');

        if (!currentDocument) return;

        try {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF('p', 'pt', 'a4');
            const A4_WIDTH = 595.28;
            const A4_HEIGHT = 841.89;

            // Build wrapper
            const wrapper = document.createElement("div");
            wrapper.style.width = "794px";  // match html2canvas DPI scaling
            wrapper.style.padding = "20px";
            wrapper.style.fontFamily = "Arial";
            wrapper.style.lineHeight = "1.5";

            // Load entries
            for (let i = 0; i < documents[currentDocument].length; i++) {
                const block = document.createElement("div");
                block.innerHTML = window.marked
                    ? marked.parse(documents[currentDocument][i])
                    : documents[currentDocument][i].replace(/\n/g, "<br>");
                wrapper.appendChild(block);

                if (i < documents[currentDocument].length - 1) {
                    const hr = document.createElement("hr");
                    hr.style.margin = "25px 0";
                    wrapper.appendChild(hr);
                }
            }

            // Prepare offscreen container
            const temp = document.createElement("div");
            temp.style.position = "absolute";
            temp.style.left = "-9999px";
            document.body.appendChild(temp);
            temp.appendChild(wrapper);

            // Render screenshot
            const canvas = await html2canvas(wrapper, {
                scale: 2,
                logging: false
            });

            const imgData = canvas.toDataURL("image/png");

            // Convert entire tall canvas → multiple PDF pages
            let imgWidth = A4_WIDTH;
            let imgHeight = (canvas.height * imgWidth) / canvas.width;

            let heightLeft = imgHeight;
            let position = 0;

            doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);

            heightLeft -= A4_HEIGHT;

            while (heightLeft > 0) {
                position = heightLeft - imgHeight;
                doc.addPage();
                doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= A4_HEIGHT;
            }

            doc.save(`${currentDocument}.pdf`);

            document.body.removeChild(temp);

        } catch (err) {
            pdfError.textContent = "PDF error: " + err.message;
            pdfError.classList.remove('hidden');
        }
    });

    // Add to document button below each AI response
    function addMessage(role, content) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${role}-message`;

        const headerDiv = document.createElement('div');
        headerDiv.className = 'message-header';
        headerDiv.textContent = role === 'user' ? 'Student' : 'Educational Assistant';
        messageDiv.appendChild(headerDiv);

        if (role === 'assistant') {
            // Full content
            const fullContent = document.createElement('div');
            fullContent.className = 'message-content';
            fullContent.dataset.markdown = content;
            fullContent.dataset.mode = 'rendered';
            if (window.marked) {
                fullContent.innerHTML = window.marked.parse(content);
            } else {
                fullContent.textContent = content;
            }

            // First paragraph only
            const firstPara = content.split('\n\n')[0].trim();
            const hasMore = content.trim().length > firstPara.length;

            const previewContent = document.createElement('div');
            previewContent.className = 'message-content';
            if (window.marked) {
                previewContent.innerHTML = window.marked.parse(firstPara + (hasMore ? '\n\n...' : ''));
            } else {
                previewContent.textContent = firstPara + (hasMore ? '\n\n...' : '');
            }

            // Toggle button
            const toggleBtn = document.createElement('button');
            toggleBtn.textContent = hasMore ? 'See Full Response' : 'Show Less';
            toggleBtn.className = 'btn btn-full';
            toggleBtn.style.margin = '12px 0';
            toggleBtn.style.backgroundColor = '#f0f4f8';
            toggleBtn.style.color = '#333';
            toggleBtn.style.border = '1px solid #ddd';
            toggleBtn.style.fontWeight = '600';

            // Top links: Go to end + View source
            const topLinks = document.createElement('div');
            topLinks.style.display = 'flex';
            topLinks.style.justifyContent = 'flex-end';
            topLinks.style.gap = '12px';
            topLinks.style.marginBottom = '8px';
            topLinks.style.fontSize = '0.8rem';

            const navTop = document.createElement('a');
            navTop.href = '#';
            navTop.textContent = 'Go to end of response';
            navTop.style.cursor = 'pointer';
            navTop.addEventListener('click', e => {
                e.preventDefault();
                messageDiv.scrollIntoView({ behavior: 'smooth', block: 'end' });
            });

            const toggleView = document.createElement('a');
            toggleView.href = '#';
            toggleView.textContent = 'View source';
            toggleView.style.cursor = 'pointer';
            toggleView.addEventListener('click', e => {
                e.preventDefault();
                const currentMode = fullContent.dataset.mode;
                const original = fullContent.dataset.markdown;
                if (currentMode === 'rendered') {
                    fullContent.textContent = original;
                    fullContent.dataset.mode = 'source';
                    toggleView.textContent = 'View rendered';
                } else {
                    fullContent.innerHTML = window.marked ? window.marked.parse(original) : original;
                    fullContent.dataset.mode = 'rendered';
                    toggleView.textContent = 'View source';
                }
            });

            topLinks.appendChild(toggleView);
            topLinks.appendChild(navTop);

            // Bottom link: Go to beginning
            const navBottom = document.createElement('a');
            navBottom.href = '#';
            navBottom.textContent = 'Go to beginning of response';
            navBottom.style.display = 'block';
            navBottom.style.fontSize = '0.8rem';
            navBottom.style.marginTop = '10px';
            navBottom.style.textAlign = 'right';
            navBottom.style.cursor = 'pointer';
            navBottom.addEventListener('click', e => {
                e.preventDefault();
                messageDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });

            // Start with preview
            messageDiv.appendChild(topLinks);           // Top links (always visible)
            messageDiv.appendChild(previewContent);      // First paragraph
            messageDiv.appendChild(toggleBtn);           // Toggle button

            // Toggle preview ↔ full
            toggleBtn.addEventListener('click', () => {
                if (fullContent.parentNode) {
                    messageDiv.removeChild(fullContent);
                    messageDiv.insertBefore(previewContent, toggleBtn);
                    toggleBtn.textContent = 'See Full Response';
                } else {
                    messageDiv.removeChild(previewContent);
                    messageDiv.insertBefore(fullContent, toggleBtn);
                    toggleBtn.textContent = 'Show Less';
                }
            });

            // Bottom navigation
            messageDiv.appendChild(navBottom);

            // Your document buttons (keep exactly as before)
            lastAIResponse = content;
            let addBtn = document.createElement('button');
            let removeBtn = document.createElement('button');

            if (currentDocument && documents[currentDocument] && documents[currentDocument].includes(content)) {
                removeBtn.textContent = `Remove from ${currentDocument}`;
                removeBtn.className = 'btn';
                removeBtn.style.marginTop = '8px';
                removeBtn.onclick = function () {
                    documents[currentDocument] = documents[currentDocument].filter(e => e !== content);
                    saveDocumentsToStorage();
                    alert('Response removed from document.');
                };
                messageDiv.appendChild(removeBtn);
            } else if (currentDocument) {
                addBtn.textContent = `Add to ${currentDocument}`;
                addBtn.className = 'btn';
                addBtn.style.marginTop = '8px';
                addBtn.onclick = function () {
                    documents[currentDocument].push(content);
                    saveDocumentsToStorage();
                    alert('Response saved to document.');
                };
                messageDiv.appendChild(addBtn);
            } else {
                addBtn.textContent = 'Add to new file';
                addBtn.className = 'btn';
                addBtn.style.marginTop = '8px';
                addBtn.onclick = function () {
                    const defaultName = [
                        boardSelect.value,
                        classSelect.value,
                        subjectSelect.value,
                        getSelectedChapters(),
                        getSelectedTopics(),
                        getSelectedSubtopics(),
                        modelSelect.value,
                        reasoningEffortSelect.value,
                        systemPromptSelect.value,
                        topicTypeSelect.value
                    ].filter(Boolean).join('_').replace(/,+/g, '-');

                    let modal = document.createElement('div');
                    modal.style.position = 'fixed';
                    modal.style.top = '0';
                    modal.style.left = '0';
                    modal.style.width = '100vw';
                    modal.style.height = '100vh';
                    modal.style.background = 'rgba(0,0,0,0.3)';
                    modal.style.display = 'flex';
                    modal.style.alignItems = 'center';
                    modal.style.justifyContent = 'center';
                    modal.style.zIndex = '9999';

                    let box = document.createElement('div');
                    box.style.background = '#fff';
                    box.style.padding = '24px';
                    box.style.borderRadius = '10px';
                    box.style.boxShadow = '0 2px 16px rgba(0,0,0,0.15)';
                    box.style.minWidth = '340px';
                    box.style.display = 'flex';
                    box.style.flexDirection = 'column';
                    box.style.gap = '12px';

                    let label = document.createElement('label');
                    label.textContent = 'Enter new document name:';
                    label.style.fontWeight = 'bold';
                    box.appendChild(label);

                    let textarea = document.createElement('textarea');
                    textarea.value = defaultName;
                    textarea.rows = 3;
                    textarea.style.width = '100%';
                    textarea.style.fontSize = '1em';
                    textarea.style.padding = '8px';
                    textarea.style.borderRadius = '6px';
                    textarea.style.border = '1px solid #ccc';
                    box.appendChild(textarea);

                    let btnRow = document.createElement('div');
                    btnRow.style.display = 'flex';
                    btnRow.style.justifyContent = 'flex-end';
                    btnRow.style.gap = '10px';

                    let cancelBtn = document.createElement('button');
                    cancelBtn.textContent = 'Cancel';
                    cancelBtn.className = 'btn';
                    cancelBtn.onclick = function () {
                        document.body.removeChild(modal);
                    };
                    btnRow.appendChild(cancelBtn);

                    let okBtn = document.createElement('button');
                    okBtn.textContent = 'Save';
                    okBtn.className = 'btn';
                    okBtn.style.background = '#007bff';
                    okBtn.style.color = '#fff';
                    okBtn.onclick = function () {
                        const name = textarea.value.trim();
                        if (!name) return;
                        if (documents[name]) {
                            alert('Document with this name already exists.');
                            return;
                        }
                        documents[name] = [content];
                        documentOrder.unshift(name);
                        saveDocumentsToStorage();
                        updateDocumentList();
                        currentDocument = name;
                        alert('Response saved to new document.');
                        document.body.removeChild(modal);
                    };
                    btnRow.appendChild(okBtn);

                    box.appendChild(btnRow);
                    modal.appendChild(box);
                    document.body.appendChild(modal);
                };
                messageDiv.appendChild(addBtn);
            }
        } else {
            // User message
            const contentDiv = document.createElement('div');
            contentDiv.className = 'message-content';
            contentDiv.textContent = content;
            messageDiv.appendChild(contentDiv);
        }

        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Check if URL has prepopulation parameters
    function hasPrepopulateParams() {
        const params = new URLSearchParams(window.location.search);
        return params.has('board') || params.has('class') || params.has('subject') || params.has('chapters') || params.has('topics') || params.has('subtopics');
    }

    // Restore last selections from localStorage or URL params
    let lastSelections = {};
    if (hasPrepopulateParams()) {
        const params = new URLSearchParams(window.location.search);
        lastSelections = {
            board: params.get('board') || '',
            class: params.get('class') || '',
            subject: params.get('subject') || '',
            chapter: params.get('chapters') || '',
            topic: params.get('topics') || '',
            subtopic: params.get('subtopics') || ''
        };
        debugLog('Restoring last selections from URL params:', lastSelections);
    } else {
        lastSelections = JSON.parse(localStorage.getItem('lastSelections') || '{}');
        debugLog('Restoring last selections from localStorage:', lastSelections);
    }

    function setDropdownValue(select, value, isMultiple = false) {
        if (!select || !value) return;

        if (isMultiple && select.multiple) {
            // Clear previous selections
            Array.from(select.options).forEach(option => {
                option.selected = false;
            });

            // Select new values
            const values = value.split(',');
            values.forEach(val => {
                const option = Array.from(select.options).find(opt => opt.value === val.trim());
                if (option) {
                    option.selected = true;
                }
            });

            // Trigger change event if needed
            select.dispatchEvent(new Event('change'));
        } else {
            // Single selection
            select.value = value;
        }
    }

    function saveSelections() {
        debugLog('Saving selections to localStorage');
        localStorage.setItem('lastSelections', JSON.stringify({
            class: classSelect.value,
            subject: subjectSelect.value,
            chapter: getSelectedChapters(),
            topic: getSelectedTopics(),
            subtopic: getSelectedSubtopics()
        }));
        debugLog('Selections saved:', {
            class: classSelect.value,
            subject: subjectSelect.value,
            chapter: getSelectedChapters(),
            topic: getSelectedTopics(),
            subtopic: getSelectedSubtopics()
        });
        updatePreview();
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

                // Handle multiple chapters
                if (lastSelections.chapter) {
                    const selectedChapters = lastSelections.chapter.split(',');
                    selectedChapters.forEach(chap => {
                        setDropdownValue(chapterSelect, chap, true); // true for multiple selection
                    });
                    showGroup('topic-group', !!lastSelections.chapter);
                }
            }

            if (lastSelections.class && lastSelections.subject && lastSelections.chapter && topicsHierarchy[lastSelections.class][lastSelections.subject]) {
                const selectedChapters = lastSelections.chapter.split(',');
                const uniqueTopics = new Set();

                selectedChapters.forEach(chap => {
                    if (topicsHierarchy[lastSelections.class][lastSelections.subject][chap]) {
                        const topicsObj = topicsHierarchy[lastSelections.class][lastSelections.subject][chap].Topics ||
                            topicsHierarchy[lastSelections.class][lastSelections.subject][chap].Chapters ||
                            topicsHierarchy[lastSelections.class][lastSelections.subject][chap].Prose?.Chapters ||
                            topicsHierarchy[lastSelections.class][lastSelections.subject][chap].ShortStories?.Chapters;
                        if (topicsObj) {
                            Object.keys(topicsObj).forEach(topic => {
                                uniqueTopics.add(topic);
                            });
                        } else if (Array.isArray(topicsHierarchy[lastSelections.class][lastSelections.subject][chap])) {
                            topicsHierarchy[lastSelections.class][lastSelections.subject][chap].forEach(topic => {
                                uniqueTopics.add(topic);
                            });
                        }
                    }
                });

                // Clear existing options first
                topicSelect.innerHTML = '';
                uniqueTopics.forEach(topic => {
                    topicSelect.innerHTML += `<option value="${topic}">${topic}</option>`;
                });
                console.log('Restored Topics:', Array.from(uniqueTopics));

                // Handle multiple topics
                if (lastSelections.topic) {
                    const selectedTopics = lastSelections.topic.split(',');
                    selectedTopics.forEach(topic => {
                        setDropdownValue(topicSelect, topic, true); // true for multiple selection
                    });
                    showGroup('subtopic-group', !!lastSelections.topic);
                }
            }

            if (lastSelections.class && lastSelections.subject && lastSelections.chapter && lastSelections.topic && topicsHierarchy[lastSelections.class][lastSelections.subject]) {
                const selectedChapters = lastSelections.chapter.split(',');
                const selectedTopics = lastSelections.topic.split(',');
                const uniqueSubtopics = new Set();

                selectedChapters.forEach(chap => {
                    if (topicsHierarchy[lastSelections.class][lastSelections.subject][chap]) {
                        const topicsObj = topicsHierarchy[lastSelections.class][lastSelections.subject][chap].Topics ||
                            topicsHierarchy[lastSelections.class][lastSelections.subject][chap].Chapters ||
                            topicsHierarchy[lastSelections.class][lastSelections.subject][chap].Prose?.Chapters ||
                            topicsHierarchy[lastSelections.class][lastSelections.subject][chap].ShortStories?.Chapters;

                        if (topicsObj) {
                            selectedTopics.forEach(topicName => {
                                if (topicsObj[topicName]) {
                                    const subtopicsArr = topicsObj[topicName].Subtopics || topicsObj[topicName];
                                    if (Array.isArray(subtopicsArr)) {
                                        subtopicsArr.forEach(subtopic => {
                                            uniqueSubtopics.add(subtopic);
                                        });
                                    }
                                }
                            });
                        }
                    }
                });

                // Clear existing options first
                subtopicSelect.innerHTML = '';
                uniqueSubtopics.forEach(subtopic => {
                    subtopicSelect.innerHTML += `<option value="${subtopic}">${subtopic}</option>`;
                });

                // Handle multiple subtopics
                if (lastSelections.subtopic) {
                    const selectedSubtopics = lastSelections.subtopic.split(',');
                    debugLog('restore Selected subtopics:', selectedSubtopics);
                    selectedSubtopics.forEach(subtopic => {
                        debugLog('restore Selected subtopic:', subtopic);
                        setDropdownValue(subtopicSelect, subtopic, true); // true for multiple selection
                    });
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
        topicSelect.innerHTML = '';
        subtopicSelect.innerHTML = '';
        chapterSelect.innerHTML = '';
        // chapterSelect.innerHTML = '<option value="">Select Chapter/Topic</option>';
        // topicSelect.innerHTML = '<option value="">Select Topic</option>';
        // subtopicSelect.innerHTML = '<option value="">Select Subtopic</option>';
    }

    // Helper to show/hide form groups
    function showGroup(id, show) {
        const el = document.getElementById(id);
        if (el) {
            el.classList.toggle('hidden', !show);

            // Reset form inputs when hiding the group
            if (!show) {
                // Reset single select elements
                const selectInputs = el.querySelectorAll('select');
                selectInputs.forEach(select => {
                    if (select.multiple) {
                        // For multi-select, deselect all options
                        Array.from(select.options).forEach(option => {
                            debugLog('Deselecting option:', option.value);
                            option.selected = false;
                        });
                    } else {
                        // For single select, reset to default/empty value
                        select.value = '';
                    }
                });
            }
        }
    }

    classSelect.addEventListener('change', function () {
        subjectSelect.innerHTML = '<option value="">Select Subject</option>';
        topicSelect.innerHTML = '';
        subtopicSelect.innerHTML = '';
        chapterSelect.innerHTML = '';
        // chapterSelect.innerHTML = '<option value="">Select Chapter/Topic</option>';
        // topicSelect.innerHTML = '<option value="">Select Topic</option>';
        // subtopicSelect.innerHTML = '<option value="">Select Subtopic</option>';
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
        topicSelect.innerHTML = '';
        subtopicSelect.innerHTML = '';
        chapterSelect.innerHTML = '';
        // chapterSelect.innerHTML = '<option value="">Select Chapter/Topic</option>';
        // topicSelect.innerHTML = '<option value="">Select Topic</option>';
        // subtopicSelect.innerHTML = '<option value="">Select Subtopic</option>';
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
        // Clear existing options first
        topicSelect.innerHTML = '';
        subtopicSelect.innerHTML = '';
        //topicSelect.innerHTML = '<option value="">Select Topic</option>';
        //subtopicSelect.innerHTML = '<option value="">Select Subtopic</option>';
        const cls = classSelect.value;
        const subject = subjectSelect.value;
        const chapter = getSelectedChapters();
        showGroup('topic-group', !!chapter);
        showGroup('subtopic-group', false);
        if (cls && subject && chapter) {
            // Split the comma-separated chapters string into an array
            const selectedChapters = chapter.split(',');

            // Use a Set to avoid duplicate topics across multiple chapters
            const uniqueTopics = new Set();

            selectedChapters.forEach(chap => {
                if (topicsHierarchy[cls]?.[subject]?.[chap]) {
                    const topicsObj = topicsHierarchy[cls][subject][chap].Topics ||
                        topicsHierarchy[cls][subject][chap].Chapters ||
                        topicsHierarchy[cls][subject][chap].Prose?.Chapters ||
                        topicsHierarchy[cls][subject][chap].ShortStories?.Chapters;

                    if (topicsObj) {
                        Object.keys(topicsObj).forEach(topic => {
                            uniqueTopics.add(topic);
                        });
                    } else if (Array.isArray(topicsHierarchy[cls][subject][chap])) {
                        topicsHierarchy[cls][subject][chap].forEach(topic => {
                            uniqueTopics.add(topic);
                        });
                    }
                }
            });

            // Add all unique topics to the select element
            uniqueTopics.forEach(topic => {
                topicSelect.innerHTML += `<option value="${topic}">${topic}</option>`;
            });
            console.log('Populated Topics:', Array.from(uniqueTopics));
        }
    });

    topicSelect.addEventListener('change', function () {
        // Clear existing options first
        subtopicSelect.innerHTML = '';
        //subtopicSelect.innerHTML = '<option value="">Select Subtopic</option>';
        const cls = classSelect.value;
        const subject = subjectSelect.value;
        const chapter = getSelectedChapters();
        const topic = getSelectedTopics();
        showGroup('subtopic-group', !!topic);
        if (cls && subject && chapter && topic) {
            // Split the comma-separated chapters and topics into arrays
            const selectedChapters = chapter.split(',');
            const selectedTopics = topic.split(',');

            // Use a Set to avoid duplicate subtopics across multiple chapters/topics
            const uniqueSubtopics = new Set();

            selectedChapters.forEach(chap => {
                if (topicsHierarchy[cls]?.[subject]?.[chap]) {
                    const topicsObj = topicsHierarchy[cls][subject][chap].Topics ||
                        topicsHierarchy[cls][subject][chap].Chapters ||
                        topicsHierarchy[cls][subject][chap].Prose?.Chapters ||
                        topicsHierarchy[cls][subject][chap].ShortStories?.Chapters;

                    if (topicsObj) {
                        selectedTopics.forEach(topicName => {
                            if (topicsObj[topicName]) {
                                const subtopicsArr = topicsObj[topicName].Subtopics || topicsObj[topicName];
                                if (Array.isArray(subtopicsArr)) {
                                    subtopicsArr.forEach(subtopic => {
                                        uniqueSubtopics.add(subtopic);
                                    });
                                }
                            }
                        });
                    }
                }
            });

            // Add all unique subtopics to the select element
            uniqueSubtopics.forEach(subtopic => {
                subtopicSelect.innerHTML += `<option value="${subtopic}">${subtopic}</option>`;
            });
        }
    });

    // Multi-select logic
    function getSelectedChapters() {
        const selectedOptions = Array.from(chapterSelect.selectedOptions);
        const values = selectedOptions.map(option => option.value);
        debugLog('Selected chapters:', values);
        return values.join(',');
    }
    function getSelectedTopics() {
        const selectedOptions = Array.from(topicSelect.selectedOptions);
        const values = selectedOptions.map(option => option.value);
        debugLog('getSelectedTopics:', values);
        return values.join(',');
    }
    function getSelectedSubtopics() {
        const selectedOptions = Array.from(subtopicSelect.selectedOptions);
        const values = selectedOptions.map(option => option.value);
        debugLog('getSelectedSubtopics:', values);
        return values.join(',');
    }

    // Prepopulate toolbar from URL params
    function prepopulateFromURL() {
        console.log('Prepopulating from URL parameters');
        const params = new URLSearchParams(window.location.search);
        if (params.has('board') && boardSelect) {
            setDropdownValue(boardSelect, params.get('board'));
            debugLog('Prepopulating board:', params.get('board'));
        }
        if (params.has('class') && classSelect) {
            setDropdownValue(classSelect, params.get('class'));
            debugLog('Prepopulating class:', params.get('class'));
        }
        if (params.has('subject') && subjectSelect) {
            setDropdownValue(subjectSelect, params.get('subject'));
            debugLog('Prepopulating subject:', params.get('subject'));
        }
        if (params.has('chapters')) {
            setDropdownValue(chapterSelect, params.get('chapters'), true);
            debugLog('Prepopulating chapters:', params.get('chapters'));
        }
        if (params.has('topics')) {
            setDropdownValue(topicSelect, params.get('topics'), true);
            debugLog('Prepopulating topics:', params.get('topics'));
        }
        if (params.has('subtopics')) {
            setDropdownValue(subtopicSelect, params.get('subtopics'), true);
            debugLog('Prepopulating subtopics:', params.get('subtopics'));
        }
        updateSendBtnState();
    }
    // Call after dropdowns and checkboxes are populated
    //window.prepopulateFromURL = prepopulateFromURL;
    //prepopulateFromURL();

    // After populating dropdowns and checkboxes, call prepopulateFromURL()
    // For example, after populateClassDropdown, populateCheckboxes, etc.

    // After document changes, update button
    updateViewDocumentsBtn();

    // Initialize preview
    updatePreview();
});
let tips = [];
let currentTipIndex = 0;

// Load tips
fetch('tips.json')
    .then(r => r.json())
    .then(data => {
        tips = data.tips;
        if (tips.length > 0) {
            showRandomTip();
        }
    })
    .catch(err => {
        console.error('Tips failed to load:', err);
        document.getElementById('tip-text').innerHTML = '<p style="color:#e74c3c;">Tips not available</p>';
    });

function showRandomTip() {
    if (tips.length === 0) return;
    currentTipIndex = Math.floor(Math.random() * tips.length);
    displayCurrentTip();
}

function displayCurrentTip() {
    if (tips.length === 0 || !tips[currentTipIndex]) return;
    const tip = tips[currentTipIndex];
    document.getElementById('tip-title').textContent = tip.title;
    document.getElementById('tip-description').textContent = tip.description;
    document.getElementById('tip-example').textContent = tip.example;
    document.getElementById('tip-purpose').textContent = tip.purpose;
}

// Cycle tips
document.getElementById('prev-tip').addEventListener('click', () => {
    currentTipIndex = (currentTipIndex - 1 + tips.length) % tips.length;
    displayCurrentTip();
});

document.getElementById('next-tip').addEventListener('click', () => {
    currentTipIndex = (currentTipIndex + 1) % tips.length;
    displayCurrentTip();
});

// Toggle entire tips section
document.getElementById('toggle-tips').addEventListener('click', function() {
    const content = document.getElementById('tips-content');
    if (content.style.display === 'none') {
        content.style.display = 'block';
        this.innerHTML = 'Tips for Better Learning ▲';
    } else {
        content.style.display = 'none';
        this.innerHTML = 'Tips for Better Learning ▼';
    }
});
// VSCode-style Sidebar Toggle - Mobile-friendly
const sidebarToggle = document.getElementById('toggle-sidebar');
const body = document.body;

sidebarToggle.addEventListener('click', function() {
    body.classList.toggle('sidebar-hidden');

    // Save preference
    localStorage.setItem('sidebarHidden', body.classList.contains('sidebar-hidden') ? 'true' : 'false');
});

// On load: restore state
window.addEventListener('load', function() {
    const wasHidden = localStorage.getItem('sidebarHidden') === 'true';

    if (wasHidden) {
        body.classList.add('sidebar-hidden');
    } else {
        body.classList.remove('sidebar-hidden');
    }

    // Force stacked layout on mobile regardless of sidebar state
    if (window.innerWidth <= 992) {
        document.querySelector('.chat-container').style.gridTemplateColumns = '1fr';
    }
});

// Handle resize
window.addEventListener('resize', function() {
    if (window.innerWidth <= 992) {
        document.querySelector('.chat-container').style.gridTemplateColumns = '1fr';
    } else if (!body.classList.contains('sidebar-hidden')) {
        document.querySelector('.chat-container').style.gridTemplateColumns = '460px 1fr';
    }
});

// ==================== TOUR SYSTEM ====================
// Initialize Shepherd Tour
const tour = new Shepherd.Tour({
    useModalOverlay: true,
    defaultStepOptions: {
        classes: 'shepherd-theme-custom',
        scrollTo: { behavior: 'smooth', block: 'center' },
        cancelIcon: {
            enabled: true
        }
    }
});

// Define tour steps
tour.addStep({
    id: 'welcome',
    text: `<h3>Welcome to the Educational AI Chatbot! 🎓</h3>
           <p>Let me show you around the key features of this learning platform. This tour will help you get started quickly!</p>`,
    buttons: [
        {
            text: 'Skip Tour',
            classes: 'shepherd-button-secondary',
            action: tour.cancel
        },
        {
            text: 'Start Tour',
            classes: 'shepherd-button-primary',
            action: tour.next
        }
    ]
});

tour.addStep({
    id: 'config-panel',
    text: `<h3>Configuration Panel 📋</h3>
           <p>This is your control center! Here you can configure your learning preferences including:</p>
           <ul>
               <li>Educational board (CBSE)</li>
               <li>Class/Grade level</li>
               <li>Subject, Chapter, and Topics</li>
               <li>Learning activities and AI settings</li>
           </ul>`,
    attachTo: {
        element: '.config-panel',
        on: 'right'
    },
    buttons: [
        {
            text: 'Back',
            classes: 'shepherd-button-secondary',
            action: tour.back
        },
        {
            text: 'Next',
            classes: 'shepherd-button-primary',
            action: tour.next
        }
    ]
});

tour.addStep({
    id: 'tips-section',
    text: `<h3>Learning Tips 💡</h3>
           <p>Get helpful tips for better learning! Click the arrows to browse through different tips that will enhance your study experience.</p>`,
    attachTo: {
        element: '#tips-section',
        on: 'right'
    },
    buttons: [
        {
            text: 'Back',
            classes: 'shepherd-button-secondary',
            action: tour.back
        },
        {
            text: 'Next',
            classes: 'shepherd-button-primary',
            action: tour.next
        }
    ]
});

tour.addStep({
    id: 'filters',
    text: `<h3>Learning Filters 🎯</h3>
           <p>Use these filters to narrow down your learning focus. Select your class, subject, chapter, and specific topics to get personalized content.</p>`,
    attachTo: {
        element: '.filters-section',
        on: 'right'
    },
    buttons: [
        {
            text: 'Back',
            classes: 'shepherd-button-secondary',
            action: tour.back
        },
        {
            text: 'Next',
            classes: 'shepherd-button-primary',
            action: tour.next
        }
    ]
});

tour.addStep({
    id: 'prompt-preview',
    text: `<h3>Prompt Preview 👀</h3>
           <p>See a preview of how your selections will be sent to the AI. This helps you understand exactly what you're asking for!</p>`,
    attachTo: {
        element: '.prompt-preview',
        on: 'right'
    },
    buttons: [
        {
            text: 'Back',
            classes: 'shepherd-button-secondary',
            action: tour.back
        },
        {
            text: 'Next',
            classes: 'shepherd-button-primary',
            action: tour.next
        }
    ]
});

tour.addStep({
    id: 'learning-activity',
    text: `<h3>Learning Activities 📚</h3>
           <p>Choose from various learning activities like:</p>
           <ul>
               <li>Practice Problems</li>
               <li>Concept Explanations</li>
               <li>Study Plans & Quizzes</li>
               <li>Real-life Examples</li>
               <li>And much more!</li>
           </ul>`,
    attachTo: {
        element: '#topic-type',
        on: 'right'
    },
    buttons: [
        {
            text: 'Back',
            classes: 'shepherd-button-secondary',
            action: tour.back
        },
        {
            text: 'Next',
            classes: 'shepherd-button-primary',
            action: tour.next
        }
    ]
});

tour.addStep({
    id: 'generate-button',
    text: `<h3>Generate Content Button 🚀</h3>
           <p>Once you've configured everything, click this button to generate personalized educational content based on your selections!</p>`,
    attachTo: {
        element: '#send-btn',
        on: 'top'
    },
    buttons: [
        {
            text: 'Back',
            classes: 'shepherd-button-secondary',
            action: tour.back
        },
        {
            text: 'Next',
            classes: 'shepherd-button-primary',
            action: tour.next
        }
    ]
});

tour.addStep({
    id: 'ai-settings',
    text: `<h3>Advanced AI Settings ⚙️</h3>
           <p>Toggle this to access advanced settings like AI model selection and reasoning effort levels. Great for fine-tuning your learning experience!</p>`,
    attachTo: {
        element: '#toggle-ai-settings',
        on: 'top'
    },
    buttons: [
        {
            text: 'Back',
            classes: 'shepherd-button-secondary',
            action: tour.back
        },
        {
            text: 'Next',
            classes: 'shepherd-button-primary',
            action: tour.next
        }
    ]
});

tour.addStep({
    id: 'sidebar-toggle',
    text: `<h3>Sidebar Toggle 📱</h3>
           <p>Click this hamburger menu to hide/show the configuration panel. Perfect for focusing on your content or viewing on smaller screens!</p>`,
    attachTo: {
        element: '#toggle-sidebar',
        on: 'bottom'
    },
    buttons: [
        {
            text: 'Back',
            classes: 'shepherd-button-secondary',
            action: tour.back
        },
        {
            text: 'Next',
            classes: 'shepherd-button-primary',
            action: tour.next
        }
    ]
});

tour.addStep({
    id: 'chat-area',
    text: `<h3>Chat Area 💬</h3>
           <p>This is where all the magic happens! Your generated educational content will appear here. You can see both your questions and the AI's detailed responses.</p>`,
    attachTo: {
        element: '.chat-area',
        on: 'left'
    },
    buttons: [
        {
            text: 'Back',
            classes: 'shepherd-button-secondary',
            action: tour.back
        },
        {
            text: 'Next',
            classes: 'shepherd-button-primary',
            action: tour.next
        }
    ]
});

tour.addStep({
    id: 'messages-container',
    text: `<h3>Messages Container 📝</h3>
           <p>All your conversation history appears here. Scroll through to review previous content, copy text, or export to PDF for offline study!</p>`,
    attachTo: {
        element: '#messages-container',
        on: 'left'
    },
    buttons: [
        {
            text: 'Back',
            classes: 'shepherd-button-secondary',
            action: tour.back
        },
        {
            text: 'Next',
            classes: 'shepherd-button-primary',
            action: tour.next
        }
    ]
});

tour.addStep({
    id: 'quick-actions',
    text: `<h3>Quick Actions ⚡</h3>
           <p>After getting a response, use these quick actions to:</p>
           <ul>
               <li>Get more examples</li>
               <li>Simplify explanations</li>
               <li>Test your knowledge</li>
               <li>And many more follow-up actions!</li>
           </ul>`,
    attachTo: {
        element: '#quick-actions',
        on: 'top'
    },
    buttons: [
        {
            text: 'Back',
            classes: 'shepherd-button-secondary',
            action: tour.back
        },
        {
            text: 'Next',
            classes: 'shepherd-button-primary',
            action: tour.next
        }
    ]
});

tour.addStep({
    id: 'text-selection',
    text: `<h3>Select Text for Follow-ups 🖱️</h3>
           <div style="text-align: center; margin-bottom: 24px; background: #f5f5f5; padding: 24px; border-radius: 12px;">
               <video autoplay loop muted playsinline preload="auto" style="width: 100%; max-width: 850px; height: auto; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); display: block; margin: 0 auto;">
                   <source src="gifs/gif1.mp4" type="video/mp4">
                   <div style="padding: 20px; text-align: center; color: #666;">⏳ Loading video...</div>
               </video>
           </div>
           <p>After getting an AI response, you can <strong>select any text</strong> from the AI's reply and right-click to:</p>
           <ul>
               <li><strong>Ask follow-up question</strong> with the selected text</li>
               <li><strong>Add to Sentence Builder</strong> for later use</li>
           </ul>
           <p>This makes it easy to dive deeper into specific parts of the response!</p>`,
    attachTo: {
        element: '#messages-container',
        on: 'left'
    },
    buttons: [
        {
            text: 'Back',
            classes: 'shepherd-button-secondary',
            action: tour.back
        },
        {
            text: 'Next',
            classes: 'shepherd-button-primary',
            action: tour.next
        }
    ]
});

tour.addStep({
    id: 'sentence-builder',
    text: `<h3>Sentence Builder 📝</h3>
           <div style="text-align: center; margin-bottom: 24px; background: #f5f5f5; padding: 24px; border-radius: 12px;">
               <video autoplay loop muted playsinline preload="auto" style="width: 100%; max-width: 850px; height: auto; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); display: block; margin: 0 auto;">
                   <source src="gifs/gif2.mp4" type="video/mp4">
                   <div style="padding: 20px; text-align: center; color: #666;">⏳ Loading video (15 sec clip)...</div>
               </video>
           </div>
           <p>Build custom questions by collecting text snippets from AI responses!</p>
           <ul>
               <li>Select text from any AI response</li>
               <li>Right-click and choose "Add to Sentence Builder"</li>
               <li>Combine multiple snippets to form your question</li>
               <li>Click "Send to AI" to ask your custom question</li>
           </ul>
           <p>Perfect for creating complex questions from multiple parts of the conversation!</p>`,
    buttons: [
        {
            text: 'Back',
            classes: 'shepherd-button-secondary',
            action: tour.back
        },
        {
            text: 'Next',
            classes: 'shepherd-button-primary',
            action: tour.next
        }
    ]
});

tour.addStep({
    id: 'complete',
    text: `<h3>You're All Set! 🎉</h3>
           <p>You now know how to use all the main features of the Educational AI Chatbot, including the powerful text selection and sentence builder features!</p>
           <p><strong>Pro Tip:</strong> You can always take this tour again by clicking the "Take Tour" button in the configuration panel.</p>`,
    buttons: [
        {
            text: 'Finish Tour',
            classes: 'shepherd-button-primary',
            action: tour.complete
        }
    ]
});

// Add event listener to the Take Tour button
document.getElementById('take-tour-btn').addEventListener('click', function() {
    // Make sure sidebar is visible for the tour
    if (body.classList.contains('sidebar-hidden')) {
        body.classList.remove('sidebar-hidden');
        localStorage.setItem('sidebarHidden', 'false');
    }
    
    // Start the tour
    tour.start();
});

// Optional: Auto-start tour on first visit - disabled since we have the button in splash screen
// Users can click the "Take Tour" button in the splash screen instead

// Mark tour as completed when finished
tour.on('complete', function() {
    localStorage.setItem('tourCompleted', 'true');
});

tour.on('cancel', function() {
    localStorage.setItem('tourCompleted', 'true');
});