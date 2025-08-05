/**
 * GLOBAL THEME MANAGEMENT SYSTEM
 * Service Hub Portal - Light/Dark Theme Controller
 * 
 * This script automatically manages theme switching across all pages
 * and ensures consistent theming throughout the application.
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

class ThemeManager {
    constructor() {
        this.storageKey = 'servicehub-theme';
        this.currentTheme = this.getStoredTheme();
        this.init();
    }

    /**
     * Get theme from localStorage or default to 'dark'
     */
    getStoredTheme() {
        return localStorage.getItem(this.storageKey) || 'dark';
    }

    /**
     * Save theme to localStorage
     */
    saveTheme(theme) {
        localStorage.setItem(this.storageKey, theme);
        console.log(`🎨 Theme saved: ${theme}`);
    }

    /**
     * Apply theme to document
     */
    applyTheme(theme) {
        const html = document.documentElement;
        
        // Remove existing theme classes
        html.classList.remove('dark', 'light');
        
        // Apply new theme
        if (theme === 'dark') {
            html.classList.add('dark');
        }
        // Light theme is default (no class needed for Tailwind)
        
        // Update body class for better compatibility
        document.body.className = document.body.className.replace(/theme-\w+/g, '');
        document.body.classList.add(`theme-${theme}`);
        
        this.currentTheme = theme;
        console.log(`✅ Theme applied globally: ${theme}`);
    }

    /**
     * Switch to light theme
     */
    setLight() {
        this.applyTheme('light');
        this.saveTheme('light');
        this.updateThemeButtons();
    }

    /**
     * Switch to dark theme
     */
    setDark() {
        this.applyTheme('dark');
        this.saveTheme('dark');
        this.updateThemeButtons();
    }

    /**
     * Toggle between light and dark theme
     */
    toggle() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        if (newTheme === 'light') {
            this.setLight();
        } else {
            this.setDark();
        }
    }

    /**
     * Update theme button states across all pages
     */
    updateThemeButtons() {
        // Update settings page buttons
        const themeDark = document.getElementById('themeDark');
        const themeLight = document.getElementById('themeLight');
        
        if (themeDark && themeLight) {
            if (this.currentTheme === 'dark') {
                themeDark.className = 'px-4 py-2 rounded-lg btn-theme btn-theme-active';
                themeLight.className = 'px-4 py-2 rounded-lg btn-theme btn-theme-inactive hover:bg-gray-700 transition-colors';
            } else {
                themeDark.className = 'px-4 py-2 rounded-lg btn-theme btn-theme-inactive hover:bg-gray-700 transition-colors';
                themeLight.className = 'px-4 py-2 rounded-lg btn-theme btn-theme-active';
            }
        }

        // Update any other theme controls
        const themeToggles = document.querySelectorAll('[data-theme-toggle]');
        themeToggles.forEach(toggle => {
            toggle.setAttribute('data-current-theme', this.currentTheme);
        });
    }

    /**
     * Initialize theme system
     */
    init() {
        console.log('🚀 ThemeManager initializing...');
        
        // Apply stored theme immediately
        this.applyTheme(this.currentTheme);
        
        // Wait for DOM to be ready, then update UI
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupEventListeners();
                this.updateThemeButtons();
            });
        } else {
            this.setupEventListeners();
            this.updateThemeButtons();
        }
        
        console.log(`✅ ThemeManager initialized with theme: ${this.currentTheme}`);
    }

    /**
     * Setup event listeners for theme controls
     */
    setupEventListeners() {
        // Settings page theme buttons
        const themeDark = document.getElementById('themeDark');
        const themeLight = document.getElementById('themeLight');
        
        if (themeDark) {
            themeDark.addEventListener('click', () => this.setDark());
        }
        
        if (themeLight) {
            themeLight.addEventListener('click', () => this.setLight());
        }

        // Generic theme toggles
        const themeToggles = document.querySelectorAll('[data-theme-toggle]');
        themeToggles.forEach(toggle => {
            toggle.addEventListener('click', () => this.toggle());
        });

        console.log('🔧 Theme event listeners setup complete');
    }

    /**
     * Get current theme
     */
    getCurrentTheme() {
        return this.currentTheme;
    }

    /**
     * Check if current theme is dark
     */
    isDark() {
        return this.currentTheme === 'dark';
    }

    /**
     * Check if current theme is light
     */
    isLight() {
        return this.currentTheme === 'light';
    }
}

// Create global theme manager instance
window.themeManager = new ThemeManager();

// Expose functions for backward compatibility
window.changeTheme = function(theme) {
    if (theme === 'dark') {
        window.themeManager.setDark();
    } else if (theme === 'light') {
        window.themeManager.setLight();
    }
};

// Additional utility functions
window.getCurrentTheme = () => window.themeManager.getCurrentTheme();
window.toggleTheme = () => window.themeManager.toggle();

console.log('🎨 Global Theme System loaded successfully!'); 