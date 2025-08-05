// Service Hub Portal - Frontend Authentication Module
// Works with Node.js backend and EmailJS integration

class AuthManager {
    constructor() {
        this.apiBaseUrl = window.location.origin;
        this.currentStep = 'email'; // 'email' or 'pin'
        this.currentEmail = null;
        this.retryCount = 0;
        this.maxRetries = 3;
    }

    // Step 1: Request PIN by validating email and sending PIN
    async requestPin(email) {
        try {
            // Reset retry count for new email
            if (email !== this.currentEmail) {
                this.retryCount = 0;
            }
            
            this.currentEmail = email;
            
            // Show loading state
            this.showMessage('Validating dealer email...', 'info');
            
            const response = await fetch(`${this.apiBaseUrl}/api/auth/request-pin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });
            
            const data = await response.json();
            
            if (data.success) {
                this.currentStep = 'pin';
                
                // Show success message with dealer info
                this.showMessage(
                    `Welcome ${data.dealer.name} from ${data.dealer.companyName}! 
                     PIN sent to your email address.`, 
                    'success'
                );
                
                // Development mode - show PIN in console
                if (data.developmentPin) {
                    console.log(`🔐 Development PIN: ${data.developmentPin}`);
                    this.showMessage(
                        `Development Mode: Your PIN is ${data.developmentPin}`, 
                        'info'
                    );
                }
                
                return { success: true, dealer: data.dealer };
                
            } else {
                let errorMessage = 'Failed to send PIN';
                
                switch (data.error) {
                    case 'dealer_not_found':
                        errorMessage = 'Email address not found in dealer database. Please contact support.';
                        break;
                    case 'email_required':
                        errorMessage = 'Please enter your email address.';
                        break;
                    default:
                        errorMessage = data.message || 'An error occurred. Please try again.';
                }
                
                this.showMessage(errorMessage, 'error');
                return { success: false, error: data.error };
            }
            
        } catch (error) {
            console.error('Request PIN error:', error);
            this.showMessage('Network error. Please check your connection and try again.', 'error');
            return { success: false, error: 'network_error' };
        }
    }

    // Step 2: Verify PIN and complete login
    async verifyPin(pin) {
        try {
            if (!this.currentEmail) {
                throw new Error('No email set. Please start over.');
            }
            
            this.showMessage('Verifying PIN...', 'info');
            
            const response = await fetch(`${this.apiBaseUrl}/api/auth/verify-pin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: this.currentEmail,
                    pin: pin
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                // Store authentication data (compatible with existing system)
                localStorage.setItem('servicehub-user', JSON.stringify(data.dealer));
                localStorage.setItem('servicehub-auth-token', data.token);
                localStorage.setItem('servicehub-login-time', new Date().toISOString());
                
                // Also store in the format expected by other parts of the system
                const authData = {
                    dealerId: data.dealer.id,
                    dealerName: data.dealer.companyName,
                    email: data.dealer.email,
                    name: data.dealer.name
                };
                localStorage.setItem('authData', JSON.stringify(authData));
                
                this.showMessage('Login successful! Redirecting...', 'success');
                
                // Reset state
                this.currentStep = 'email';
                this.currentEmail = null;
                this.retryCount = 0;
                
                return { 
                    success: true, 
                    dealer: data.dealer,
                    token: data.token
                };
                
            } else {
                this.retryCount++;
                
                let errorMessage = 'Invalid PIN';
                
                switch (data.error) {
                    case 'pin_expired':
                        errorMessage = 'PIN has expired. Please request a new one.';
                        this.currentStep = 'email';
                        break;
                    case 'invalid_pin':
                        const attemptsLeft = this.maxRetries - this.retryCount;
                        errorMessage = attemptsLeft > 0 
                            ? `Invalid PIN. ${attemptsLeft} attempt(s) remaining.`
                            : 'Invalid PIN. Too many attempts.';
                        break;
                    case 'too_many_attempts':
                        errorMessage = 'Too many failed attempts. Please request a new PIN.';
                        this.currentStep = 'email';
                        break;
                    case 'missing_fields':
                        errorMessage = 'Please enter the PIN.';
                        break;
                    default:
                        errorMessage = 'PIN verification failed. Please try again.';
                }
                
                this.showMessage(errorMessage, 'error');
                return { success: false, error: data.error };
            }
            
        } catch (error) {
            console.error('Verify PIN error:', error);
            this.showMessage('Network error. Please try again.', 'error');
            return { success: false, error: 'network_error' };
        }
    }

    // Check if user is already authenticated
    isAuthenticated() {
        const user = localStorage.getItem('servicehub-user');
        const token = localStorage.getItem('servicehub-auth-token');
        const loginTime = localStorage.getItem('servicehub-login-time');
        
        if (!user || !token || !loginTime) {
            return false;
        }
        
        // Check if session is still valid (24 hours)
        const loginDate = new Date(loginTime);
        const now = new Date();
        const hoursDiff = (now - loginDate) / (1000 * 60 * 60);
        
        if (hoursDiff > 24) {
            this.logout();
            return false;
        }
        
        return true;
    }

    // Get current user data
    getCurrentUser() {
        if (!this.isAuthenticated()) {
            return null;
        }
        
        try {
            return JSON.parse(localStorage.getItem('servicehub-user'));
        } catch (error) {
            console.error('Error parsing user data:', error);
            this.logout();
            return null;
        }
    }

    // Logout user
    logout() {
        // Use auth guard if available
        if (window.authGuard) {
            window.authGuard.logout();
        } else {
            // Fallback logout
            localStorage.removeItem('servicehub-user');
            localStorage.removeItem('servicehub-auth-token');
            localStorage.removeItem('servicehub-login-time');
            localStorage.removeItem('authData'); // Also remove the legacy format
            
            // Reset state
            this.currentStep = 'email';
            this.currentEmail = null;
            this.retryCount = 0;
            
            // Redirect to login
            window.location.href = '/pages/login.html';
        }
    }

    // Show message to user
    showMessage(message, type = 'info') {
        const errorDiv = document.getElementById('errorMessage');
        const successDiv = document.getElementById('successMessage');
        
        // Hide both messages first
        if (errorDiv) errorDiv.classList.add('hidden');
        if (successDiv) successDiv.classList.add('hidden');
        
        // Show appropriate message
        if (type === 'error' && errorDiv) {
            errorDiv.textContent = message;
            errorDiv.classList.remove('hidden');
        } else if (type === 'success' && successDiv) {
            successDiv.textContent = message;
            successDiv.classList.remove('hidden');
        } else if (type === 'info') {
            // Show info messages in success div with blue styling
            if (successDiv) {
                successDiv.textContent = message;
                successDiv.classList.remove('hidden');
                successDiv.className = successDiv.className.replace('bg-green-600', 'bg-blue-600');
            }
        }
    }

    // Reset current step (for UI)
    resetToEmailStep() {
        this.currentStep = 'email';
        this.currentEmail = null;
        this.retryCount = 0;
    }
}

// Create global instance
window.authManager = new AuthManager(); 