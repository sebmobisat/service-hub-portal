const VonageService = require('./vonage-service');

/**
 * Conversation Manager
 * Handles dealer-customer communications via WhatsApp/SMS
 */
class ConversationManager {
    constructor() {
        this.vonageService = new VonageService();
    }

    /**
     * Send message from dealer to customer
     * @param {number} dealerId - Dealer ID
     * @param {string} customerPhone - Customer phone number (E.164 format)
     * @param {string} message - Message content
     * @param {string} language - 'en' or 'it'
     * @param {string} channel - 'auto', 'whatsapp', 'sms'
     */
    async sendDealerMessage(dealerId, customerPhone, message, language = 'it', channel = 'auto') {
        try {
            console.log(`💬 Dealer ${dealerId} sending message to ${customerPhone} via ${channel}`);
            console.log(`🔍 ConversationManager - VonageService status:`, this.vonageService.getStatus());
            
            // Validate inputs
            if (!dealerId || !customerPhone || !message) {
                console.log('❌ Missing required parameters');
                return {
                    success: false,
                    error: 'Missing required parameters: dealerId, customerPhone, message'
                };
            }

            console.log('✅ Parameters validated');
            
            // Ensure phone number is in E.164 format
            console.log('🔧 Formatting phone number...');
            const formattedPhone = this.formatPhoneNumber(customerPhone);
            console.log(`📱 Formatted phone: ${formattedPhone}`);
            
            let result;
            
            console.log(`🔀 Processing channel: ${channel}`);
            
            switch (channel) {
                case 'whatsapp':
                    console.log('📱 Forcing WhatsApp only...');
                    // Force WhatsApp only
                    result = await this.vonageService.sendMessage(formattedPhone, message, language, true);
                    break;
                    
                case 'sms':
                    console.log('📞 Forcing SMS only...');
                    // Force SMS only
                    result = await this.vonageService.sendSMS(formattedPhone, message, language);
                    break;
                    
                case 'auto':
                default:
                    console.log('🔄 Auto mode - trying WhatsApp first...');
                    // Try WhatsApp first, fallback to SMS
                    result = await this.vonageService.sendMessage(formattedPhone, message, language, false);
                    break;
            }
            
            console.log('🎯 VonageService call completed, result:', result);

            // Log the result
            if (result.success) {
                console.log(`✅ Message sent successfully via ${result.channel} to ${customerPhone}`);
                console.log(`💰 Cost: €${result.cost || 0}`);
            } else {
                console.error(`❌ Failed to send message to ${customerPhone}: ${result.error}`);
            }

            return result;

        } catch (error) {
            console.error('❌ ConversationManager error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Send PIN message to customer
     * @param {string} customerPhone - Customer phone number
     * @param {string} pin - PIN code
     * @param {string} language - 'en' or 'it'
     * @param {string} channel - 'whatsapp' or 'sms'
     */
    async sendPinMessage(customerPhone, pin, language = 'it', channel = 'whatsapp') {
        try {
            const formattedPhone = this.formatPhoneNumber(customerPhone);
            
            const result = await this.vonageService.sendPinMessage(
                formattedPhone, 
                pin, 
                language, 
                channel
            );

            if (result.success) {
                console.log(`✅ PIN sent successfully via ${result.channel} to ${customerPhone}`);
            } else {
                console.error(`❌ Failed to send PIN to ${customerPhone}: ${result.error}`);
            }

            return result;

        } catch (error) {
            console.error('❌ ConversationManager PIN error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Format phone number to E.164 format
     * @param {string} phone - Phone number
     * @returns {string} - Formatted phone number
     */
    formatPhoneNumber(phone) {
        // Remove all non-digit characters except +
        let formatted = phone.replace(/[^\d+]/g, '');
        
        // If it doesn't start with +, add it
        if (!formatted.startsWith('+')) {
            // Assume Italian number if no country code
            if (formatted.startsWith('39')) {
                formatted = '+' + formatted;
            } else if (formatted.startsWith('3')) {
                formatted = '+39' + formatted;
            } else {
                formatted = '+' + formatted;
            }
        }
        
        return formatted;
    }

    /**
     * Get service status
     */
    getStatus() {
        return this.vonageService.getStatus();
    }
}

module.exports = ConversationManager;
