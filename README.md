# Educational AI Chatbot UI

## Overview
This project is a web-based educational AI chatbot UI designed for safe, controlled learning. It allows students to generate personalized educational content, practice problems, explanations, quizzes, and more, tailored to their curriculum and grade.

## Features
- Select class, subject, chapter, topic, and subtopic from a hierarchical curriculum (topics-hierarchy.json)
- Choose AI model, reasoning effort, and system role
- Generate educational content via AI
- Quick actions for follow-up questions
- Right-click context menu to ask follow-up or build sentences from selected AI response text
- Sentence builder panel to queue, clear, and send custom prompts
- Simulation mode for fast debugging (add `?simulation=true` to URL)

## Setup
1. Clone the repository.
2. Place all files in a web server directory (or use VS Code Live Server).
3. Ensure topics-hierarchy.json is in the root directory.
4. Open index.html in your browser.

## Usage
1. Select your class/grade. Subjects, chapters, topics, and subtopics will update based on your selection.
2. Configure AI model, reasoning effort, and system role.
3. Click "Generate Educational Content" to get personalized materials.
4. Use quick actions or right-click selected AI response text for follow-up questions or sentence building.
5. Use the sentence builder panel to manage and send custom prompts.
6. For debugging, use `?simulation=true` in the URL to simulate API responses instantly.

## Developer Documentation
- **topics-hierarchy.json**: Defines the curriculum hierarchy. Update this file to add or modify classes, subjects, chapters, topics, or subtopics.
- **main.js**: Handles UI logic, dropdown population, API calls, context menu, and sentence builder features.
- **index.html**: UI structure. Dropdowns for class, subject, chapter, topic, and subtopic are dynamically populated.
- **style.css**: UI styling.
- **Simulation mode**: All API calls are simulated if `simulation=true` is present in the URL.

### Extending Curriculum
- Add new classes, subjects, chapters, topics, or subtopics in topics-hierarchy.json.
- The UI will automatically reflect changes on reload.

### Customizing Prompts
- System and user prompt templates are in main.js. Adjust for different AI behaviors or content types.

### API
- The default API endpoint is https://text.pollinations.ai/openai. You can change this in main.js if needed.

## Contributing
- Fork the repo, make changes, and submit a pull request.
- Please document any new features or curriculum changes in the README.

## License
MIT