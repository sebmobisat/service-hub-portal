/**
 * FMB003 Parameter Mapping - Official Teltonika Specifications
 * Model ID: 7
 * Based on: https://wiki.teltonika-gps.com/view/FMB003_Teltonika_Data_Sending_Parameters_ID
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

class FMB003Mapping {
    constructor() {
        this.parameters = new Map([
            // === OBD ELEMENTS ===
            [30, { name: "Number of DTC", bytes: 1, type: "Unsigned", min: 0, max: 255, unit: "-", multiplier: 1, description: "Number of diagnostic trouble codes", category: "obd", convert: (val) => val }],
            [31, { name: "Engine Load", bytes: 1, type: "Unsigned", min: 0, max: 100, unit: "%", multiplier: 1, description: "Calculated engine load value", category: "obd", convert: (val) => val }],
            [32, { name: "Coolant Temperature", bytes: 1, type: "Signed", min: -128, max: 127, unit: "°C", multiplier: 1, description: "Engine coolant temperature", category: "obd", convert: (val) => val }],
            [33, { name: "Short Fuel Trim", bytes: 1, type: "Signed", min: -100, max: 99, unit: "%", multiplier: 1, description: "Short term fuel trim 1", category: "obd", convert: (val) => val }],
            [34, { name: "Fuel Pressure", bytes: 2, type: "Unsigned", min: 0, max: 765, unit: "kPa", multiplier: 1, description: "Fuel pressure", category: "obd", convert: (val) => val }],
            [35, { name: "Intake MAP", bytes: 1, type: "Unsigned", min: 0, max: 255, unit: "kPa", multiplier: 1, description: "Intake manifold absolute pressure", category: "obd", convert: (val) => val }],
            [36, { name: "Engine RPM", bytes: 2, type: "Unsigned", min: 0, max: 16384, unit: "rpm", multiplier: 1, description: "Engine RPM", category: "obd", convert: (val) => val }],
            [37, { name: "Vehicle Speed", bytes: 1, type: "Unsigned", min: 0, max: 255, unit: "km/h", multiplier: 1, description: "Vehicle speed", category: "obd", convert: (val) => val }],
            [38, { name: "Timing Advance", bytes: 1, type: "Signed", min: -64, max: 64, unit: "°", multiplier: 1, description: "Timing advance", category: "obd", convert: (val) => val }],
            [39, { name: "Intake Air Temperature", bytes: 1, type: "Signed", min: -128, max: 127, unit: "°C", multiplier: 1, description: "Intake air temperature", category: "obd", convert: (val) => val }],
            [40, { name: "MAF", bytes: 2, type: "Unsigned", min: 0, max: 65535, unit: "g/sec", multiplier: 0.01, description: "MAF air flow rate", category: "obd", convert: (val) => val * 0.01 }],
            [41, { name: "Throttle Position", bytes: 1, type: "Unsigned", min: 0, max: 100, unit: "%", multiplier: 1, description: "Throttle position", category: "obd", convert: (val) => val }],
            [42, { name: "Runtime Since Engine Start", bytes: 2, type: "Unsigned", min: 0, max: 65535, unit: "s", multiplier: 1, description: "Runtime since engine start", category: "obd", convert: (val) => val }],
            [43, { name: "Distance Traveled MIL On", bytes: 2, type: "Unsigned", min: 0, max: 65535, unit: "km", multiplier: 1, description: "Distance traveled with MIL on", category: "obd", convert: (val) => val }],
            [44, { name: "Relative Fuel Rail Pressure", bytes: 2, type: "Unsigned", min: 0, max: 5178, unit: "kPa", multiplier: 0.1, description: "Relative fuel rail pressure", category: "obd", convert: (val) => val * 0.1 }],
            [45, { name: "Direct Fuel Rail Pressure", bytes: 2, type: "Unsigned", min: 0, max: 65535, unit: "kPa", multiplier: 10, description: "Direct fuel rail pressure", category: "obd", convert: (val) => val * 10 }],
            [46, { name: "Commanded EGR", bytes: 1, type: "Unsigned", min: 0, max: 100, unit: "%", multiplier: 1, description: "Commanded EGR", category: "obd", convert: (val) => val }],
            [47, { name: "EGR Error", bytes: 1, type: "Signed", min: -100, max: 100, unit: "%", multiplier: 1, description: "EGR error", category: "obd", convert: (val) => val }],
            [48, { name: "Fuel Level", bytes: 1, type: "Unsigned", min: 0, max: 100, unit: "%", multiplier: 1, description: "Fuel level", category: "obd", convert: (val) => val }],
            [49, { name: "Distance Since Codes Clear", bytes: 2, type: "Unsigned", min: 0, max: 65535, unit: "km", multiplier: 1, description: "Distance traveled since codes cleared", category: "obd", convert: (val) => val }],
            [50, { name: "Barometric Pressure", bytes: 1, type: "Unsigned", min: 0, max: 255, unit: "kPa", multiplier: 1, description: "Barometric pressure", category: "obd", convert: (val) => val }],
            [51, { name: "Control Module Voltage", bytes: 2, type: "Unsigned", min: 0, max: 65535, unit: "V", multiplier: 0.001, description: "Control module voltage", category: "obd", convert: (val) => val * 0.001 }],
            [52, { name: "Absolute Load Value", bytes: 2, type: "Unsigned", min: 0, max: 25700, unit: "%", multiplier: 1, description: "Absolute load value", category: "obd", convert: (val) => val }],

            // === PERMANENT I/O ELEMENTS ===
            [239, { name: "Ignition", bytes: 1, type: "Unsigned", min: 0, max: 1, unit: "-", multiplier: 1, description: "0 – Ignition Off, 1 – Ignition On", category: "permanent", convert: (val) => val }],
            [240, { name: "Movement", bytes: 1, type: "Unsigned", min: 0, max: 1, unit: "-", multiplier: 1, description: "0 – Movement Off, 1 – Movement On", category: "permanent", convert: (val) => val }],
            [80, { name: "Data Mode", bytes: 1, type: "Unsigned", min: 0, max: 3, unit: "-", multiplier: 1, description: "GSM/GNSS/Accelerometer data mode", category: "permanent", convert: (val) => val }],
            [21, { name: "GSM Signal", bytes: 1, type: "Unsigned", min: 0, max: 5, unit: "-", multiplier: 1, description: "GSM signal strength", category: "permanent", convert: (val) => val }],
            [200, { name: "Sleep Mode", bytes: 1, type: "Unsigned", min: 0, max: 4, unit: "-", multiplier: 1, description: "Sleep mode status", category: "permanent", convert: (val) => val }],
            [69, { name: "GNSS Status", bytes: 1, type: "Unsigned", min: 0, max: 3, unit: "-", multiplier: 1, description: "GNSS status", category: "permanent", convert: (val) => val }],
            [181, { name: "GNSS PDOP", bytes: 2, type: "Unsigned", min: 0, max: 65535, unit: "-", multiplier: 0.1, description: "GNSS Position Dilution of Precision", category: "permanent", convert: (val) => val * 0.1 }],
            [182, { name: "GNSS HDOP", bytes: 2, type: "Unsigned", min: 0, max: 65535, unit: "-", multiplier: 0.1, description: "GNSS Horizontal Dilution of Precision", category: "permanent", convert: (val) => val * 0.1 }],
            [66, { name: "External Voltage", bytes: 2, type: "Unsigned", min: 0, max: 65535, unit: "mV", multiplier: 1, description: "External voltage", category: "permanent", convert: (val) => val }],
            [67, { name: "Battery Voltage", bytes: 2, type: "Unsigned", min: 0, max: 65535, unit: "mV", multiplier: 1, description: "Battery voltage", category: "permanent", convert: (val) => val }],
            [68, { name: "Battery Current", bytes: 2, type: "Signed", min: -32768, max: 32767, unit: "mA", multiplier: 1, description: "Battery current", category: "permanent", convert: (val) => val }],

            // === EVENTUAL I/O ELEMENTS ===
            [1, { name: "Digital Input 1", bytes: 1, type: "Unsigned", min: 0, max: 1, unit: "-", multiplier: 1, description: "Digital input 1 status", category: "eventual", convert: (val) => val }],
            [179, { name: "Digital Output 1", bytes: 1, type: "Unsigned", min: 0, max: 1, unit: "-", multiplier: 1, description: "Digital output 1 status", category: "eventual", convert: (val) => val }],
            [180, { name: "Digital Output 2", bytes: 1, type: "Unsigned", min: 0, max: 1, unit: "-", multiplier: 1, description: "Digital output 2 status", category: "eventual", convert: (val) => val }],
            [113, { name: "Battery Level", bytes: 1, type: "Unsigned", min: 0, max: 100, unit: "%", multiplier: 1, description: "Battery level percentage", category: "eventual", convert: (val) => val }],
            [199, { name: "Trip Distance", bytes: 4, type: "Unsigned", min: 0, max: 0xFFFFFFFF, unit: "m", multiplier: 1, description: "Trip distance", category: "eventual", convert: (val) => val }],
            [16, { name: "Total Odometer", bytes: 4, type: "Unsigned", min: 0, max: 0xFFFFFFFF, unit: "m", multiplier: 1, description: "Total distance traveled", category: "eventual", convert: (val) => val }],
            [17, { name: "Axis X", bytes: 2, type: "Signed", min: -32768, max: 32767, unit: "mg", multiplier: 1, description: "Accelerometer X axis", category: "eventual", convert: (val) => val }],
            [18, { name: "Axis Y", bytes: 2, type: "Signed", min: -32768, max: 32767, unit: "mg", multiplier: 1, description: "Accelerometer Y axis", category: "eventual", convert: (val) => val }],
            [19, { name: "Axis Z", bytes: 2, type: "Signed", min: -32768, max: 32767, unit: "mg", multiplier: 1, description: "Accelerometer Z axis", category: "eventual", convert: (val) => val }],

            // === CAN ADAPTER ELEMENTS ===
            [256, { name: "VIN", bytes: 17, type: "ASCII", min: 0, max: 0xFF, unit: "-", multiplier: 1, description: "VIN number", category: "can", convert: (val) => val }],
            [1116, { name: "LVCAN MaxRoadSpeed", bytes: 1, type: "Unsigned", min: 0, max: 255, unit: "km/h", multiplier: 1, description: "Maximum speed from road signs", category: "can", convert: (val) => val }],
            [1117, { name: "LVCAN ExceededRoadSpeed", bytes: 1, type: "Unsigned", min: 0, max: 255, unit: "km/h", multiplier: 1, description: "Exceeded speed from road signs", category: "can", convert: (val) => val }]
        ]);
    }

    /**
     * Get parameter definition by ID
     * @param {number} id - Parameter ID
     * @returns {Object|null} Parameter definition or null if not found
     */
    getParameter(id) {
        return this.parameters.get(parseInt(id)) || null;
    }

    /**
     * Get converted value with proper units
     * @param {number} id - Parameter ID
     * @param {number} rawValue - Raw value from device
     * @returns {Object} Converted value with metadata
     */
    getConvertedValue(id, rawValue) {
        const param = this.getParameter(id);
        if (!param) {
            return {
                id: id,
                rawValue: rawValue,
                convertedValue: rawValue,
                unit: '-',
                name: `Unknown Parameter ${id}`,
                error: 'Parameter not found in FMB003 mapping'
            };
        }

        try {
            const convertedValue = param.convert(rawValue);
            return {
                id: id,
                rawValue: rawValue,
                convertedValue: convertedValue,
                unit: param.unit,
                name: param.name,
                category: param.category,
                description: param.description,
                isValid: this.isValueInRange(rawValue, param),
                range: `${param.min} - ${param.max}`
            };
        } catch (error) {
            return {
                id: id,
                rawValue: rawValue,
                convertedValue: rawValue,
                unit: param.unit,
                name: param.name,
                error: `Conversion error: ${error.message}`
            };
        }
    }

    /**
     * Check if value is within valid range
     * @param {number} value - Value to check
     * @param {Object} param - Parameter definition
     * @returns {boolean} True if value is valid
     */
    isValueInRange(value, param) {
        return value >= param.min && value <= param.max;
    }

    /**
     * Get all OBD parameters
     * @returns {Array} Array of OBD parameter definitions
     */
    getOBDParameters() {
        return Array.from(this.parameters.entries())
            .filter(([id, param]) => param.category === 'obd')
            .map(([id, param]) => ({ id, ...param }));
    }

    /**
     * Get parameters by category
     * @param {string} category - Category (obd, permanent, eventual, can)
     * @returns {Array} Array of parameter definitions
     */
    getParametersByCategory(category) {
        return Array.from(this.parameters.entries())
            .filter(([id, param]) => param.category === category)
            .map(([id, param]) => ({ id, ...param }));
    }

    /**
     * Extract and convert all parameters from elements object
     * @param {Object} elements - Elements object from device data
     * @returns {Object} Converted parameters grouped by category
     */
    extractAllParameters(elements) {
        const result = {
            obd: {},
            permanent: {},
            eventual: {},
            can: {},
            unknown: {}
        };

        for (const [fieldId, rawValue] of Object.entries(elements)) {
            const converted = this.getConvertedValue(fieldId, rawValue);
            const category = converted.category || 'unknown';
            result[category][fieldId] = converted;
        }

        return result;
    }

    /**
     * Get specific OBD values for common parameters
     * @param {Object} elements - Elements object from device data
     * @returns {Object} Common OBD parameters with converted values
     */
    getCommonOBDValues(elements) {
        const commonParams = {
            engineRPM: this.getConvertedValue(36, elements['36']),
            engineLoad: this.getConvertedValue(31, elements['31']),
            coolantTemp: this.getConvertedValue(32, elements['32']),
            throttlePosition: this.getConvertedValue(41, elements['41']),
            fuelLevel: this.getConvertedValue(48, elements['48']),
            intakeAirTemp: this.getConvertedValue(39, elements['39']),
            vehicleSpeed: this.getConvertedValue(37, elements['37']),
            controlModuleVoltage: this.getConvertedValue(51, elements['51']),
            maf: this.getConvertedValue(40, elements['40']),
            fuelPressure: this.getConvertedValue(34, elements['34']),
            ignition: this.getConvertedValue(239, elements['239']),
            movement: this.getConvertedValue(240, elements['240'])
        };

        // Filter out parameters that don't have data
        const filtered = {};
        for (const [key, param] of Object.entries(commonParams)) {
            if (param.rawValue !== undefined && param.rawValue !== null) {
                filtered[key] = param;
            }
        }

        return filtered;
    }

    /**
     * Generate parameter summary
     * @returns {Object} Summary of available parameters
     */
    getSummary() {
        const categories = {
            obd: 0,
            permanent: 0,
            eventual: 0,
            can: 0
        };

        for (const param of this.parameters.values()) {
            categories[param.category]++;
        }

        return {
            totalParameters: this.parameters.size,
            categories: categories,
            model: 'FMB003',
            modelId: 7,
            documentationUrl: 'https://wiki.teltonika-gps.com/view/FMB003_Teltonika_Data_Sending_Parameters_ID'
        };
    }
}

// Export for Node.js and Browser
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FMB003Mapping;
} else if (typeof window !== 'undefined') {
    window.FMB003Mapping = FMB003Mapping;
}