// Helper function to update login UI
window.updateLoginUI = function(isLoggedIn) {
    const loginBtn = document.getElementById('loginBtn');
    if (!loginBtn) return;
    
    if (isLoggedIn) {
        loginBtn.textContent = '✓ Logged In';
        loginBtn.style.background = '#2ecc71';
        loginBtn.style.cursor = 'pointer';
        loginBtn.title = 'Click to logout';
        loginBtn.onclick = () => {
            if (confirm('Are you sure you want to logout? Your progress will not be saved until you login again.')) {
                if (window.authUI) {
                    window.authUI.logout();
                }
            }
        };
    } else {
        loginBtn.textContent = 'Login (Optional)';
        loginBtn.style.background = '';
        loginBtn.style.cursor = 'pointer';
        loginBtn.title = 'Click to login and save your progress';
        loginBtn.className = 'btn btn-primary btn-full';
        loginBtn.onclick = () => {
            if (window.authUI) {
                window.authUI.showLoginModal();
            }
        };
    }
};

// Check login status on page load
document.addEventListener('DOMContentLoaded', () => {
    const savedConfig = localStorage.getItem('supabase_config');
    window.updateLoginUI(!!savedConfig);
});
