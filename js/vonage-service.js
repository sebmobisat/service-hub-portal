const { Vonage } = require('@vonage/server-sdk');

/**
 * Vonage Service for WhatsApp and SMS messaging
 * Handles authentication, message sending, and fallback logic
 */
class VonageService {
    constructor() {
        console.log('🚨🚨🚨 VONAGE SERVICE CONSTRUCTOR CALLED 🚨🚨🚨');
        
        // Load credentials from environment
        this.apiKey = process.env.VONAGE_API_KEY;
        this.apiSecret = process.env.VONAGE_API_SECRET;
        this.applicationId = process.env.VONAGE_APPLICATION_ID;
        this.privateKey = this.processPrivateKey(process.env.VONAGE_PRIVATE_KEY);
        this.fromNumber = process.env.VONAGE_FROM_NUMBER || process.env.VONAGE_WHATSAPP_NUMBER;
        this.whatsappNumber = process.env.VONAGE_WHATSAPP_NUMBER;
        
        console.log('🔍 Raw VONAGE_PRIVATE_KEY exists:', !!process.env.VONAGE_PRIVATE_KEY);
        console.log('🔍 Raw private key length:', process.env.VONAGE_PRIVATE_KEY?.length || 0);
        
        // Check if service should be enabled
        // Sandbox mode: requires only API Key + Secret
        // Production mode: requires API Key + Secret + Application ID + Private Key
        this.isEnabled = !!(this.apiKey && this.apiSecret);
        this.whatsappEnabled = !!(this.isEnabled && this.whatsappNumber);
        this.smsEnabled = !!(this.isEnabled && this.fromNumber);
        
        if (this.isEnabled) {
            try {
                console.log('🔧 INITIALIZING VONAGE CLIENT...');
                
                // For Sandbox: use API Key + Secret only (no JWT)
                // For Production: use Application ID + Private Key (with JWT)
                if (this.applicationId && this.privateKey) {
                    console.log('🔧 Using Application ID + Private Key (Production mode)');
                    console.log('🔧 PROCESSING PRIVATE KEY...');
                    console.log('✅ PRIVATE KEY PROCESSED');
                    console.log('🔍 Processed private key starts with:', this.privateKey.substring(0, 30) + '...');
                    console.log('🔍 Processed private key length:', this.privateKey.length);
                    console.log('🔍 Processed private key ends with:', this.privateKey.substring(this.privateKey.length - 30));
                    
                    this.vonage = new Vonage({
                        apiKey: this.apiKey,
                        apiSecret: this.apiSecret,
                        applicationId: this.applicationId,
                        privateKey: this.privateKey
                    });
                } else {
                    console.log('🔧 Using API Key + Secret only (Sandbox mode)');
                    this.vonage = new Vonage({
                        apiKey: this.apiKey,
                        apiSecret: this.apiSecret
                    });
                }
                
                console.log('✅ Vonage client initialized successfully');
            } catch (error) {
                console.error('❌ Failed to initialize Vonage client:', error);
                this.isEnabled = false;
                this.whatsappEnabled = false;
                this.smsEnabled = false;
            }
        }
        
        console.log('🔧 Vonage Service Status:', {
            enabled: this.isEnabled,
            whatsappEnabled: this.whatsappEnabled,
            smsEnabled: this.smsEnabled,
            fromNumber: this.fromNumber,
            whatsappNumber: this.whatsappNumber,
            hasCredentials: {
                apiKey: !!this.apiKey,
                apiSecret: !!this.apiSecret,
                applicationId: !!this.applicationId,
                privateKey: !!this.privateKey
            },
            pricing: { whatsapp: 0.10, sms: 0.08 }
        });
    }

    /**
     * Process private key from environment variable
     * Handles both raw keys and base64 encoded keys
     */
    processPrivateKey(rawKey) {
        if (!rawKey) return null;
        
        console.log('🔧 PROCESSING PRIVATE KEY - Input type:', typeof rawKey);
        console.log('🔧 PROCESSING PRIVATE KEY - Input length:', rawKey.length);
        console.log('🔧 PROCESSING PRIVATE KEY - First 50 chars:', rawKey.substring(0, 50));
        console.log('🔧 PROCESSING PRIVATE KEY - Last 50 chars:', rawKey.substring(rawKey.length - 50));
        
        // If already formatted, return as is
        if (rawKey.includes('-----BEGIN PRIVATE KEY-----')) {
            console.log('✅ Key already formatted with BEGIN/END markers');
            // Clean up the key: remove quotes and fix newlines
            let formattedKey = rawKey
                .replace(/^"|"$/g, '') // Remove leading/trailing quotes
                .replace(/\\n/g, '\n') // Replace literal \n with actual newlines
                .replace(/\s+/g, ' ') // Normalize spaces
                .replace(/ -----/g, '\n-----') // Fix header/footer
                .replace(/----- /g, '-----\n') // Fix header/footer
                .trim();
            
            // Ensure proper formatting
            if (!formattedKey.endsWith('\n')) {
                formattedKey += '\n';
            }
            
            console.log('🔧 After cleanup:', formattedKey.substring(0, 100));
            console.log('🔧 Key ends with:', formattedKey.substring(formattedKey.length - 50));
            return formattedKey;
        }
        
        // If base64 encoded, decode it
        try {
            console.log('🔧 Attempting base64 decode...');
            const decoded = Buffer.from(rawKey, 'base64').toString('utf8');
            if (decoded.includes('-----BEGIN PRIVATE KEY-----')) {
                console.log('✅ Successfully decoded base64 key');
                return decoded.replace(/\\n/g, '\n');
            }
        } catch (e) {
            console.log('❌ Base64 decode failed:', e.message);
        }
        
        // Assume it's raw key content, format it
        console.log('🔧 Formatting raw key content...');
        const lines = rawKey.match(/.{1,64}/g) || [];
        const formatted = `-----BEGIN PRIVATE KEY-----\n${lines.join('\n')}\n-----END PRIVATE KEY-----`;
        console.log('✅ Formatted key:', formatted.substring(0, 100) + '...');
        return formatted;
    }

    /**
     * Send message with automatic fallback: WhatsApp -> SMS
     * @param {string} to - Recipient phone number (E.164 format)
     * @param {string} message - Message content
     * @param {string} language - 'en' or 'it'
     * @param {boolean} forceWhatsApp - Force WhatsApp only (no SMS fallback)
     * @returns {Promise<{success:boolean, channel:string, messageId?:string, cost?:number, error?:string}>}
     */
    async sendMessage(to, message, language = 'en', forceWhatsApp = false) {
        if (!this.isEnabled) {
            console.log('Vonage service disabled - API credentials not configured');
            console.log('🔍 SIMULATED MESSAGE SEND:');
            console.log(`📱 To: ${to}`);
            console.log(`💬 Message: ${message}`);
            console.log(`🌍 Language: ${language}`);
            console.log('✅ Message would be sent successfully (simulated)');
            return { success: true, channel: 'simulated', messageId: 'simulated-' + Date.now(), cost: 0 };
        }

        // Try WhatsApp first if enabled
        if (this.whatsappEnabled && this.whatsappNumber) {
            try {
                const whatsappResult = await this.sendWhatsAppMessage(to, message, language);
                if (whatsappResult.success) {
                    console.log(`✅ WhatsApp message sent successfully to ${to}`);
                    return {
                        success: true,
                        channel: 'whatsapp',
                        messageId: whatsappResult.messageId,
                        cost: 0.10 // €0.10 per WhatsApp message
                    };
                }
                
                // Check if we should fallback to SMS
                if (!forceWhatsApp && this.shouldFallbackToSMS(whatsappResult.error)) {
                    console.log(`🔄 Falling back to SMS for ${to}`);
                    const smsResult = await this.sendSMS(to, message, language);
                    if (smsResult.success) {
                        return {
                            success: true,
                            channel: 'sms',
                            messageId: smsResult.messageId,
                            cost: 0.08 // €0.08 per SMS
                        };
                    }
                    return { success: false, error: smsResult.error };
                }
                
                return { success: false, error: whatsappResult.error };
                
            } catch (error) {
                console.error(`❌ WhatsApp error for ${to}:`, error.message);
                
                // Try SMS fallback if not forcing WhatsApp
                if (!forceWhatsApp && this.smsEnabled) {
                    console.log(`🔄 Falling back to SMS for ${to}`);
                    const smsResult = await this.sendSMS(to, message, language);
                    if (smsResult.success) {
                        return {
                            success: true,
                            channel: 'sms',
                            messageId: smsResult.messageId,
                            cost: 0.08
                        };
                    }
                }
                
                return { success: false, error: error.message };
            }
        }
        
        // Fall back to SMS if WhatsApp not available
        if (this.smsEnabled) {
            console.log(`📱 Sending SMS to ${to} (WhatsApp not available)`);
            const smsResult = await this.sendSMS(to, message, language);
            if (smsResult.success) {
                return {
                    success: true,
                    channel: 'sms',
                    messageId: smsResult.messageId,
                    cost: 0.08
                };
            }
            return { success: false, error: smsResult.error };
        }
        
        return { success: false, error: 'No messaging service available' };
    }

    /**
     * Send WhatsApp message via Vonage Messages API
     */
    async sendWhatsAppMessage(to, message, language) {
        console.log('📤 SENDING WHATSAPP MESSAGE:');
        
        const payload = {
            message_type: 'text',
            text: message,
            to: to,
            from: this.whatsappNumber,
            channel: 'whatsapp'
        };
        
        console.log('📋 Payload:', JSON.stringify(payload, null, 2));
        console.log('🔗 From number:', this.whatsappNumber);
        console.log('📱 To number:', to);
        console.log('💬 Message text:', message);

        try {
            const response = await this.vonage.messages.send(payload);
            
            console.log('✅ WHATSAPP RESPONSE:', JSON.stringify(response, null, 2));
            
            return {
                success: true,
                messageId: response.message_uuid
            };
        } catch (error) {
            console.error('❌ WHATSAPP ERROR DETAILS:');
            console.error('📋 Error message:', error.message);
            console.error('🔍 Error response:', error.response?.data || 'No response data');
            console.error('📊 Error status:', error.response?.status || 'No status');
            console.error('🔧 Full error:', error);
            
            // Try to get response body for more details
            if (error.response && error.response.body) {
                try {
                    const responseBody = await error.response.text();
                    console.error('📄 Response body:', responseBody);
                } catch (e) {
                    console.error('📄 Could not read response body');
                }
            }
            
            // Handle specific WhatsApp errors that should trigger SMS fallback
            const shouldFallback = this.shouldFallbackToSMS(error);
            return {
                success: false,
                error: error.message,
                shouldFallback
            };
        }
    }

    /**
     * Send SMS via Vonage SMS API
     */
    async sendSMS(to, message, language) {
        if (!this.fromNumber) {
            return { success: false, error: 'SMS from number not configured' };
        }

        try {
            console.log('📤 SENDING SMS MESSAGE:');
            console.log('📱 To:', to);
            console.log('🔗 From:', this.fromNumber);
            console.log('💬 Message:', message);
            console.log('🌍 Language:', language);

            const response = await this.vonage.sms.send({
                to: to,
                from: this.fromNumber,
                text: message,
                type: 'unicode' // Support for Italian characters and emojis
            });

            console.log('✅ SMS RESPONSE:', JSON.stringify(response, null, 2));
            
            // Log detailed messages array
            if (response.messages && response.messages.length > 0) {
                console.log('📋 SMS MESSAGE DETAILS:');
                response.messages.forEach((msg, index) => {
                    console.log(`  Message ${index + 1}:`, JSON.stringify(msg, null, 4));
                });
            }

            if (response.messages && response.messages[0] && response.messages[0].status === '0') {
                console.log('✅ SMS sent successfully');
                return {
                    success: true,
                    messageId: response.messages[0]['message-id']
                };
            } else {
                const errorText = response.messages?.[0]?.['error-text'] || 'SMS send failed';
                const status = response.messages?.[0]?.status || 'unknown';
                console.error('❌ SMS failed with status:', status, 'error:', errorText);
                return {
                    success: false,
                    error: errorText
                };
            }
        } catch (error) {
            console.error('❌ SMS ERROR DETAILS:');
            console.error('📋 Error message:', error.message);
            console.error('🔧 Full error:', error);
            
            // Extract detailed error information from Vonage response
            if (error.response && error.response.messages) {
                console.log('📋 VONAGE SMS ERROR MESSAGE DETAILS:');
                error.response.messages.forEach((msg, index) => {
                    console.log(`  Message ${index + 1}:`, JSON.stringify(msg, null, 4));
                });
            }
            
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Send PIN message with localization
     * @param {string} to - Recipient phone number
     * @param {string} pin - PIN code
     * @param {string} language - 'en' or 'it'
     * @param {string} channel - 'whatsapp' or 'sms'
     */
    async sendPinMessage(to, pin, language = 'it', channel = 'whatsapp') {
        const messages = {
            it: {
                whatsapp: `🔐 *Service Portal*\n\nIl tuo codice PIN di accesso è: *${pin}*\n\nQuesto codice è valido per 10 minuti.\nNon condividere questo codice con nessuno.\n\n---\nService Portal\nPiattaforma Telematica Avanzata`,
                sms: `🔐 Service Portal\n\nIl tuo PIN è: ${pin}\n\nValido per 10 minuti.\nNon condividere questo codice.\n\nService Portal`
            },
            en: {
                whatsapp: `🔐 *Service Portal*\n\nYour access PIN code is: *${pin}*\n\nThis code is valid for 10 minutes.\nDo not share this code with anyone.\n\n---\nService Portal\nAdvanced Telematics Platform`,
                sms: `🔐 Service Portal\n\nYour PIN is: ${pin}\n\nValid for 10 minutes.\nDo not share this code.\n\nService Portal`
            }
        };

        const message = messages[language]?.[channel] || messages.it[channel];
        
        if (channel === 'whatsapp') {
            return await this.sendMessage(to, message, language, true); // Force WhatsApp
        } else {
            return await this.sendSMS(to, message, language);
        }
    }

    /**
     * Check if error should trigger SMS fallback
     */
    shouldFallbackToSMS(error) {
        // Common WhatsApp errors that should trigger SMS fallback
        const fallbackErrors = [
            '21910', // WhatsApp number not registered
            '63016', // WhatsApp message undeliverable
            'USER_NOT_REACHABLE',
            'MESSAGE_UNDELIVERABLE',
            'WHATSAPP_NOT_AVAILABLE',
            'Invalid sender', // Vonage WhatsApp sender not configured
            'The `from` parameter is invalid' // Vonage specific error
        ];

        const errorString = error.message || error.toString();
        return fallbackErrors.some(errorCode => errorString.includes(errorCode));
    }

    /**
     * Get service status
     */
    getStatus() {
        return {
            enabled: this.isEnabled,
            whatsappEnabled: this.whatsappEnabled,
            smsEnabled: this.smsEnabled,
            fromNumber: this.fromNumber,
            whatsappNumber: this.whatsappNumber
        };
    }
}

module.exports = VonageService;
