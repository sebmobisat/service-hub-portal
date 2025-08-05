/**
 * AUTH GUARD - Service Hub Portal
 * Protects pages from unauthorized access in production
 */

// Global protection against Node.js exports errors
if (typeof module === 'undefined') {
    var module = {};
}
if (typeof exports === 'undefined') {
    var exports = {};
}
if (typeof require === 'undefined') {
    var require = function() { return {}; };
}

class AuthGuard {
    constructor() {
        this.loginUrl = '/pages/login.html';
        this.publicPages = ['/pages/login.html', '/logout.html'];
        this.isProduction = this.checkProductionEnvironment();
    }

    /**
     * Check if we're in production environment
     */
    checkProductionEnvironment() {
        const hostname = window.location.hostname;
        return hostname !== 'localhost' && 
               hostname !== '127.0.0.1' && 
               hostname !== '0.0.0.0' &&
               !hostname.includes('.local') &&
               !hostname.includes('.test');
    }

    /**
     * Check if current page is public (no auth required)
     */
    isPublicPage() {
        const currentPath = window.location.pathname;
        return this.publicPages.some(page => currentPath.includes(page));
    }

    /**
     * Verify authentication status
     */
    isAuthenticated() {
        const token = localStorage.getItem('servicehub-auth-token') || sessionStorage.getItem('servicehub-auth-token');
        const user = localStorage.getItem('servicehub-user') || sessionStorage.getItem('servicehub-user');
        
        if (!token || !user) {
            return false;
        }

        // Verify token is not expired
        try {
            const userData = JSON.parse(user);
            if (userData.expiresAt && new Date() > new Date(userData.expiresAt)) {
                this.logout();
                return false;
            }
        } catch (error) {
            console.error('Error parsing user data:', error);
            this.logout();
            return false;
        }

        return true;
    }

    /**
     * Protect current page
     */
    protectPage() {
        // Skip protection in development
        if (!this.isProduction) {
            console.log('🔓 Development mode: Authentication bypassed');
            return true;
        }

        // Allow public pages
        if (this.isPublicPage()) {
            console.log('🔓 Public page: No authentication required');
            return true;
        }

        // Check authentication
        if (!this.isAuthenticated()) {
            console.warn('🚫 Unauthorized access detected - redirecting to login');
            this.redirectToLogin();
            return false;
        }

        console.log('✅ Page protected - user authenticated');
        return true;
    }

    /**
     * Redirect to login page
     */
    redirectToLogin() {
        // Store current page for redirect after login
        const currentUrl = window.location.href;
        sessionStorage.setItem('redirectAfterLogin', currentUrl);
        
        // Redirect to login
        window.location.href = this.loginUrl;
    }

    /**
     * Handle successful login
     */
    handleSuccessfulLogin(userData) {
        // Store authentication data
        localStorage.setItem('servicehub-auth-token', userData.token);
        localStorage.setItem('servicehub-user', JSON.stringify({
            ...userData,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
        }));

        // Redirect to original page or dashboard
        const redirectUrl = sessionStorage.getItem('redirectAfterLogin') || '/index.html';
        sessionStorage.removeItem('redirectAfterLogin');
        
        window.location.href = redirectUrl;
    }

    /**
     * Logout user
     */
    logout() {
        localStorage.removeItem('servicehub-auth-token');
        localStorage.removeItem('servicehub-user');
        sessionStorage.removeItem('servicehub-auth-token');
        sessionStorage.removeItem('servicehub-user');
        sessionStorage.removeItem('redirectAfterLogin');
        
        console.log('🔓 User logged out');
        
        // Redirect to login
        window.location.href = this.loginUrl;
    }

    /**
     * Initialize auth guard
     */
    init() {
        console.log(`🔐 Auth Guard initialized - Production: ${this.isProduction}`);
        
        // Protect page on load
        this.protectPage();
        
        // Set up periodic authentication check
        if (this.isProduction) {
            setInterval(() => {
                if (!this.isAuthenticated()) {
                    console.warn('🚫 Authentication lost - redirecting to login');
                    this.redirectToLogin();
                }
            }, 60000); // Check every minute
        }
    }
}

// Global auth guard instance
window.authGuard = new AuthGuard();

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    window.authGuard.init();
}); 