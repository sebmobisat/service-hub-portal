/**
 * Email Service - Amazon SES Integration
 * Service Hub Portal - Email functionality for PIN delivery
 */

const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');

class EmailService {
    constructor() {
        this.sesClient = new SESClient({
            region: process.env.AWS_REGION || 'us-east-1',
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
            }
        });
        
        this.fromEmail = process.env.SES_FROM_EMAIL || 'noreply@servicehub.mobisat.com';
        this.isEnabled = !!(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY);
    }

    /**
     * Send a generic email using SES
     * @param {string} toEmail
     * @param {string} subject
     * @param {string} htmlBody
     * @param {string} textBody
     * @returns {Promise<{success:boolean, messageId?:string, error?:string}>}
     */
    async sendGenericEmail(toEmail, subject, htmlBody, textBody = '') {
        if (!this.isEnabled) {
            console.log('Email service disabled - AWS credentials not configured');
            return { success: false, error: 'email_service_disabled' };
        }

        try {
            const command = new SendEmailCommand({
                Source: this.fromEmail,
                Destination: { ToAddresses: [toEmail] },
                Message: {
                    Subject: { Data: subject, Charset: 'UTF-8' },
                    Body: {
                        Html: { Data: htmlBody, Charset: 'UTF-8' },
                        Text: { Data: textBody || htmlBody.replace(/<[^>]+>/g, ''), Charset: 'UTF-8' }
                    }
                }
            });

            const result = await this.sesClient.send(command);
            console.log(`Email sent successfully to ${toEmail}, Message ID: ${result.MessageId}`);
            return { success: true, messageId: result.MessageId };
        } catch (error) {
            console.error('Error sending generic email:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Send PIN email to dealer
     * @param {string} toEmail - Dealer's email address
     * @param {string} dealerName - Dealer's company name
     * @param {string} pin - 6-digit PIN
     * @param {string} language - 'en' or 'it'
     * @returns {Promise<boolean>} - Success status
     */
    async sendPinEmail(toEmail, dealerName, pin, language = 'en') {
        if (!this.isEnabled) {
            console.log('Email service disabled - AWS credentials not configured');
            return false;
        }

        try {
            const subject = language === 'it' 
                ? `Service Hub Portal - Il tuo PIN di accesso`
                : `Service Hub Portal - Your Access PIN`;

            const htmlBody = this.generateEmailHTML(dealerName, pin, language);
            const textBody = this.generateEmailText(dealerName, pin, language);

            const command = new SendEmailCommand({
                Source: this.fromEmail,
                Destination: {
                    ToAddresses: [toEmail]
                },
                Message: {
                    Subject: {
                        Data: subject,
                        Charset: 'UTF-8'
                    },
                    Body: {
                        Html: {
                            Data: htmlBody,
                            Charset: 'UTF-8'
                        },
                        Text: {
                            Data: textBody,
                            Charset: 'UTF-8'
                        }
                    }
                }
            });

            const result = await this.sesClient.send(command);
            console.log(`Email sent successfully to ${toEmail}, Message ID: ${result.MessageId}`);
            return true;

        } catch (error) {
            console.error('Error sending email:', error);
            return false;
        }
    }

    /**
     * Generate HTML email body
     */
    generateEmailHTML(dealerName, pin, language) {
        const isItalian = language === 'it';
        
        return `
        <!DOCTYPE html>
        <html lang="${language}">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${isItalian ? 'Service Hub Portal - PIN di Accesso' : 'Service Hub Portal - Access PIN'}</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #10b981; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
                .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
                .pin-box { background: white; border: 2px solid #10b981; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; }
                .pin { font-size: 32px; font-weight: bold; color: #10b981; letter-spacing: 4px; }
                .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
                .warning { background: #fef3c7; border: 1px solid #f59e0b; border-radius: 4px; padding: 15px; margin: 20px 0; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🔧 Service Hub Portal</h1>
                </div>
                
                <div class="content">
                    <h2>${isItalian ? 'Ciao' : 'Hello'} ${dealerName}!</h2>
                    
                    <p>${isItalian 
                        ? 'Hai richiesto un PIN di accesso per il Service Hub Portal. Ecco il tuo PIN:'
                        : 'You requested an access PIN for the Service Hub Portal. Here is your PIN:'
                    }</p>
                    
                    <div class="pin-box">
                        <div class="pin">${pin}</div>
                    </div>
                    
                    <p>${isItalian
                        ? 'Usa questo PIN per accedere al tuo account. Il PIN è valido per questa sessione.'
                        : 'Use this PIN to access your account. The PIN is valid for this session.'
                    }</p>
                    
                    <div class="warning">
                        <strong>${isItalian ? '⚠️ Sicurezza:' : '⚠️ Security:'}</strong><br>
                        ${isItalian
                            ? 'Non condividere questo PIN con nessuno. Se non hai richiesto questo PIN, contatta immediatamente il supporto.'
                            : 'Do not share this PIN with anyone. If you did not request this PIN, contact support immediately.'
                        }
                    </div>
                    
                    <p>${isItalian
                        ? 'Grazie per aver scelto Service Hub Portal!'
                        : 'Thank you for choosing Service Hub Portal!'
                    }</p>
                </div>
                
                <div class="footer">
                    <p>${isItalian ? 'Personale autorizzato solo. Tutti gli accessi sono monitorati.' : 'Authorized personnel only. All access is monitored.'}</p>
                    <p>© 2024 Mobisat - Service Hub Portal</p>
                </div>
            </div>
        </body>
        </html>
        `;
    }

    /**
     * Generate plain text email body
     */
    generateEmailText(dealerName, pin, language) {
        const isItalian = language === 'it';
        
        return `${isItalian ? 'Service Hub Portal - PIN di Accesso' : 'Service Hub Portal - Access PIN'}

${isItalian ? 'Ciao' : 'Hello'} ${dealerName}!

${isItalian 
    ? 'Hai richiesto un PIN di accesso per il Service Hub Portal. Ecco il tuo PIN:'
    : 'You requested an access PIN for the Service Hub Portal. Here is your PIN:'
}

PIN: ${pin}

${isItalian
    ? 'Usa questo PIN per accedere al tuo account. Il PIN è valido per questa sessione.'
    : 'Use this PIN to access your account. The PIN is valid for this session.'
}

⚠️ SICUREZZA / SECURITY:
${isItalian
    ? 'Non condividere questo PIN con nessuno. Se non hai richiesto questo PIN, contatta immediatamente il supporto.'
    : 'Do not share this PIN with anyone. If you did not request this PIN, contact support immediately.'
}

${isItalian
    ? 'Grazie per aver scelto Service Hub Portal!'
    : 'Thank you for choosing Service Hub Portal!'
}

---
${isItalian ? 'Personale autorizzato solo. Tutti gli accessi sono monitorati.' : 'Authorized personnel only. All access is monitored.'}
© 2024 Mobisat - Service Hub Portal`;
    }

    /**
     * Check if email service is properly configured
     */
    isConfigured() {
        return this.isEnabled;
    }

    /**
     * Get configuration status
     */
    getStatus() {
        return {
            enabled: this.isEnabled,
            region: process.env.AWS_REGION || 'us-east-1',
            fromEmail: this.fromEmail,
            hasCredentials: !!(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY)
        };
    }
}

// Create global instance
const emailService = new EmailService();

// Export for use in other modules
module.exports = {
    EmailService,
    emailService
};

// Make available globally for browser compatibility
if (typeof window !== 'undefined') {
    window.emailService = emailService;
} 