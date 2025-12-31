// Production Configuration
// Copy this to config.js when deploying to production

const CONFIG = {
    // Express API Server URL - CHANGE THIS!
    API_URL: 'https://your-api-server.herokuapp.com',  // ← Update with your deployed API URL
    
    // API Endpoints (don't change these)
    ENDPOINTS: {
        GET_CONFIG: '/api/config/get',
        HEALTH: '/api/health'
    },
    
    // Environment
    ENV: 'production'
};

// Export for use in other files
window.CONFIG = CONFIG;
