// Configuration for the chatbot
// This file acts like .env for the frontend
// Change these values when deploying to production

const CONFIG = {
    // Express API Server URL
    // Development: http://localhost:3000
    // Production: https://your-api-server.com (change this when deploying!)
    API_URL: process.env.API_URL || 'http://localhost:3000',
    
    // API Endpoints (don't change these)
    ENDPOINTS: {
        GET_CONFIG: '/api/config/get',
        HEALTH: '/api/health'
    },
    
    // Environment
    ENV: process.env.NODE_ENV || 'development'
};

// Export for use in other files
window.CONFIG = CONFIG;

// Log current configuration (remove in production)
if (CONFIG.ENV === 'development') {
    console.log('🔧 Chatbot Configuration:');
    console.log('API URL:', CONFIG.API_URL);
    console.log('Environment:', CONFIG.ENV);
}

