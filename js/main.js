// Service Hub Portal - Main JavaScript
// Based on Mobisat architecture with portal-specific functionality
// Version: 1.0.0

// Global variables
let currentLanguage = 'en';
let isDarkMode = false;
let currentUser = null;

// Prevent double initialization
if (window.serviceHubInitialized) {
    console.log('Service Hub already initialized, skipping...');
} else {
    window.serviceHubInitialized = true;
    
    // Initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', initializeServiceHub);
}

// Main initialization function
function initializeServiceHub() {
    console.log('Initializing Service Hub Portal...');
    
    // Load user preferences first
    loadUserPreferences();
    
    // Load header and footer
    loadDynamicContent();
    
    // Initialize theme after content is loaded
    setTimeout(() => {
        initializeTheme();
        initializeLanguage();
        initializeEventListeners();
        initializeAuthentication();
    }, 100);
}

// Load user preferences from localStorage
function loadUserPreferences() {
    const savedTheme = localStorage.getItem('servicehub-theme');
    const savedLanguage = localStorage.getItem('servicehub-language');
    const savedUser = localStorage.getItem('servicehub-user');
    
    if (savedTheme) {
        isDarkMode = savedTheme === 'dark';
    }
    
    if (savedLanguage) {
        currentLanguage = savedLanguage;
    }

    if (savedUser) {
        try {
            currentUser = JSON.parse(savedUser);
        } catch (e) {
            console.error('Error parsing saved user data:', e);
            localStorage.removeItem('servicehub-user');
        }
    }
}

// Load dynamic header and footer
function loadDynamicContent() {
    // Load header
    fetch('/header.html')
        .then(response => response.text())
        .then(html => {
            const headerContainer = document.getElementById('header-container');
            if (headerContainer) {
                headerContainer.innerHTML = html;
            } else {
                // If no container exists, add header to body
                const headerDiv = document.createElement('div');
                headerDiv.innerHTML = html;
                document.body.insertBefore(headerDiv.firstElementChild, document.body.firstChild);
            }
            
            // Initialize header functionality after loading
            initializeHeader();
        })
        .catch(error => console.error('Error loading header:', error));

    // Load footer
    fetch('/footer.html')
        .then(response => response.text())
        .then(html => {
            const footerContainer = document.getElementById('footer-container');
            if (footerContainer) {
                footerContainer.innerHTML = html;
            } else {
                // If no container exists, add footer to body
                const footerDiv = document.createElement('div');
                footerDiv.innerHTML = html;
                document.body.appendChild(footerDiv.firstElementChild);
            }
            
            // Initialize footer functionality after loading
            initializeFooter();
        })
        .catch(error => console.error('Error loading footer:', error));
}

// Initialize theme functionality
function initializeTheme() {
    const html = document.documentElement;
    const themeToggle = document.getElementById('theme-toggle');
    
    // Apply current theme
    if (isDarkMode) {
        html.classList.add('dark');
    } else {
        html.classList.remove('dark');
    }
    
    // Update theme toggle icon
    updateThemeToggleIcon();
    
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
}

// Toggle theme function
function toggleTheme() {
    isDarkMode = !isDarkMode;
    const html = document.documentElement;
    
    if (isDarkMode) {
        html.classList.add('dark');
    } else {
        html.classList.remove('dark');
    }
    
    // Save preference
    localStorage.setItem('servicehub-theme', isDarkMode ? 'dark' : 'light');
    
    // Update icon
    updateThemeToggleIcon();
    
    console.log('Theme toggled to:', isDarkMode ? 'dark' : 'light');
}

// Update theme toggle icon
function updateThemeToggleIcon() {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        const icon = themeToggle.querySelector('i');
        if (icon) {
            if (isDarkMode) {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            } else {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
            }
        }
    }
}

// Initialize language functionality
function initializeLanguage() {
    const langEN = document.getElementById('lang-en');
    const langIT = document.getElementById('lang-it');
    
    // Set active language buttons
    updateLanguageButtons();
    
    if (langEN) {
        langEN.addEventListener('click', () => switchLanguage('en'));
    }
    
    if (langIT) {
        langIT.addEventListener('click', () => switchLanguage('it'));
    }
    
    // Apply current language
    updateLanguageContent();
}

// Switch language function
function switchLanguage(language) {
    if (language === currentLanguage) return;
    
    currentLanguage = language;
    localStorage.setItem('servicehub-language', language);
    
    updateLanguageButtons();
    updateLanguageContent();
    
    console.log('Language switched to:', language);
}

// Update language button states
function updateLanguageButtons() {
    const langEN = document.getElementById('lang-en');
    const langIT = document.getElementById('lang-it');
    
    if (langEN && langIT) {
        // Reset both buttons
        langEN.className = 'w-10 h-10 rounded-full text-sm font-medium hover:bg-primary hover:text-white transition-all duration-300 flex items-center justify-center';
        langIT.className = 'w-10 h-10 rounded-full text-sm font-medium hover:bg-primary hover:text-white transition-all duration-300 flex items-center justify-center';
        
        // Set active button
        if (currentLanguage === 'en') {
            langEN.className += ' bg-primary text-white';
        } else {
            langIT.className += ' bg-primary text-white';
        }
    }
}

// Update all content with language data attributes
function updateLanguageContent() {
    const elements = document.querySelectorAll('[data-en][data-it]');
    
    elements.forEach(element => {
        const text = element.getAttribute(`data-${currentLanguage}`);
        if (text) {
            element.textContent = text;
        }
    });
    
    // Update placeholders
    const inputElements = document.querySelectorAll('[data-placeholder-en][data-placeholder-it]');
    inputElements.forEach(element => {
        const placeholder = element.getAttribute(`data-placeholder-${currentLanguage}`);
        if (placeholder) {
            element.placeholder = placeholder;
        }
    });
}

// Initialize header-specific functionality
function initializeHeader() {
    // Mobile menu toggle
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    }
    
    // Logout buttons
    const logoutBtn = document.getElementById('logout-btn');
    const logoutBtnMobile = document.getElementById('logout-btn-mobile');
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    if (logoutBtnMobile) {
        logoutBtnMobile.addEventListener('click', handleLogout);
    }
    
    // Update user display
    updateUserDisplay();
}

// Initialize footer-specific functionality
function initializeFooter() {
    // Contact modal functionality
    const contactModalTrigger = document.getElementById('contact-modal-trigger');
    const contactModal = document.getElementById('contact-modal');
    const contactModalClose = document.getElementById('contact-modal-close');
    
    if (contactModalTrigger && contactModal) {
        contactModalTrigger.addEventListener('click', () => {
            contactModal.classList.remove('hidden');
            contactModal.classList.add('flex');
        });
    }
    
    if (contactModalClose && contactModal) {
        contactModalClose.addEventListener('click', () => {
            contactModal.classList.add('hidden');
            contactModal.classList.remove('flex');
        });
    }
    
    // Close modal on backdrop click
    if (contactModal) {
        contactModal.addEventListener('click', (e) => {
            if (e.target === contactModal) {
                contactModal.classList.add('hidden');
                contactModal.classList.remove('flex');
            }
        });
    }
}

// Toggle mobile menu
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    const toggleIcon = document.querySelector('#mobile-menu-toggle i');
    
    if (mobileMenu) {
        if (mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.remove('hidden');
            if (toggleIcon) {
                toggleIcon.classList.remove('fa-bars');
                toggleIcon.classList.add('fa-times');
            }
        } else {
            mobileMenu.classList.add('hidden');
            if (toggleIcon) {
                toggleIcon.classList.remove('fa-times');
                toggleIcon.classList.add('fa-bars');
            }
        }
    }
}

// Initialize general event listeners
function initializeEventListeners() {
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        const mobileMenu = document.getElementById('mobile-menu');
        const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
        
        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
            if (!mobileMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                mobileMenu.classList.add('hidden');
                const toggleIcon = mobileMenuToggle.querySelector('i');
                if (toggleIcon) {
                    toggleIcon.classList.remove('fa-times');
                    toggleIcon.classList.add('fa-bars');
                }
            }
        }
    });
    
    // Handle escape key for modals
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });
}

// Initialize authentication check
function initializeAuthentication() {
    // Check if user is logged in
    if (!currentUser && !isLoginPage()) {
        redirectToLogin();
        return;
    }
    
    // Update user display if logged in
    if (currentUser) {
        updateUserDisplay();
    }
    
    // Set up logout button event listener
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
}

// Check if current page is login page
function isLoginPage() {
    return window.location.pathname.includes('login') || window.location.pathname === '/';
}

// Redirect to login page
function redirectToLogin() {
    if (!isLoginPage()) {
        window.location.href = '/pages/login.html';
    }
}

// Handle logout
async function handleLogout() {
    const title = currentLanguage === 'en' ? 'Confirm Logout' : 'Conferma Logout';
    const message = currentLanguage === 'en' ? 'Are you sure you want to logout?' : 'Sei sicuro di voler uscire?';
    const confirmText = currentLanguage === 'en' ? 'Logout' : 'Esci';
    const cancelText = currentLanguage === 'en' ? 'Cancel' : 'Annulla';
    
    const confirmed = await window.customDialog.confirm(title, message, confirmText, cancelText);
    
    if (confirmed) {
        // Clear all authentication data
        localStorage.removeItem('servicehub-user');
        localStorage.removeItem('servicehub-auth-token');
        sessionStorage.removeItem('servicehub-auth-token');
        localStorage.removeItem('servicehub-remember');
        currentUser = null;
        
        // Redirect to login
        window.location.href = '/pages/login.html';
    }
}

// Update user display
function updateUserDisplay() {
    if (currentUser) {
        const userNameElements = document.querySelectorAll('#user-name, #user-name-mobile');
        userNameElements.forEach(element => {
            element.textContent = currentUser.name || currentUser.email || 'Dealer';
        });
    }
}

// Close all modals
function closeAllModals() {
    const modals = document.querySelectorAll('.fixed.inset-0');
    modals.forEach(modal => {
        if (!modal.classList.contains('hidden')) {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }
    });
}

// Utility function to show loading state
function showLoading(element) {
    if (element) {
        element.classList.add('loading');
        const spinner = element.querySelector('.spinner') || document.createElement('div');
        spinner.className = 'spinner';
        element.appendChild(spinner);
    }
}

// Utility function to hide loading state
function hideLoading(element) {
    if (element) {
        element.classList.remove('loading');
        const spinner = element.querySelector('.spinner');
        if (spinner) {
            spinner.remove();
        }
    }
}

// API Helper functions
async function apiCall(endpoint, options = {}) {
    const defaultOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    };
    
    // Add auth token if available
    const token = localStorage.getItem('servicehub-auth-token');
    if (token) {
        defaultOptions.headers['Authorization'] = `Bearer ${token}`;
    }
    
    const config = { ...defaultOptions, ...options };
    
    try {
        const response = await fetch(endpoint, config);
        
        if (!response.ok) {
            if (response.status === 401) {
                // Unauthorized - redirect to login
                handleLogout();
                return null;
            }
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API Call Error:', error);
        throw error;
    }
}

// Authentication check
function checkAuthentication() {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    const userData = localStorage.getItem('userData') || sessionStorage.getItem('userData');
    
    if (!token || !userData) {
        // Not authenticated, redirect to login if not already there
        if (!window.location.pathname.includes('login.html') && !window.location.pathname.includes('index.html')) {
            window.location.href = 'pages/login.html';
        }
        return false;
    }
    return true;
}

// Logout function
function logout() {
    // Clear all authentication data
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('userData');
    
    // Clear any other stored data
    localStorage.removeItem('userPreferences');
    
    // Redirect to login page
    window.location.href = 'pages/login.html';
}

// Make logout function globally available
window.logout = logout;

// Export functions for global access
window.ServiceHub = {
    toggleTheme,
    switchLanguage,
    apiCall,
    showLoading,
    hideLoading,
    closeAllModals,
    handleLogout
};

console.log('Service Hub Portal JavaScript loaded successfully'); 