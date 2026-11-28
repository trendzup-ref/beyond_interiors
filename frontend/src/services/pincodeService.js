/**
 * Pincode Availability Service
 * Validates 6-digit Indian PIN codes and checks logistics & installation serviceability.
 * Designed to be swapped seamlessly with an Axios backend API endpoint in the future.
 */

// Configurable sample serviceable database with logistics SLAs
const SERVICEABLE_PINCODES = {
  // National Capital Region (Delhi NCR)
  "110001": { city: "New Delhi", state: "Delhi", estimatedDays: "2-3 Days", whiteGlove: true },
  "110019": { city: "New Delhi", state: "Delhi", estimatedDays: "2-3 Days", whiteGlove: true },
  "110024": { city: "New Delhi", state: "Delhi", estimatedDays: "2-3 Days", whiteGlove: true },
  "122001": { city: "Gurugram", state: "Haryana", estimatedDays: "2-3 Days", whiteGlove: true },
  "122002": { city: "Gurugram", state: "Haryana", estimatedDays: "2-3 Days", whiteGlove: true },
  "201301": { city: "Noida", state: "Uttar Pradesh", estimatedDays: "2-3 Days", whiteGlove: true },
  "201304": { city: "Greater Noida", state: "Uttar Pradesh", estimatedDays: "3-4 Days", whiteGlove: true },

  // Mumbai Metropolitan Region
  "400001": { city: "Mumbai", state: "Maharashtra", estimatedDays: "2-3 Days", whiteGlove: true },
  "400050": { city: "Mumbai", state: "Maharashtra", estimatedDays: "2-3 Days", whiteGlove: true },
  "400053": { city: "Mumbai", state: "Maharashtra", estimatedDays: "2-3 Days", whiteGlove: true },
  "400601": { city: "Thane", state: "Maharashtra", estimatedDays: "3-4 Days", whiteGlove: true },
  "410210": { city: "Navi Mumbai", state: "Maharashtra", estimatedDays: "3-4 Days", whiteGlove: true },
  "411001": { city: "Pune", state: "Maharashtra", estimatedDays: "3-4 Days", whiteGlove: true },

  // Bengaluru
  "560001": { city: "Bengaluru", state: "Karnataka", estimatedDays: "2-4 Days", whiteGlove: true },
  "560034": { city: "Bengaluru", state: "Karnataka", estimatedDays: "2-4 Days", whiteGlove: true },
  "560038": { city: "Bengaluru", state: "Karnataka", estimatedDays: "2-4 Days", whiteGlove: true },
  "560100": { city: "Bengaluru", state: "Karnataka", estimatedDays: "3-4 Days", whiteGlove: true },

  // Hyderabad
  "500001": { city: "Hyderabad", state: "Telangana", estimatedDays: "3-4 Days", whiteGlove: true },
  "500034": { city: "Hyderabad", state: "Telangana", estimatedDays: "3-4 Days", whiteGlove: true },
  "500081": { city: "Hyderabad", state: "Telangana", estimatedDays: "3-4 Days", whiteGlove: true },

  // Chennai
  "600001": { city: "Chennai", state: "Tamil Nadu", estimatedDays: "3-5 Days", whiteGlove: true },
  "600028": { city: "Chennai", state: "Tamil Nadu", estimatedDays: "3-5 Days", whiteGlove: true },

  // Kolkata
  "700001": { city: "Kolkata", state: "West Bengal", estimatedDays: "3-5 Days", whiteGlove: true },
  "700019": { city: "Kolkata", state: "West Bengal", estimatedDays: "3-5 Days", whiteGlove: true },

  // Tier 2 Hubs
  "302001": { city: "Jaipur", state: "Rajasthan", estimatedDays: "3-5 Days", whiteGlove: true },
  "380001": { city: "Ahmedabad", state: "Gujarat", estimatedDays: "3-5 Days", whiteGlove: true },
  "462001": { city: "Bhopal", state: "Madhya Pradesh", estimatedDays: "4-6 Days", whiteGlove: false },
  "226001": { city: "Lucknow", state: "Uttar Pradesh", estimatedDays: "4-6 Days", whiteGlove: true },
  "160017": { city: "Chandigarh", state: "Punjab/UT", estimatedDays: "3-4 Days", whiteGlove: true },
};

export const pincodeService = {
  /**
   * Validate Indian PIN code format: exactly 6 digits, first digit 1-9
   * @param {string} pincode
   * @returns {boolean}
   */
  isValidFormat(pincode) {
    if (!pincode) return false;
    const clean = String(pincode).trim();
    return /^[1-9][0-9]{5}$/.test(clean);
  },

  /**
   * Check delivery & installation availability for a pincode
   * @param {string} pincode
   * @returns {Promise<{ available: boolean, city?: string, state?: string, estimatedDays?: string, whiteGlove?: boolean, message: string }>}
   */
  async checkAvailability(pincode) {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 350));

    const clean = String(pincode || "").trim();

    if (!this.isValidFormat(clean)) {
      return {
        available: false,
        message: "Please enter a valid 6-digit Indian PIN code.",
      };
    }

    const record = SERVICEABLE_PINCODES[clean];

    if (record) {
      return {
        available: true,
        city: record.city,
        state: record.state,
        estimatedDays: record.estimatedDays,
        whiteGlove: record.whiteGlove,
        message: `Delivery available in ${record.estimatedDays} to ${record.city}, ${record.state}.${
          record.whiteGlove ? " Includes white-glove room positioning." : ""
        }`,
      };
    }

    // Dynamic heuristic: Any pin starting with 11, 12, 20, 40, 41, 50, 56, 60, 70 is covered under general standard delivery
    const prefix = clean.substring(0, 2);
    const standardPrefixes = ["11", "12", "14", "16", "20", "22", "30", "38", "40", "41", "45", "50", "56", "60", "70"];
    
    if (standardPrefixes.includes(prefix)) {
      return {
        available: true,
        city: "Urban Zone",
        state: "Metro / Semi-Urban",
        estimatedDays: "4-7 Business Days",
        whiteGlove: true,
        message: "Delivery and certified assembly available within 4-7 business days.",
      };
    }

    return {
      available: false,
      message: `Delivery is currently not available for PIN code ${clean}. We are rapidly expanding our delivery network across India.`,
    };
  },

  /**
   * Return a list of sample serviceable pincodes for demo / suggestions
   */
  getSampleServiceablePincodes() {
    return Object.keys(SERVICEABLE_PINCODES);
  },
};

export default pincodeService;
