/**
 * Vehicle Image Service
 * Fetches vehicle images from multiple sources with smart fallback system
 * Enhanced with performance optimizations
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

class VehicleImageService {
    constructor() {
        this.cache = new Map();
        this.loadingCache = new Map(); // Track ongoing downloads
        this.batchQueue = [];
        this.batchTimeout = null;
        
        this.fallbackImages = {
            // Generic vehicle silhouettes by type
            'sedan': '/images/vehicles/fallbacks/sedan.svg',
            'suv': '/images/vehicles/fallbacks/suv.svg',
            'hatchback': '/images/vehicles/fallbacks/sedan.svg',
            'coupe': '/images/vehicles/fallbacks/sedan.svg',
            'truck': '/images/vehicles/fallbacks/suv.svg',
            'van': '/images/vehicles/fallbacks/suv.svg',
            'convertible': '/images/vehicles/fallbacks/sedan.svg',
            'default': '/images/vehicles/fallbacks/default.svg'
        };
        
        // Brand-specific fallbacks
        this.brandLogos = {
            'audi': '/images/vehicles/brands/audi.svg',
            'bmw': '/images/vehicles/brands/bmw.svg',
            'mercedes': '/images/vehicles/brands/mercedes.svg',
            'volkswagen': '/images/vehicles/brands/volkswagen.svg',
            'ford': '/images/vehicles/brands/ford.svg',
            'toyota': '/images/vehicles/brands/toyota.svg',
            'honda': '/images/vehicles/brands/honda.svg',
            'nissan': '/images/vehicles/brands/nissan.svg',
            'hyundai': '/images/vehicles/brands/hyundai.svg',
            'kia': '/images/vehicles/brands/kia.svg',
            'peugeot': '/images/vehicles/brands/peugeot.svg',
            'renault': '/images/vehicles/brands/renault.svg',
            'fiat': '/images/vehicles/brands/fiat.svg',
            'seat': '/images/vehicles/brands/seat.svg',
            'skoda': '/images/vehicles/brands/skoda.svg',
            'opel': '/images/vehicles/brands/opel.svg',
            'tesla': '/images/vehicles/brands/tesla.svg'
        };

        // Performance settings
        this.settings = {
            quickTimeout: 1000,      // 1 second for fast sources
            standardTimeout: 2000,   // 2 seconds for APIs
            maxConcurrent: 6,        // Max concurrent downloads
            batchDelay: 100          // Batch multiple requests
        };
    }

    /**
     * Get vehicle image with smart fallback system and performance optimizations
     * @param {Object} vehicle - Vehicle data
     * @param {boolean} priorityLoad - Whether this is a priority load
     * @returns {Promise<string>} - Image URL
     */
    async getVehicleImage(vehicle, priorityLoad = false) {
        const { brand, model, year, type, fuelType } = vehicle;
        
        // Create cache key
        const cacheKey = `${brand}-${model}-${year}`.toLowerCase();
        
        // Check cache first
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        // Check if already loading to prevent duplicate requests
        if (this.loadingCache.has(cacheKey)) {
            return this.loadingCache.get(cacheKey);
        }

        // Create loading promise
        const loadingPromise = this.loadImageWithFallbacks(vehicle, cacheKey, priorityLoad);
        this.loadingCache.set(cacheKey, loadingPromise);

        try {
            const result = await loadingPromise;
            this.cache.set(cacheKey, result);
            return result;
        } finally {
            // Clean up loading cache
            this.loadingCache.delete(cacheKey);
        }
    }

    /**
     * Load image with performance-optimized fallback chain
     */
    async loadImageWithFallbacks(vehicle, cacheKey, priorityLoad) {
        const { brand, model, year, type, fuelType } = vehicle;

        try {
            // Fast path: Try immediate sources first (local + brand logos)
            let imageUrl = await this.tryFastSources(brand, model, year);
            if (imageUrl) return imageUrl;

            // Skip slow sources if not priority load
            if (!priorityLoad) {
                return this.getFallbackImage(model, type, fuelType, brand);
            }

            // Slow path: Try external sources with reduced timeouts
            imageUrl = await this.trySlowSources(brand, model, year);
            if (imageUrl) return imageUrl;

            // Final fallback
            return this.getFallbackImage(model, type, fuelType, brand);

        } catch (error) {
            console.warn(`Image loading error for ${cacheKey}:`, error);
            return this.getFallbackImage(model, type, fuelType, brand);
        }
    }

    /**
     * Try fast sources (local images + brand logos)
     */
    async tryFastSources(brand, model, year) {
        // 1. Try local curated images (very fast)
        const localImage = await this.tryLocalImage(brand, model, year, this.settings.quickTimeout);
        if (localImage) return localImage;

        // 2. Try brand logo (fast)
        const brandKey = brand.toLowerCase();
        if (this.brandLogos[brandKey]) {
            if (await this.imageExists(this.brandLogos[brandKey], this.settings.quickTimeout)) {
                return this.brandLogos[brandKey];
            }
        }

        return null;
    }

    /**
     * Try slow sources (APIs and web search)
     */
    async trySlowSources(brand, model, year) {
        // Only try these for priority loads or specific requests
        const sources = [
            () => this.tryAutomotiveAPI(brand, model, year),
            () => this.tryImageSearch(brand, model, year)
        ];

        for (const source of sources) {
            try {
                const result = await Promise.race([
                    source(),
                    new Promise((_, reject) => 
                        setTimeout(() => reject(new Error('Timeout')), this.settings.standardTimeout)
                    )
                ]);
                if (result) return result;
            } catch (error) {
                // Continue to next source
                continue;
            }
        }

        return null;
    }

    /**
     * Get appropriate fallback image
     */
    getFallbackImage(model, type, fuelType, brand) {
        // Try brand logo first
        const brandKey = brand.toLowerCase();
        if (this.brandLogos[brandKey]) {
            return this.brandLogos[brandKey];
        }

        // Fall back to vehicle type
        const vehicleType = this.detectVehicleType(model, type, fuelType);
        return this.fallbackImages[vehicleType] || this.fallbackImages.default;
    }

    /**
     * Batch load multiple images efficiently
     */
    async batchLoadImages(vehicles, maxConcurrent = 6) {
        console.time('Batch image loading');
        
        const results = new Map();
        const chunks = [];
        
        // Split into chunks for concurrent processing
        for (let i = 0; i < vehicles.length; i += maxConcurrent) {
            chunks.push(vehicles.slice(i, i + maxConcurrent));
        }

        for (const chunk of chunks) {
            const promises = chunk.map(async (vehicle) => {
                const cacheKey = `${vehicle.brand}-${vehicle.model}-${vehicle.year}`.toLowerCase();
                try {
                    const imageUrl = await this.getVehicleImage(vehicle, false); // Non-priority
                    results.set(cacheKey, imageUrl);
                } catch (error) {
                    console.warn(`Failed to load image for ${cacheKey}:`, error);
                    results.set(cacheKey, this.fallbackImages.default);
                }
            });

            await Promise.all(promises);
            
            // Small delay between chunks to prevent overwhelming
            await new Promise(resolve => setTimeout(resolve, 50));
        }

        console.timeEnd('Batch image loading');
        return results;
    }

    /**
     * Preload images for common vehicles
     */
    async preloadCommonVehicles() {
        const commonVehicles = [
            { brand: 'seat', model: 'leon', year: '2025' },
            { brand: 'tesla', model: 'model', year: '3' },
            // Add more common vehicles from your database
        ];

        console.log('Preloading common vehicle images...');
        await this.batchLoadImages(commonVehicles, 3);
        console.log('Common vehicle images preloaded');
    }

    /**
     * Try to load local curated image with timeout
     */
    async tryLocalImage(brand, model, year, timeout = 1000) {
        const variations = [
            `/images/vehicles/${brand}/${model}/${year}.svg`,
            `/images/vehicles/${brand}/${model}/generic.svg`,
            `/images/vehicles/${brand}/generic.svg`
        ];

        for (const url of variations) {
            if (await this.imageExists(url, timeout)) {
                return url;
            }
        }
        return null;
    }

    /**
     * Try automotive API (placeholder for real API integration)
     */
    async tryAutomotiveAPI(brand, model, year) {
        // This would integrate with services like:
        // - Edmunds API
        // - AutoAPI
        // - CarQuery API
        // - VehicleInfo API
        
        try {
            // Example API call structure (commented out as we don't have real API keys)
            /*
            const response = await fetch(`https://api.edmunds.com/api/vehicle/v2/${brand}/${model}/${year}/photo?fmt=json&api_key=YOUR_API_KEY`);
            if (response.ok) {
                const data = await response.json();
                return data.photo?.photoSrcs?.[0]?.photoSrcUrl;
            }
            */
            
            // For now, return null to continue to next fallback
            return null;
        } catch (error) {
            console.error('Automotive API error:', error);
            return null;
        }
    }

    /**
     * Try web image search (using placeholder service)
     */
    async tryImageSearch(brand, model, year) {
        try {
            // This could integrate with:
            // - Google Custom Search API
            // - Bing Image Search API
            // - Unsplash API with car categories
            
            // For demo purposes, we'll use a placeholder service
            const query = `${brand} ${model} ${year} car`;
            const placeholderUrl = `https://source.unsplash.com/800x600/?${encodeURIComponent(query)}`;
            
            // Check if the placeholder service responds
            if (await this.imageExists(placeholderUrl, this.settings.standardTimeout)) {
                return placeholderUrl;
            }
            
            return null;
        } catch (error) {
            console.error('Image search error:', error);
            return null;
        }
    }

    /**
     * Detect vehicle type from model name and other data
     */
    detectVehicleType(model, type, fuelType) {
        if (type) return type.toLowerCase();
        
        const modelLower = model.toLowerCase();
        
        // SUV keywords
        if (modelLower.includes('suv') || modelLower.includes('x5') || modelLower.includes('q7') || 
            modelLower.includes('cayenne') || modelLower.includes('range')) {
            return 'suv';
        }
        
        // Truck keywords  
        if (modelLower.includes('truck') || modelLower.includes('pickup') || modelLower.includes('f-150')) {
            return 'truck';
        }
        
        // Van keywords
        if (modelLower.includes('van') || modelLower.includes('transit') || modelLower.includes('sprinter')) {
            return 'van';
        }
        
        // Coupe keywords
        if (modelLower.includes('coupe') || modelLower.includes('convertible') || modelLower.includes('cabrio')) {
            return 'coupe';
        }
        
        // Hatchback keywords
        if (modelLower.includes('hatch') || modelLower.includes('golf') || modelLower.includes('polo')) {
            return 'hatchback';
        }
        
        // Default to sedan
        return 'sedan';
    }

    /**
     * Check if image exists and is loadable with timeout
     */
    async imageExists(url, timeout = 1000) {
        return new Promise((resolve) => {
            const img = new Image();
            let resolved = false;
            
            const cleanup = () => {
                if (!resolved) {
                    resolved = true;
                    img.onload = null;
                    img.onerror = null;
                }
            };
            
            img.onload = () => {
                cleanup();
                resolve(true);
            };
            
            img.onerror = () => {
                cleanup();
                resolve(false);
            };
            
            // Set timeout
            setTimeout(() => {
                if (!resolved) {
                    cleanup();
                    resolve(false);
                }
            }, timeout);
            
            img.src = url;
        });
    }

    /**
     * Preload commonly used images
     */
    async preloadFallbacks() {
        const fallbackUrls = [
            ...Object.values(this.fallbackImages),
            ...Object.values(this.brandLogos)
        ];

        const preloadPromises = fallbackUrls.map(url => {
            return new Promise((resolve) => {
                const img = new Image();
                img.onload = () => resolve(true);
                img.onerror = () => resolve(false);
                img.src = url;
                // Don't wait too long for fallbacks
                setTimeout(() => resolve(false), 2000);
            });
        });

        const results = await Promise.allSettled(preloadPromises);
        const loaded = results.filter(r => r.status === 'fulfilled' && r.value).length;
        console.log(`Preloaded ${loaded}/${fallbackUrls.length} fallback images`);
    }

    /**
     * Get performance statistics
     */
    getPerformanceStats() {
        return {
            cacheSize: this.cache.size,
            loadingCount: this.loadingCache.size,
            settings: this.settings
        };
    }

    /**
     * Clear cache
     */
    clearCache() {
        this.cache.clear();
        this.loadingCache.clear();
    }

    /**
     * Get cache size
     */
    getCacheSize() {
        return this.cache.size;
    }
}

// Create global instance
window.vehicleImageService = new VehicleImageService();

// Preload fallback images and common vehicles
window.vehicleImageService.preloadFallbacks().then(() => {
    // Optionally preload common vehicles after fallbacks are loaded
    // window.vehicleImageService.preloadCommonVehicles();
}); 