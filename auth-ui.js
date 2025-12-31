// Authentication UI Manager
class AuthUI {
    constructor() {
        this.modal = null;
        this.authManager = null;
        this.init();
    }

    init() {
        this.createModal();
        this.setupEventListeners();
        this.checkAutoLogin();
    }

    // Check if user has saved config in localStorage
    async checkAutoLogin() {
        const savedConfig = localStorage.getItem('supabase_config');
        if (savedConfig) {
            try {
                const config = JSON.parse(savedConfig);
                console.log('Found saved config, attempting auto-login...');
                
                // Initialize Supabase with saved config
                if (window.supabaseClient) {
                    await window.supabaseClient.initialize(config);
                    console.log('Auto-login successful!');
                }
            } catch (error) {
                console.error('Auto-login failed:', error);
                localStorage.removeItem('supabase_config');
            }
        }
    }

    createModal() {
        const modalHTML = `
            <div id="login-modal" class="modal hidden">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>Login to Save Your Progress</h2>
                        <button class="close-btn" id="close-login-modal">&times;</button>
                    </div>
                    
                    <!-- UUID Step -->
                    <div id="uuid-step" class="auth-step">
                        <p class="step-description">Enter your configuration UUID provided by your teacher</p>
                        
                        <div class="form-group">
                            <label>Configuration UUID</label>
                            <input type="text" id="uuid-input" placeholder="Enter UUID" />
                        </div>
                        
                        <button id="uuid-submit-btn" class="btn btn-primary">Continue</button>
                        <p class="help-text">Don't have a UUID? Contact your teacher.</p>
                    </div>
                    
                    <!-- PIN Step -->
                    <div id="pin-step" class="auth-step hidden">
                        <p class="step-description">Enter the PIN for this configuration</p>
                        
                        <div class="form-group">
                            <label>PIN Code</label>
                            <input type="password" id="pin-input" placeholder="Enter 6-digit PIN" maxlength="6" />
                        </div>
                        
                        <button id="pin-submit-btn" class="btn btn-primary">Login</button>
                        <button id="pin-back-btn" class="btn btn-secondary">Back</button>
                    </div>
                    
                    <!-- Loading Step -->
                    <div id="loading-step" class="auth-step hidden">
                        <div class="loading-spinner"></div>
                        <p>Connecting...</p>
                    </div>
                    
                    <!-- Success Step -->
                    <div id="success-step" class="auth-step hidden">
                        <div class="success-icon">✓</div>
                        <h3>Connected Successfully!</h3>
                        <p id="config-name"></p>
                        <button id="success-done-btn" class="btn btn-primary">Start Learning</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.modal = document.getElementById('login-modal');
    }

    setupEventListeners() {
        // Login button
        const loginBtn = document.getElementById('loginBtn');
        if (loginBtn) {
            loginBtn.onclick = () => this.showLoginModal();
        }

        // Close modal
        document.getElementById('close-login-modal')?.addEventListener('click', () => {
            this.closeModal();
        });

        // UUID submit
        document.getElementById('uuid-submit-btn')?.addEventListener('click', () => {
            this.handleUUIDSubmit();
        });

        // PIN submit
        document.getElementById('pin-submit-btn')?.addEventListener('click', () => {
            this.handlePINSubmit();
        });

        // PIN back button
        document.getElementById('pin-back-btn')?.addEventListener('click', () => {
            this.showUUIDStep();
        });

        // Success done
        document.getElementById('success-done-btn')?.addEventListener('click', () => {
            this.closeModal();
        });

        // Enter key handlers
        document.getElementById('uuid-input')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleUUIDSubmit();
        });

        document.getElementById('pin-input')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handlePINSubmit();
        });

        // Click outside to close
        this.modal?.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });
    }

    showLoginModal() {
        this.modal.classList.remove('hidden');
        this.showUUIDStep();
    }

    closeModal() {
        this.modal.classList.add('hidden');
        this.resetForm();
    }

    resetForm() {
        document.getElementById('uuid-input').value = '';
        document.getElementById('pin-input').value = '';
        this.currentUUID = null;
    }

    showUUIDStep() {
        this.hideAllSteps();
        document.getElementById('uuid-step').classList.remove('hidden');
        document.getElementById('uuid-input').focus();
    }

    showPINStep() {
        this.hideAllSteps();
        document.getElementById('pin-step').classList.remove('hidden');
        document.getElementById('pin-input').focus();
    }

    showLoadingStep() {
        this.hideAllSteps();
        document.getElementById('loading-step').classList.remove('hidden');
    }

    showSuccessStep(configName) {
        this.hideAllSteps();
        document.getElementById('success-step').classList.remove('hidden');
        document.getElementById('config-name').textContent = configName || 'Configuration loaded';
    }

    hideAllSteps() {
        document.querySelectorAll('.auth-step').forEach(step => {
            step.classList.add('hidden');
        });
    }

    async handleUUIDSubmit() {
        const uuid = document.getElementById('uuid-input').value.trim();
        
        if (!uuid) {
            alert('Please enter a UUID');
            return;
        }

        this.currentUUID = uuid;
        this.showLoadingStep();

        try {
            // Try to fetch config without PIN first (for no-pin access)
            const apiUrl = window.CONFIG?.API_URL || 'http://localhost:3000';
            const response = await fetch(`${apiUrl}/api/config/get`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ uuid })
            });

            if (!response.ok) {
                const data = await response.json();
                
                // Check if PIN/OTP is required
                if (response.status === 401 && (data.requiresPin || data.requiresOtp)) {
                    // PIN/OTP required - show PIN step
                    this.showPINStep();
                    return;
                }
                
                // Other error
                throw new Error(data.error || `Server error: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.success && data.config) {
                // No PIN required - connect directly
                await this.connectToSupabase(data.config, data.name);
            } else {
                throw new Error('Invalid response from server');
            }
        } catch (error) {
            console.error('Error:', error);
            
            // Better error messages
            let errorMsg = 'Failed to connect to server. ';
            if (error.message.includes('fetch')) {
                errorMsg += 'Make sure the Express server is running on port 3000.';
            } else {
                errorMsg += error.message;
            }
            
            alert(errorMsg);
            this.showUUIDStep();
        }
    }

    async handlePINSubmit() {
        const pin = document.getElementById('pin-input').value.trim();
        
        if (!pin) {
            alert('Please enter a PIN');
            return;
        }

        this.showLoadingStep();

        try {
            const apiUrl = window.CONFIG?.API_URL || 'http://localhost:3000';
            const response = await fetch(`${apiUrl}/api/config/get`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    uuid: this.currentUUID,
                    pin 
                })
            });

            const data = await response.json();

            if (response.ok) {
                await this.connectToSupabase(data.config, data.name);
            } else {
                throw new Error(data.error || 'Invalid PIN');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error: ' + error.message);
            this.showPINStep();
        }
    }

    async connectToSupabase(config, name) {
        try {
            // Save config to localStorage for auto-login
            localStorage.setItem('supabase_config', JSON.stringify(config));
            
            // Initialize Supabase client
            if (window.supabaseClient) {
                const connected = await window.supabaseClient.initialize(config);
                
                if (!connected) {
                    console.warn('⚠️ Supabase connection test failed');
                    console.warn('📖 See FIX_401_ERROR.md for help');
                    // Still show success - connection might work even if test failed
                }
            }
            
            this.showSuccessStep(name);
            
            // Update UI to show logged in state
            if (window.updateLoginUI) {
                window.updateLoginUI(true);
            }
        } catch (error) {
            console.error('Failed to connect to Supabase:', error);
            alert('Failed to connect: ' + error.message + '\n\nCheck console for details.');
            this.showUUIDStep();
        }
    }

    // Logout function
    logout() {
        localStorage.removeItem('supabase_config');
        if (window.supabaseClient) {
            window.supabaseClient.disconnect();
        }
        if (window.updateLoginUI) {
            window.updateLoginUI(false);
        }
        alert('Logged out successfully');
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.authUI = new AuthUI();
    });
} else {
    window.authUI = new AuthUI();
}
