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
        console.debug('Opening document modal for:', name);
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
            console.debug('Closing document modal');
            document.getElementById('document-modal').classList.add('hidden');
        };
    }

    document.getElementById('modal-save-btn').addEventListener('click', function () {
        if (!currentDocument) return;
        console.debug('Saving document:', currentDocument);
        const modalEntries = document.getElementById('modal-document-entries');
        const editors = modalEntries.querySelectorAll('.wysiwyg-editor');
        documents[currentDocument] = Array.from(editors).map(ed => ed.innerHTML);
        saveDocumentsToStorage();
        alert('Document saved.');
    });

    document.getElementById('modal-delete-btn').addEventListener('click', function () {
        if (!currentDocument) return;
        console.debug('Deleting document:', currentDocument);
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
        console.debug('Exporting document as JSON:', currentDocument);
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(documents[currentDocument], null, 2));
        const dlAnchor = document.createElement('a');
        dlAnchor.setAttribute("href", dataStr);
        dlAnchor.setAttribute("download", currentDocument + ".json");
        dlAnchor.click();
    });

    document.getElementById('modal-pdf-btn').addEventListener('click', function () {
        console.debug('PDF export button clicked');
        const pdfError = document.getElementById('modal-pdf-error');
        pdfError.classList.add('hidden');
        if (!currentDocument) {
            console.debug('No current document selected for PDF export');
            return;
        }
        if (!window.jspdf || !window.jspdf.jsPDF) {
            console.debug('jsPDF library not loaded');
            pdfError.textContent = 'jsPDF library not loaded.';
            pdfError.classList.remove('hidden');
            return;
        }
        try {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();

            // Optimize for minimal ink usage
            doc.setDrawColor(100);
            doc.setTextColor(60, 60, 60);

            const pageWidth = doc.internal.pageSize.width;
            const margin = 15;
            let y = margin;
            const lineHeight = 6;

            // Function to convert HTML to PDF elements (simplified)
            function renderHTMLContent(html, startY) {
                let currentY = startY;
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = html;

                function processNode(node, depth = 0) {
                    if (currentY > doc.internal.pageSize.height - 20) {
                        doc.addPage();
                        currentY = margin;
                    }

                    const nodeMargin = margin + (depth * 5);

                    if (node.nodeType === Node.TEXT_NODE) {
                        const text = node.textContent.trim();
                        if (text) {
                            const lines = doc.splitTextToSize(text, pageWidth - (nodeMargin * 2));
                            lines.forEach(line => {
                                if (currentY > doc.internal.pageSize.height - 10) {
                                    doc.addPage();
                                    currentY = margin;
                                }
                                doc.text(line, nodeMargin, currentY);
                                currentY += lineHeight;
                            });
                        }
                    }
                    else if (node.nodeType === Node.ELEMENT_NODE) {
                        const tagName = node.tagName.toLowerCase();

                        // Save current style
                        const originalFont = doc.getFont();
                        const originalStyle = doc.getFont().fontStyle;
                        const originalSize = doc.getFontSize();
                        const originalColor = doc.getTextColor();

                        // Apply styles based on HTML tags
                        switch (tagName) {
                            case 'h1':
                            case 'h2':
                            case 'h3':
                                doc.setFont(undefined, 'bold');
                                doc.setFontSize(originalSize + (14 - parseInt(tagName[1])));
                                break;
                            case 'strong':
                            case 'b':
                                doc.setFont(undefined, 'bold');
                                break;
                            case 'em':
                            case 'i':
                                doc.setFont(undefined, 'italic');
                                break;
                            case 'code':
                                doc.setFont('courier', 'normal');
                                doc.setTextColor(40, 40, 40);
                                // Light background for code
                                const textWidth = doc.getTextWidth(node.textContent);
                                if (textWidth < pageWidth - (nodeMargin * 2)) {
                                    doc.setFillColor(245, 245, 245);
                                    doc.rect(nodeMargin - 1, currentY - 3, textWidth + 2, lineHeight, 'F');
                                }
                                break;
                            case 'pre':
                                // Code block handling
                                doc.setFont('courier', 'normal');
                                doc.setFontSize(8);
                                doc.setTextColor(40, 40, 40);

                                const code = node.textContent;
                                const codeLines = doc.splitTextToSize(code, pageWidth - (margin * 2) - 10);
                                const codeHeight = (codeLines.length * 5) + 8;

                                if (currentY + codeHeight > doc.internal.pageSize.height - 10) {
                                    doc.addPage();
                                    currentY = margin;
                                }

                                // Code block background and border
                                doc.setFillColor(245, 245, 245);
                                doc.rect(margin, currentY - 2, pageWidth - (margin * 2), codeHeight, 'F');
                                doc.setDrawColor(200);
                                doc.rect(margin, currentY - 2, pageWidth - (margin * 2), codeHeight);

                                // Render code lines
                                codeLines.forEach((line, index) => {
                                    doc.text(line, margin + 4, currentY + (index * 5) + 2);
                                });

                                currentY += codeHeight + 2;
                                break;
                            case 'blockquote':
                                doc.setFillColor(248, 248, 248);
                                doc.rect(nodeMargin - 5, currentY - 2, 3, lineHeight + 2, 'F');
                                break;
                            case 'ul':
                            case 'ol':
                                // List handling
                                Array.from(node.children).forEach((li, index) => {
                                    if (currentY > doc.internal.pageSize.height - 10) {
                                        doc.addPage();
                                        currentY = margin;
                                    }

                                    const bullet = tagName === 'ol' ? `${index + 1}.` : '•';
                                    doc.text(bullet, nodeMargin, currentY);
                                    processNode(li, depth + 1);
                                });
                                return; // Skip normal child processing for lists
                            case 'li':
                                doc.text('  ', nodeMargin, currentY);
                                break;
                            case 'p':
                                currentY += 2; // Extra space for paragraphs
                                break;
                            case 'hr':
                                doc.setDrawColor(200);
                                doc.line(margin, currentY, pageWidth - margin, currentY);
                                currentY += 8;
                                return; // Skip child processing
                        }

                        // Process child nodes
                        Array.from(node.childNodes).forEach(child => {
                            currentY = processNode(child, depth + 1);
                        });

                        // Restore original style
                        doc.setFont(originalFont.fontName, originalStyle);
                        doc.setFontSize(originalSize);
                        doc.setTextColor(originalColor);

                        // Add spacing after certain elements
                        if (['h1', 'h2', 'h3', 'p', 'pre', 'blockquote'].includes(tagName)) {
                            currentY += 4;
                        }
                    }

                    return currentY;
                }

                // Process all child nodes
                Array.from(tempDiv.childNodes).forEach(child => {
                    currentY = processNode(child);
                });

                return currentY;
            }

            // Process each document entry
            documents[currentDocument].forEach((entry, i) => {
                // Check if we need a new page
                if (y > doc.internal.pageSize.height - 20) {
                    doc.addPage();
                    y = margin;
                }

                // Entry header
                doc.setFont(undefined, 'bold');
                doc.setTextColor(60, 60, 60);
                doc.text(`Entry ${i + 1}:`, margin, y);
                y += lineHeight + 2;

                try {
                    // Convert markdown to HTML using a markdown library
                    // Choose one of these popular libraries:

                    // Option 1: If using marked (most common)
                    const htmlContent = window.marked ? window.marked.parse(entry) : entry;

                    // Option 2: If using marked with options for better security
                    // const htmlContent = window.marked ? window.marked.parse(entry, {
                    //     breaks: true,
                    //     gfm: true
                    // }) : entry;

                    // Option 3: If using Showdown
                    // const htmlContent = window.showdown ? (new window.showdown.Converter()).makeHtml(entry) : entry;

                    // Render the HTML content
                    y = renderHTMLContent(htmlContent, y);

                } catch (mdError) {
                    console.warn('Markdown parsing failed, falling back to plain text:', mdError);
                    // Fallback to plain text rendering
                    const cleanText = entry.replace(/<[^>]+>/g, '');
                    const lines = doc.splitTextToSize(cleanText, pageWidth - (margin * 2));
                    lines.forEach(line => {
                        if (y > doc.internal.pageSize.height - 10) {
                            doc.addPage();
                            y = margin;
                        }
                        doc.text(line, margin, y);
                        y += lineHeight;
                    });
                }

                // Add spacing between entries (except after last one)
                if (i < documents[currentDocument].length - 1) {
                    y += 8;
                    doc.setDrawColor(200);
                    doc.line(margin, y, pageWidth - margin, y);
                    y += 4;
                }
            });

            doc.save(currentDocument + '.pdf');
            console.debug('PDF generated and saved for document:', currentDocument);

        } catch (err) {
            console.error('Error generating PDF:', err);
            pdfError.textContent = 'Error generating PDF: ' + err.message;
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
                    const name = prompt('No document selected. Enter new document name:');
                    if (name && !documents[name]) {
                        documents[name] = [content];
                        documentOrder.unshift(name);
                        saveDocumentsToStorage();
                        updateDocumentList();
                        currentDocument = name;
                        alert('Response saved to new document.');
                    } else if (documents[name]) {
                        alert('Document with this name already exists.');
                        return;
                    } else {
                        return;
                    }
                };
                messageDiv.appendChild(addBtn);
            }
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
