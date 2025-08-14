/**
 * Authentication Configuration
 * Service Portal - Auth Management
 */

// Authentication configuration
const AUTH_CONFIG = {
    // Storage keys
    STORAGE_KEYS: {
        USER: 'servicehub-user',
        TOKEN: 'servicehub-auth-token',
        REMEMBER: 'servicehub-remember',
        LANGUAGE: 'servicehub-language'
    },
    
    // Routes
    ROUTES: {
        LOGIN: '/pages/login.html',
        LOGOUT: '/logout.html',
        DASHBOARD: '/index.html',
        CERTIFICATES: '/certificates.html',
        SETTINGS: '/settings.html'
    },
    
    // API endpoints
    API: {
        LOGIN: '/api/auth/login',
        LOGOUT: '/api/auth/logout',
        VERIFY: '/api/auth/verify'
    }
};

// Authentication utility functions
class AuthManager {
    constructor() {
        this.config = AUTH_CONFIG;
    }
    
    /**
     * Check if user is authenticated
     */
    isAuthenticated() {
        const token = this.getToken();
        const user = this.getUser();
        return !!(token && user);
    }
    
    /**
     * Get authentication token
     */
    getToken() {
        return localStorage.getItem(this.config.STORAGE_KEYS.TOKEN) || 
               sessionStorage.getItem(this.config.STORAGE_KEYS.TOKEN);
    }
    
    /**
     * Get user data
     */
    getUser() {
        const userData = localStorage.getItem(this.config.STORAGE_KEYS.USER);
        if (userData) {
            try {
                return JSON.parse(userData);
            } catch (error) {
                console.error('Error parsing user data:', error);
                return null;
            }
        }
        return null;
    }
    
    /**
     * Set authentication data
     */
    setAuthData(token, user, remember = false) {
        const storage = remember ? localStorage : sessionStorage;
        
        storage.setItem(this.config.STORAGE_KEYS.TOKEN, token);
        localStorage.setItem(this.config.STORAGE_KEYS.USER, JSON.stringify(user));
        
        if (remember) {
            localStorage.setItem(this.config.STORAGE_KEYS.REMEMBER, 'true');
        }
    }
    
    /**
     * Clear all authentication data
     */
    clearAuthData() {
        // Clear from both storages
        localStorage.removeItem(this.config.STORAGE_KEYS.TOKEN);
        localStorage.removeItem(this.config.STORAGE_KEYS.USER);
        localStorage.removeItem(this.config.STORAGE_KEYS.REMEMBER);
        sessionStorage.removeItem(this.config.STORAGE_KEYS.TOKEN);
    }
    
    /**
     * Redirect to login page
     */
    redirectToLogin() {
        window.location.href = this.config.ROUTES.LOGIN;
    }
    
    /**
     * Redirect to logout page
     */
    redirectToLogout() {
        window.location.href = this.config.ROUTES.LOGOUT;
    }
    
    /**
     * Check if current page is login page
     */
    isLoginPage() {
        return window.location.pathname.includes('login') || 
               window.location.pathname === '/' ||
               window.location.pathname === '/index.html';
    }
    
    /**
     * Require authentication - redirect if not authenticated
     */
    requireAuth() {
        if (!this.isAuthenticated()) {
            this.redirectToLogin();
            return false;
        }
        return true;
    }
    
    /**
     * Secure API call with authentication
     */
    async secureApiCall(url, options = {}) {
        const token = this.getToken();
        
        const defaultOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        
        if (token) {
            defaultOptions.headers['Authorization'] = `Bearer ${token}`;
        }
        
        const config = { ...defaultOptions, ...options };
        
        try {
            const response = await fetch(url, config);
            
            if (response.status === 401) {
                // Unauthorized - clear auth and redirect
                this.clearAuthData();
                this.redirectToLogin();
                return null;
            }
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            return response;
        } catch (error) {
            console.error('API Call Error:', error);
            throw error;
        }
    }
}

// Create global auth manager instance
window.authManager = new AuthManager();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AUTH_CONFIG, AuthManager };
} 