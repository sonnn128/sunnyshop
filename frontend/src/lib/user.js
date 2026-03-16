import API from './api';

/**
 * Service for user-related API calls
 */
const UserService = {
  /**
   * Get user addresses from API or localStorage (for demo)
   * @param {string} userId - The user ID to get addresses for
   * @returns {Promise<Array>} - The user's addresses
   */
  getUserAddresses: async (userId) => {
    try {
      // First try to get user profile with addresses from API
      try {
        const response = await API.get(`/api/users/profile`);
        if (response.data && response.data.addresses && Array.isArray(response.data.addresses)) {
          console.log('[UserService] Fetched user addresses from API:', response.data.addresses);
          
          // Map the API response to our frontend format
          return response.data.addresses.map(addr => ({
            id: addr._id?.$oid || addr._id || `addr-${Math.random().toString(36).substr(2, 9)}`,
            fullName: addr.fullName,
            phone: addr.phone,
            address: addr.addressLine1 + (addr.addressLine2 ? `, ${addr.addressLine2}` : ''),
            city: mapCityFromAddress(addr.city), // Map city string to our city value
            district: addr.state || '',
            ward: addr.addressLine2?.split(',')?.[0] || '',
            isDefault: addr.default === true
          }));
        }
      } catch (apiError) {
        console.warn('[UserService] API call failed, using localStorage fallback:', apiError);
      }
      
      // If API call fails or returns no addresses, fallback to localStorage
      const addresses = JSON.parse(localStorage.getItem(`user_${userId}_addresses`) || '[]');
      
      // If no addresses and we're in demo mode, create some demo addresses
      if (addresses.length === 0) {
        const demoAddresses = [
          {
            id: `addr-${userId}-1`,
            fullName: 'Nguyễn Anh Tuấn',
            phone: '0354293110',
            address: 'Thôn Trung Lập, Xã Vũ Hội',
            city: 'hanoi', // Mapping this for frontend selection
            district: 'Huyện Vũ Thư',
            ward: 'Xã Vũ Hội',
            isDefault: true
          }
        ];
        localStorage.setItem(`user_${userId}_addresses`, JSON.stringify(demoAddresses));
        return demoAddresses;
      }
      
      return addresses;
    } catch (error) {
      console.error('[UserService] Error fetching addresses:', error);
      return [];
    }
  },
  
  // Helper function to map city names to city values
  mapCityFromAddress(cityName) {
    const cityMappings = {
      'Tỉnh Thái Bình': 'hanoi', // Nearest major city in dropdown
      'Hà Nội': 'hanoi',
      'TP. Hồ Chí Minh': 'hcm',
      'Thành phố Hồ Chí Minh': 'hcm',
      'Đà Nẵng': 'danang',
      'Hải Phòng': 'haiphong',
      'Cần Thơ': 'cantho'
    };
    
    return cityMappings[cityName] || 'hanoi'; // Default to Hanoi if no match
  },
  
  /**
   * Add a new address for a user
   * @param {string} userId - The user ID
   * @param {Object} address - The address to add
   * @returns {Promise<Object>} - The added address with ID
   */
  addUserAddress: async (userId, address) => {
    try {
      // Format address for API
      const apiAddressFormat = {
        label: address.label || 'home',
        fullName: address.fullName,
        phone: address.phone,
        addressLine1: address.address,
        addressLine2: `${address.ward}, ${address.district}`,
        city: getCityName(address.city),
        state: address.district,
        postalCode: '',
        country: 'VN',
        default: address.isDefault
      };
      
      // Try to add address via API first
      try {
        const response = await API.post(`/api/users/addresses`, apiAddressFormat);
        if (response.data && response.data.addresses) {
          // Return the newly added address in our frontend format
          const addedAddress = response.data.addresses[response.data.addresses.length - 1];
          return {
            id: addedAddress._id?.$oid || addedAddress._id || `addr-${userId}-${Date.now()}`,
            fullName: addedAddress.fullName,
            phone: addedAddress.phone,
            address: addedAddress.addressLine1,
            city: UserService.mapCityFromAddress(addedAddress.city),
            district: addedAddress.state || address.district,
            ward: address.ward,
            isDefault: addedAddress.default === true
          };
        }
      } catch (apiError) {
        console.warn('[UserService] API add address failed, using localStorage fallback:', apiError);
      }
      
      // Fallback to localStorage if API fails
      const addresses = await UserService.getUserAddresses(userId);
      const newAddress = {
        ...address,
        id: `addr-${userId}-${Date.now()}`,
      };
      
      // If this is the first address, make it default
      if (addresses.length === 0) {
        newAddress.isDefault = true;
      }
      
      // If this is marked as default, remove default from other addresses
      if (newAddress.isDefault) {
        addresses.forEach(addr => {
          addr.isDefault = false;
        });
      }
      
      const updatedAddresses = [...addresses, newAddress];
      localStorage.setItem(`user_${userId}_addresses`, JSON.stringify(updatedAddresses));
      
      return newAddress;
    } catch (error) {
      console.error('[UserService] Error adding address:', error);
      throw error;
    }
  },
  
  // Helper function to convert city code to full name
  getCityName(cityCode) {
    const cityMap = {
      'hanoi': 'Hà Nội',
      'hcm': 'TP. Hồ Chí Minh',
      'danang': 'Đà Nẵng',
      'haiphong': 'Hải Phòng',
      'cantho': 'Cần Thơ'
    };
    
    return cityMap[cityCode] || 'Tỉnh Thái Bình';
  },
  
  /**
   * Update an existing user address
   * @param {string} userId - The user ID
   * @param {string} addressId - The address ID to update
   * @param {Object} addressData - The updated address data
   * @returns {Promise<Object>} - The updated address
   */
  updateUserAddress: async (userId, addressId, addressData) => {
    try {
      // Format address for API
      const apiAddressFormat = {
        _id: addressId,
        label: addressData.label || 'home',
        fullName: addressData.fullName,
        phone: addressData.phone,
        addressLine1: addressData.address,
        addressLine2: `${addressData.ward}, ${addressData.district}`,
        city: UserService.getCityName(addressData.city),
        state: addressData.district,
        postalCode: '',
        country: 'VN',
        default: addressData.isDefault
      };
      
      // Try to update address via API first
      try {
        const response = await API.put(`/api/users/addresses/${addressId}`, apiAddressFormat);
        if (response.data && response.data.addresses) {
          // Return the updated address in our frontend format
          const updatedAddress = response.data.addresses.find(addr => 
            (addr._id?.$oid || addr._id) === addressId);
          
          if (updatedAddress) {
            return {
              id: updatedAddress._id?.$oid || updatedAddress._id,
              fullName: updatedAddress.fullName,
              phone: updatedAddress.phone,
              address: updatedAddress.addressLine1,
              city: UserService.mapCityFromAddress(updatedAddress.city),
              district: updatedAddress.state || addressData.district,
              ward: addressData.ward,
              isDefault: updatedAddress.default === true
            };
          }
        }
      } catch (apiError) {
        console.warn('[UserService] API update address failed, using localStorage fallback:', apiError);
      }
      
      // Fallback to localStorage if API fails
      const addresses = await UserService.getUserAddresses(userId);
      let updatedAddresses = addresses.map(addr => {
        if (addr.id === addressId) {
          return { ...addr, ...addressData };
        }
        // If this address is now default, remove default from others
        if (addressData.isDefault && addr.id !== addressId) {
          return { ...addr, isDefault: false };
        }
        return addr;
      });
      
      localStorage.setItem(`user_${userId}_addresses`, JSON.stringify(updatedAddresses));
      return updatedAddresses.find(addr => addr.id === addressId);
    } catch (error) {
      console.error('[UserService] Error updating address:', error);
      throw error;
    }
  },
  
  /**
   * Set an address as default
   * @param {string} userId - The user ID
   * @param {string} addressId - The address ID to set as default
   * @returns {Promise<boolean>} - Success status
   */
  setDefaultAddress: async (userId, addressId) => {
    try {
      // Try API first
      try {
        const response = await API.put(`/api/users/addresses/${addressId}/default`);
        if (response.data && response.data.success) {
          return true;
        }
      } catch (apiError) {
        console.warn('[UserService] API set default address failed, using localStorage fallback:', apiError);
      }
      
      // Fallback to localStorage
      const addresses = await UserService.getUserAddresses(userId);
      const updatedAddresses = addresses.map(addr => ({
        ...addr,
        isDefault: addr.id === addressId
      }));
      
      localStorage.setItem(`user_${userId}_addresses`, JSON.stringify(updatedAddresses));
      return true;
    } catch (error) {
      console.error('[UserService] Error setting default address:', error);
      return false;
    }
  },
  
  /**
   * Delete a user address
   * @param {string} userId - The user ID
   * @param {string} addressId - The address ID to delete
   * @returns {Promise<boolean>} - Success status
   */
  deleteAddress: async (userId, addressId) => {
    try {
      // Try API first
      try {
        const response = await API.delete(`/api/users/addresses/${addressId}`);
        if (response.data && response.data.success) {
          return true;
        }
      } catch (apiError) {
        console.warn('[UserService] API delete address failed, using localStorage fallback:', apiError);
      }
      
      // Fallback to localStorage
      const addresses = await UserService.getUserAddresses(userId);
      const updatedAddresses = addresses.filter(addr => addr.id !== addressId);
      
      // If we deleted the default address and there are other addresses,
      // make the first one default
      if (addresses.find(addr => addr.id === addressId)?.isDefault && updatedAddresses.length > 0) {
        updatedAddresses[0].isDefault = true;
      }
      
      localStorage.setItem(`user_${userId}_addresses`, JSON.stringify(updatedAddresses));
      return true;
    } catch (error) {
      console.error('[UserService] Error deleting address:', error);
      return false;
    }
  }
};

export default UserService;