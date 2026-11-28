/**
 * Customer Profile & Address Service
 * Manages customer personal information, delivery addresses, and default address flags.
 * Compatible with backend User model (backend/models/user.js).
 */

const STORAGE_KEY = "beyond_interiors_profile_v1";

const DEFAULT_PROFILE = {
  _id: "usr-aditya-01",
  name: "Aditya Sharma",
  email: "aditya.sharma@example.com",
  phone: "9876543210",
  role: "customer",
  createdAt: "2024-03-15T10:30:00.000Z",
  addresses: [
    {
      _id: "addr-001",
      fullName: "Aditya Sharma",
      phone: "9876543210",
      street: "Villa 14, The Grand Arch, Golf Course Extension Road",
      landmark: "Near Sector 58 Club House",
      city: "Gurugram",
      state: "Haryana",
      pinCode: "122002",
      isDefault: true,
    },
    {
      _id: "addr-002",
      fullName: "Aditya Sharma (Office)",
      phone: "9876543210",
      street: "Level 9, Horizon Two, One Horizon Centre, Golf Course Road",
      landmark: "Opposite DLF Phase 5",
      city: "Gurugram",
      state: "Haryana",
      pinCode: "122002",
      isDefault: false,
    },
  ],
};

const loadProfile = (currentAuthUser = null) => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = currentAuthUser
        ? {
            ...DEFAULT_PROFILE,
            ...currentAuthUser,
            addresses:
              currentAuthUser.addresses?.length > 0
                ? currentAuthUser.addresses
                : DEFAULT_PROFILE.addresses,
          }
        : DEFAULT_PROFILE;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(raw);
    if (currentAuthUser) {
      return {
        ...parsed,
        name: currentAuthUser.name || parsed.name,
        email: currentAuthUser.email || parsed.email,
        phone: currentAuthUser.phone || parsed.phone,
      };
    }
    return parsed;
  } catch (e) {
    console.error("Failed to load profile", e);
    return DEFAULT_PROFILE;
  }
};

const saveProfile = (profile) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error("Failed to save profile", e);
  }
};

export const profileService = {
  /**
   * Get active profile
   */
  async getProfile(currentAuthUser = null) {
    await new Promise((resolve) => setTimeout(resolve, 150));
    return loadProfile(currentAuthUser);
  },

  /**
   * Update personal details (Name, Phone)
   */
  async updateDetails(details) {
    await new Promise((resolve) => setTimeout(resolve, 250));
    const profile = loadProfile();

    if (details.name) profile.name = details.name.trim();
    if (details.phone) profile.phone = details.phone.trim();

    saveProfile(profile);
    return profile;
  },

  /**
   * Add a new delivery address
   */
  async addAddress(addressData) {
    await new Promise((resolve) => setTimeout(resolve, 250));
    const profile = loadProfile();

    const newAddress = {
      _id: `addr-${Date.now()}`,
      fullName: addressData.fullName.trim(),
      phone: addressData.phone.trim(),
      street: addressData.street.trim(),
      landmark: addressData.landmark ? addressData.landmark.trim() : "",
      city: addressData.city.trim(),
      state: addressData.state.trim(),
      pinCode: addressData.pinCode.trim(),
      isDefault: addressData.isDefault || profile.addresses.length === 0,
    };

    if (newAddress.isDefault) {
      profile.addresses = profile.addresses.map((a) => ({ ...a, isDefault: false }));
    }

    profile.addresses.push(newAddress);
    saveProfile(profile);
    return profile;
  },

  /**
   * Update an existing delivery address
   */
  async updateAddress(addressId, addressData) {
    await new Promise((resolve) => setTimeout(resolve, 250));
    const profile = loadProfile();

    const index = profile.addresses.findIndex((a) => a._id === addressId);
    if (index === -1) throw new Error("Address not found");

    if (addressData.isDefault) {
      profile.addresses = profile.addresses.map((a) => ({ ...a, isDefault: false }));
    }

    profile.addresses[index] = {
      ...profile.addresses[index],
      ...addressData,
      fullName: addressData.fullName?.trim() || profile.addresses[index].fullName,
      phone: addressData.phone?.trim() || profile.addresses[index].phone,
      street: addressData.street?.trim() || profile.addresses[index].street,
      city: addressData.city?.trim() || profile.addresses[index].city,
      state: addressData.state?.trim() || profile.addresses[index].state,
      pinCode: addressData.pinCode?.trim() || profile.addresses[index].pinCode,
    };

    saveProfile(profile);
    return profile;
  },

  /**
   * Delete delivery address
   */
  async deleteAddress(addressId) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const profile = loadProfile();

    profile.addresses = profile.addresses.filter((a) => a._id !== addressId);
    // If deleted address was default, make the first one default
    if (profile.addresses.length > 0 && !profile.addresses.some((a) => a.isDefault)) {
      profile.addresses[0].isDefault = true;
    }

    saveProfile(profile);
    return profile;
  },

  /**
   * Set an address as default
   */
  async setDefaultAddress(addressId) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const profile = loadProfile();

    profile.addresses = profile.addresses.map((a) => ({
      ...a,
      isDefault: a._id === addressId,
    }));

    saveProfile(profile);
    return profile;
  },
};

export default profileService;
