// Service Hub Portal - Login Page JavaScript
// Clean and functional version

document.addEventListener('DOMContentLoaded', function() {
    console.log('Login page JavaScript loaded successfully');
    initializeLogin();
});

function initializeLogin() {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const pinInput = document.getElementById('pin');
    const togglePinBtn = document.getElementById('togglePin');
    const forgotPinBtn = document.getElementById('forgotPin');
    const loginButton = document.getElementById('loginButton');
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');
    
    // Form submission
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // PIN visibility toggle
    if (togglePinBtn) {
        togglePinBtn.addEventListener('click', function() {
            const pinField = document.getElementById('pin');
            if (pinField.type === 'password') {
                pinField.type = 'text';
            } else {
                pinField.type = 'password';
            }
        });
    }
    
    // Forgot PIN modal
    if (forgotPinBtn) {
        forgotPinBtn.addEventListener('click', function() {
            document.getElementById('forgotPinModal').classList.remove('hidden');
        });
    }
    
    // Close forgot PIN modal
    const closeForgotModal = document.getElementById('closeForgotModal');
    if (closeForgotModal) {
        closeForgotModal.addEventListener('click', function() {
            document.getElementById('forgotPinModal').classList.add('hidden');
        });
    }
    
    // Close modal on backdrop click
    const forgotPinModal = document.getElementById('forgotPinModal');
    if (forgotPinModal) {
        forgotPinModal.addEventListener('click', function(e) {
            if (e.target === forgotPinModal) {
                forgotPinModal.classList.add('hidden');
            }
        });
    }
    
    // PIN input formatting
    if (pinInput) {
        pinInput.addEventListener('input', function(e) {
            // Only allow numbers
            e.target.value = e.target.value.replace(/[^0-9]/g, '');
        });
    }
    
    // Auto-focus email field
    if (emailInput) {
        emailInput.focus();
    }
}

function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const pin = document.getElementById('pin').value;
    const errorDiv = document.getElementById('errorMessage');
    const successDiv = document.getElementById('successMessage');
    
    // Hide previous messages
    errorDiv.classList.add('hidden');
    successDiv.classList.add('hidden');
    
    // Basic validation
    if (!email || !pin) {
        showError('Please fill in all fields');
        return;
    }
    
    if (!isValidEmail(email)) {
        showError('Please enter a valid email address');
        return;
    }
    
    if (pin.length !== 6) {
        showError('PIN must be exactly 6 digits');
        return;
    }
    
    // Simulate login process
    const loginButton = document.getElementById('loginButton');
    loginButton.textContent = 'Authenticating...';
    loginButton.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // For demo purposes, accept any 6-digit PIN
        if (pin === '123456') {
            showSuccess('Login successful! Redirecting...');
            setTimeout(() => {
                window.location.href = '../index.html';
            }, 1500);
        } else {
            showError('Invalid credentials. Try PIN: 123456 for demo');
            loginButton.textContent = 'Access System';
            loginButton.disabled = false;
        }
    }, 1000);
}

function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden');
}

function showSuccess(message) {
    const successDiv = document.getElementById('successMessage');
    successDiv.textContent = message;
    successDiv.classList.remove('hidden');
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

console.log('Login page initialized'); 