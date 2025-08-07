/**
 * IP Geolocation Service
 * Service Hub Portal - IP-based geolocation and phone number formatting
 * 
 * Provides IP-based location detection and automatic phone number formatting
 * for international users with localized placeholders and validation.
 */

class IPGeolocationService {
    constructor() {
        this.cache = new Map();
        this.userLocation = null;
        this.countryData = this.loadCountryData();
    }

    /**
     * Load country data with phone formatting info
     */
    loadCountryData() {
        return {
            'IT': {
                code: 'IT',
                name: 'Italy',
                dialCode: '+39',
                placeholder: '+39 333 123 4567',
                format: '+39 ### ### ####',
                regex: /^(\+39\s?)?(\d{3}\s?\d{3}\s?\d{4})$/
            },
            'US': {
                code: 'US',
                name: 'United States',
                dialCode: '+1',
                placeholder: '+1 (555) 123-4567',
                format: '+1 (###) ###-####',
                regex: /^(\+1\s?)?\(?\d{3}\)?\s?-?\d{3}\s?-?\d{4}$/
            },
            'GB': {
                code: 'GB',
                name: 'United Kingdom',
                dialCode: '+44',
                placeholder: '+44 20 1234 5678',
                format: '+44 ## #### ####',
                regex: /^(\+44\s?)?\d{2}\s?\d{4}\s?\d{4}$/
            },
            'FR': {
                code: 'FR',
                name: 'France',
                dialCode: '+33',
                placeholder: '+33 1 23 45 67 89',
                format: '+33 # ## ## ## ##',
                regex: /^(\+33\s?)?\d{1}\s?\d{2}\s?\d{2}\s?\d{2}\s?\d{2}$/
            },
            'DE': {
                code: 'DE',
                name: 'Germany',
                dialCode: '+49',
                placeholder: '+49 30 12345678',
                format: '+49 ## ########',
                regex: /^(\+49\s?)?\d{2}\s?\d{8}$/
            },
            'ES': {
                code: 'ES',
                name: 'Spain',
                dialCode: '+34',
                placeholder: '+34 612 34 56 78',
                format: '+34 ### ## ## ##',
                regex: /^(\+34\s?)?\d{3}\s?\d{2}\s?\d{2}\s?\d{2}$/
            }
        };
    }

    /**
     * Get user location based on IP
     */
    async getUserLocation() {
        // Check cache first
        if (this.userLocation) {
            return this.userLocation;
        }

        try {
            // Try multiple IP geolocation services
            const services = [
                'https://ipapi.co/json/',
                'https://ip-api.com/json/',
                'https://ipinfo.io/json'
            ];

            for (const service of services) {
                try {
                    const response = await fetch(service, {
                        timeout: 5000,
                        headers: {
                            'Accept': 'application/json'
                        }
                    });

                    if (response.ok) {
                        const data = await response.json();
                        this.userLocation = this.parseLocationData(data, service);
                        
                        if (this.userLocation) {
                            console.log('🌍 User location detected:', this.userLocation);
                            return this.userLocation;
                        }
                    }
                } catch (error) {
                    console.warn(`IP service ${service} failed:`, error.message);
                    continue;
                }
            }

            // Fallback to default (Italy)
            this.userLocation = {
                country: 'IT',
                countryName: 'Italy',
                timezone: 'Europe/Rome',
                source: 'fallback'
            };

            console.log('🌍 Using fallback location:', this.userLocation);
            return this.userLocation;

        } catch (error) {
            console.error('❌ IP geolocation failed:', error);
            
            // Return fallback
            this.userLocation = {
                country: 'IT',
                countryName: 'Italy',
                timezone: 'Europe/Rome',
                source: 'error_fallback'
            };
            
            return this.userLocation;
        }
    }

    /**
     * Parse location data from different services
     */
    parseLocationData(data, service) {
        try {
            let country, countryName, timezone;

            if (service.includes('ipapi.co')) {
                country = data.country_code;
                countryName = data.country_name;
                timezone = data.timezone;
            } else if (service.includes('ip-api.com')) {
                country = data.countryCode;
                countryName = data.country;
                timezone = data.timezone;
            } else if (service.includes('ipinfo.io')) {
                country = data.country;
                countryName = data.country;
                timezone = data.timezone;
            }

            if (country && countryName) {
                return {
                    country: country.toUpperCase(),
                    countryName,
                    timezone,
                    source: service,
                    raw: data
                };
            }

            return null;
        } catch (error) {
            console.warn('Failed to parse location data:', error);
            return null;
        }
    }

    /**
     * Get phone placeholder based on user location
     */
    async getPhonePlaceholder() {
        const location = await this.getUserLocation();
        
        if (location && this.countryData[location.country]) {
            return this.countryData[location.country].placeholder;
        }

        // Default to Italian format
        return this.countryData['IT'].placeholder;
    }

    /**
     * Get phone format for user's country
     */
    async getPhoneFormat() {
        const location = await this.getUserLocation();
        
        if (location && this.countryData[location.country]) {
            return this.countryData[location.country].format;
        }

        return this.countryData['IT'].format;
    }

    /**
     * Validate phone number based on user location
     */
    async validatePhoneNumber(phone) {
        if (!phone || typeof phone !== 'string') {
            return false;
        }

        const cleanPhone = phone.trim();
        if (cleanPhone.length < 8) {
            return false;
        }

        const location = await this.getUserLocation();
        
        if (location && this.countryData[location.country]) {
            const countryInfo = this.countryData[location.country];
            return countryInfo.regex.test(cleanPhone);
        }

        // Default validation (Italian format)
        return this.countryData['IT'].regex.test(cleanPhone);
    }

    /**
     * Format phone number based on user location
     */
    async formatPhoneNumber(phone) {
        if (!phone) return '';

        const location = await this.getUserLocation();
        const cleanPhone = phone.replace(/\D/g, '');

        if (location && this.countryData[location.country]) {
            const countryInfo = this.countryData[location.country];
            return this.applyPhoneFormat(cleanPhone, countryInfo);
        }

        // Default formatting (Italian)
        return this.applyPhoneFormat(cleanPhone, this.countryData['IT']);
    }

    /**
     * Apply phone format to number
     */
    applyPhoneFormat(cleanPhone, countryInfo) {
        if (!cleanPhone) return '';

        // Remove country code if present
        const dialCodeDigits = countryInfo.dialCode.replace(/\D/g, '');
        let phoneDigits = cleanPhone;
        
        if (phoneDigits.startsWith(dialCodeDigits)) {
            phoneDigits = phoneDigits.substring(dialCodeDigits.length);
        }

        // Apply formatting based on country
        switch (countryInfo.code) {
            case 'IT':
                if (phoneDigits.length >= 10) {
                    return `${countryInfo.dialCode} ${phoneDigits.substring(0, 3)} ${phoneDigits.substring(3, 6)} ${phoneDigits.substring(6, 10)}`;
                }
                break;
            case 'US':
                if (phoneDigits.length >= 10) {
                    return `${countryInfo.dialCode} (${phoneDigits.substring(0, 3)}) ${phoneDigits.substring(3, 6)}-${phoneDigits.substring(6, 10)}`;
                }
                break;
            case 'GB':
                if (phoneDigits.length >= 10) {
                    return `${countryInfo.dialCode} ${phoneDigits.substring(0, 2)} ${phoneDigits.substring(2, 6)} ${phoneDigits.substring(6, 10)}`;
                }
                break;
            case 'FR':
                if (phoneDigits.length >= 9) {
                    return `${countryInfo.dialCode} ${phoneDigits.substring(0, 1)} ${phoneDigits.substring(1, 3)} ${phoneDigits.substring(3, 5)} ${phoneDigits.substring(5, 7)} ${phoneDigits.substring(7, 9)}`;
                }
                break;
            case 'DE':
                if (phoneDigits.length >= 10) {
                    return `${countryInfo.dialCode} ${phoneDigits.substring(0, 2)} ${phoneDigits.substring(2)}`;
                }
                break;
            case 'ES':
                if (phoneDigits.length >= 9) {
                    return `${countryInfo.dialCode} ${phoneDigits.substring(0, 3)} ${phoneDigits.substring(3, 5)} ${phoneDigits.substring(5, 7)} ${phoneDigits.substring(7, 9)}`;
                }
                break;
        }

        // If formatting fails, return with dial code
        return `${countryInfo.dialCode} ${phoneDigits}`;
    }

    /**
     * Get timezone information
     */
    async getTimezone() {
        const location = await this.getUserLocation();
        
        if (location && location.timezone) {
            return location.timezone;
        }

        return 'Europe/Rome'; // Default
    }

    /**
     * Get country information
     */
    async getCountryInfo() {
        const location = await this.getUserLocation();
        
        if (location && this.countryData[location.country]) {
            return {
                ...this.countryData[location.country],
                detected: location
            };
        }

        return {
            ...this.countryData['IT'],
            detected: location
        };
    }

    /**
     * Clear cache (useful for testing)
     */
    clearCache() {
        this.cache.clear();
        this.userLocation = null;
    }
}

// Create global instance
window.ipGeoService = new IPGeolocationService();

// Export for modules if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = IPGeolocationService;
}

console.log('🌍 IP Geolocation Service initialized');


