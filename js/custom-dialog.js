/**
 * Custom Dialog Component
 * Service Portal - Custom Dialog Utility
 */

class CustomDialog {
    constructor() {
        this.dialogId = 'custom-dialog';
        this.initialized = false;
        this.init();
    }

    /**
     * Initialize the dialog when DOM is ready
     */
    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.createDialogElement());
        } else {
            this.createDialogElement();
        }
    }

    /**
     * Create the dialog HTML element
     */
    createDialogElement() {
        // Remove existing dialog if present
        const existingDialog = document.getElementById(this.dialogId);
        if (existingDialog) {
            existingDialog.remove();
        }

        // Check if document.body exists
        if (!document.body) {
            console.warn('Document body not ready, retrying in 100ms');
            setTimeout(() => this.createDialogElement(), 100);
            return;
        }

        // Create dialog container
        const dialog = document.createElement('div');
        dialog.id = this.dialogId;
        dialog.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 hidden';
        dialog.innerHTML = `
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 transform transition-all duration-300 scale-95 opacity-0">
                <div class="p-6">
                    <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center">
                            <div class="flex-shrink-0">
                                <i class="fas fa-question-circle text-yellow-500 text-2xl"></i>
                            </div>
                            <div class="ml-3">
                                <h3 class="text-lg font-medium text-gray-900 dark:text-white" id="dialog-title">
                                    Conferma
                                </h3>
                            </div>
                        </div>
                        <button id="dialog-close-x" 
                                class="text-gray-300 hover:text-white bg-gray-700/50 hover:bg-red-600/30 transition-all p-2.5 rounded-lg border border-gray-500 hover:border-red-400 group shadow-lg"
                                title="Chiudi dialog (ESC)">
                            <svg class="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                        </button>
                    </div>
                    <div class="mt-2">
                        <p class="text-sm text-gray-500 dark:text-gray-300" id="dialog-message">
                            Sei sicuro di voler uscire?
                        </p>
                    </div>
                </div>
                <div class="bg-gray-50 dark:bg-gray-700 px-6 py-3 flex justify-end space-x-3 rounded-b-lg">
                    <button id="dialog-cancel" class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-md hover:bg-gray-50 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200">
                        Annulla
                    </button>
                    <button id="dialog-confirm" class="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200">
                        Conferma
                    </button>
                </div>
            </div>
        `;

        // Add to body
        document.body.appendChild(dialog);

        // Add event listeners
        this.setupEventListeners();
    }

    /**
     * Setup event listeners for the dialog
     */
    setupEventListeners() {
        const dialog = document.getElementById(this.dialogId);
        const cancelBtn = document.getElementById('dialog-cancel');
        const confirmBtn = document.getElementById('dialog-confirm');
        const closeXBtn = document.getElementById('dialog-close-x');

        // Cancel button
        cancelBtn.addEventListener('click', () => {
            this.hide();
        });

        // Close X button
        closeXBtn.addEventListener('click', () => {
            this.hide();
        });

        // Confirm button
        confirmBtn.addEventListener('click', () => {
            this.hide();
            if (this.onConfirm) {
                this.onConfirm();
            }
        });

        // Click outside to close
        dialog.addEventListener('click', (e) => {
            if (e.target === dialog) {
                this.hide();
            }
        });

        // Escape key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !dialog.classList.contains('hidden')) {
                this.hide();
            }
        });
    }

    /**
     * Show the dialog
     */
    show() {
        const dialog = document.getElementById(this.dialogId);
        const dialogContent = dialog.querySelector('.bg-white, .dark\\:bg-gray-800');
        
        dialog.classList.remove('hidden');
        dialog.classList.add('flex');
        
        // Trigger animation
        setTimeout(() => {
            dialogContent.classList.remove('scale-95', 'opacity-0');
            dialogContent.classList.add('scale-100', 'opacity-100');
        }, 10);
    }

    /**
     * Hide the dialog
     */
    hide() {
        const dialog = document.getElementById(this.dialogId);
        const dialogContent = dialog.querySelector('.bg-white, .dark\\:bg-gray-800');
        
        dialogContent.classList.remove('scale-100', 'opacity-100');
        dialogContent.classList.add('scale-95', 'opacity-0');
        
        setTimeout(() => {
            dialog.classList.add('hidden');
            dialog.classList.remove('flex');
        }, 300);
    }

                    /**
                 * Show confirmation dialog
                 * @param {string} title - Dialog title
                 * @param {string} message - Dialog message
                 * @param {string} confirmText - Confirm button text
                 * @param {string} cancelText - Cancel button text
                 * @returns {Promise<boolean>} - True if confirmed, false if cancelled
                 */
                confirm(title, message, confirmText = 'Conferma', cancelText = 'Annulla') {
                    // Ensure dialog is ready
                    if (!document.getElementById(this.dialogId)) {
                        console.warn('Dialog not ready, creating now...');
                        this.createDialogElement();
                    }
        return new Promise((resolve) => {
            const titleElement = document.getElementById('dialog-title');
            const messageElement = document.getElementById('dialog-message');
            const confirmBtn = document.getElementById('dialog-confirm');
            const cancelBtn = document.getElementById('dialog-cancel');

            // Update content
            titleElement.textContent = title;
            messageElement.textContent = message;
            confirmBtn.textContent = confirmText;
            cancelBtn.textContent = cancelText;

            // Set up callback
            this.onConfirm = () => resolve(true);

            // Show dialog
            this.show();

            // Handle cancel
            const handleCancel = () => {
                resolve(false);
                this.onConfirm = null;
            };

            // Update cancel button listener
            const cancelBtnElement = document.getElementById('dialog-cancel');
            cancelBtnElement.onclick = () => {
                this.hide();
                handleCancel();
            };

            // Handle click outside
            const dialog = document.getElementById(this.dialogId);
            const handleOutsideClick = (e) => {
                if (e.target === dialog) {
                    this.hide();
                    handleCancel();
                }
            };
            dialog.onclick = handleOutsideClick;
        });
    }

    /**
     * Show alert dialog (like alert() but with custom styling)
     * @param {string} title - Dialog title
     * @param {string} message - Dialog message
     * @param {string} buttonText - Button text
     * @returns {Promise<void>} - Resolves when user clicks button
     */
    alert(title, message, buttonText = 'OK') {
        // Ensure dialog is ready
        if (!document.getElementById(this.dialogId)) {
            console.warn('Dialog not ready, creating now...');
            this.createDialogElement();
        }

        return new Promise((resolve) => {
            const titleElement = document.getElementById('dialog-title');
            const messageElement = document.getElementById('dialog-message');
            const confirmBtn = document.getElementById('dialog-confirm');
            const cancelBtn = document.getElementById('dialog-cancel');

            // Update content
            titleElement.textContent = title;
            messageElement.textContent = message;
            confirmBtn.textContent = buttonText;

            // Hide cancel button for alert
            cancelBtn.style.display = 'none';

            // Set up callback
            this.onConfirm = () => {
                // Show cancel button again for future dialogs
                cancelBtn.style.display = 'block';
                resolve();
            };

            // Show dialog
            this.show();

            // Handle click outside (close dialog)
            const dialog = document.getElementById(this.dialogId);
            const handleOutsideClick = (e) => {
                if (e.target === dialog) {
                    this.hide();
                    cancelBtn.style.display = 'block';
                    resolve();
                }
            };
            dialog.onclick = handleOutsideClick;
        });
    }
}

// Create global dialog instance
window.customDialog = new CustomDialog();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CustomDialog;
} 