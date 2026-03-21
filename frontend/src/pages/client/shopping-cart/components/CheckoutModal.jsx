import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import usePaymentSocket from '../../../hooks/usePaymentSocket';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import { useToast } from '../../../components/ui/ToastProvider';
import { useAuth } from '../../../contexts/AuthContext';
import UserService from '../../../lib/user';
import { getAddresses as getAddressesApi, createAddress as createAddressApi, setDefaultAddress as setDefaultAddressApi } from '../../../lib/addressApi';
import API from '../../../lib/api';
import cart from '../../../lib/cart';

// Helper function to normalize addresses from server format to frontend format
// Similar to the one in AddressBook.jsx
const normalizeServerAddress = (a) => {
  if (!a) return a;
  // server may store fields like fullName, addressLine1, addressLine2, city, state, default, phone, label
  const name = a.fullName || a.full_name || a.name || '';
  const addressLine1 = a.addressLine1 || a.address_line1 || a.address || '';
  const addressLine2 = a.addressLine2 || a.address_line2 || '';
  // try to split addressLine2 into ward/district if possible (we saved 'ward, district' or 'ward / district')
  let ward = '';
  let district = '';
  if (addressLine2) {
    const parts = addressLine2.split(/[,/\\]/).map(s => s.trim()).filter(Boolean);
    ward = parts[0] || '';
    district = parts[1] || '';
  }
  return {
    // use _id as id if present, otherwise generate a temporary id
    id: a._id ? String(a._id) : `temp_${Date.now()}_${Math.random()}`,
    type: a.label || a.type || 'other',
    name,
    phone: a.phone || '',
    address: addressLine1,
    ward,
    district,
      city: a.city || '',
      provinceCode: a.provinceCode || a.province_code || '',
      districtCode: a.districtCode || a.district_code || '',
      wardCode: a.wardCode || a.ward_code || '',
      // district: a.district || a.state || district,
      isDefault: !!(a.default || a.isDefault || a.is_default)
  };
};

const CheckoutModal = ({ isOpen, onClose, cartItems, orderSummary, onPlaceOrder, isLoggedIn: propIsLoggedIn, userData: propUserData }) => {
  const toast = useToast();
  const navigate = useNavigate();
  // Get authentication state from AuthContext (takes priority over props)
  const { isAuthenticated, user, login, register } = useAuth();
  
  // Use context values if available, otherwise fallback to props
  const isLoggedIn = isAuthenticated !== undefined ? isAuthenticated : propIsLoggedIn;
  const userData = user || propUserData;
  
  // Always have 3 steps, but if logged in, auto-skip step 1
  const [step, setStep] = useState(1);
  const [isGuest, setIsGuest] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [saveAddress, setSaveAddress] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    // Guest/Login info
    email: '',
    password: '',
    createAccount: false,
    
    // Shipping info
    fullName: '',
    phone: '',
    address: '',
    provinceCode: '',
    districtCode: '',
    wardCode: '',
    district: '',
    ward: '',
    
    // Payment info
    paymentMethod: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    
    // Additional
    deliveryNotes: '',
    agreeTerms: false
  });
  const [isLoading, setIsLoading] = useState(false);
  
  // location lists (provinces -> districts -> wards)
  const [locations, setLocations] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  // Load saved addresses when user is logged in (not just when modal opens)
  useEffect(() => {
    const fetchUserAddresses = async () => {
      if (isLoggedIn && userData) {
        console.log('[CheckoutModal] Loading addresses for logged-in user:', userData);
        
        try {
          // Prefer the Address collection API
          let userAddresses = [];
          try {
            const addrs = await getAddressesApi();
            const addrList = addrs?.data?.addresses || addrs?.addresses || addrs || [];
            if (Array.isArray(addrList) && addrList.length > 0) {
              userAddresses = addrList.map(a => normalizeServerAddress(a));
              console.log('[CheckoutModal] Normalized addresses from Address API:', userAddresses);
            } else {
              // Fallback to auth/me or userData or UserService
              const response = await API.get('/api/auth/me');
              const user = response?.data?.user || response?.data;
              if (user?.addresses && Array.isArray(user.addresses) && user.addresses.length > 0) {
                userAddresses = user.addresses.map(addr => normalizeServerAddress(addr));
                console.log('[CheckoutModal] Normalized addresses from auth/me fallback:', userAddresses);
              } else if (userData.addresses && Array.isArray(userData.addresses) && userData.addresses.length > 0) {
                userAddresses = userData.addresses.map(addr => normalizeServerAddress(addr));
                console.log('[CheckoutModal] Normalized addresses from userData fallback:', userAddresses);
              } else {
                try {
                  userAddresses = await UserService.getUserAddresses(userData.id);
                  console.log('[CheckoutModal] Fetched addresses from UserService:', userAddresses);
                } catch (serviceError) {
                  console.warn('[CheckoutModal] Failed to get addresses from UserService:', serviceError);
                }
              }
            }
          } catch (eAddrApi) {
            console.warn('[CheckoutModal] Address API fetch failed:', eAddrApi);
            // fallback to auth/me, userData, UserService
            const response = await API.get('/api/auth/me');
            const user = response?.data?.user || response?.data;
            if (user?.addresses && Array.isArray(user.addresses) && user.addresses.length > 0) {
              userAddresses = user.addresses.map(addr => normalizeServerAddress(addr));
              console.log('[CheckoutModal] Normalized addresses from auth/me after Address API error:', userAddresses);
            } else if (userData.addresses && Array.isArray(userData.addresses) && userData.addresses.length > 0) {
              userAddresses = userData.addresses.map(addr => normalizeServerAddress(addr));
              console.log('[CheckoutModal] Normalized addresses from userData after Address API error:', userAddresses);
            } else {
              try {
                userAddresses = await UserService.getUserAddresses(userData.id);
                console.log('[CheckoutModal] Fetched addresses from UserService after Address API error:', userAddresses);
              } catch (serviceError) {
                console.warn('[CheckoutModal] Failed to get addresses from UserService after Address API error:', serviceError);
              }
            }
          }
          
          // Set the saved addresses
          setSavedAddresses(userAddresses);
          console.log('[CheckoutModal] Set savedAddresses:', userAddresses);
          
          // Only set default address when modal opens
          if (isOpen && userAddresses.length > 0) {
            // If there are addresses, set the default one as selected
            const defaultAddress = userAddresses.find(addr => addr.isDefault);
            const addressToUse = defaultAddress || userAddresses[0];
            
            console.log('[CheckoutModal] Using address:', addressToUse);
            setSelectedAddress(addressToUse.id);
            
            // Fill form with address data
            setFormData(prev => ({
              ...prev,
              fullName: addressToUse.name || prev.fullName,
              phone: addressToUse.phone || prev.phone,
              address: addressToUse.address,
              provinceCode: addressToUse.provinceCode || '',
              districtCode: addressToUse.districtCode || '',
              wardCode: addressToUse.wardCode || '',
              district: addressToUse.district || '',
              ward: addressToUse.ward || ''
            }));
          } else if (isOpen) {
            console.log('[CheckoutModal] No addresses available, setting to new');
            setSelectedAddress('new');
          }
        } catch (error) {
          console.error('[CheckoutModal] Error fetching user addresses:', error);
          if (isOpen) {
            toast.push({ message: 'Không thể tải địa chỉ của bạn. Vui lòng thử lại sau.', type: 'error' });
            setSelectedAddress('new');
          }
        }
      }
    };
    
    fetchUserAddresses();
  }, [isLoggedIn, userData, isOpen]);

  // fetch nested provinces/districts/wards once
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        console.log('[CheckoutModal] Fetching locations from provinces.open-api.vn...');
        const res = await fetch('https://provinces.open-api.vn/api/?depth=3');
        const data = await res.json();
        console.log('[CheckoutModal] Locations response:', data);
        if (mounted && Array.isArray(data)) {
          setLocations(data);
          console.log('[CheckoutModal] Set locations:', data);
        }
      } catch (e) {
        console.error('[CheckoutModal] Failed to fetch locations:', e);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // populate districts/wards when formData changes (similar to AddressBook.jsx)
  useEffect(() => {
    if (!locations || locations.length === 0) return;
    
    const fd = formData;
    if (!fd) return;
    
    console.log('[CheckoutModal] Populate useEffect triggered with formData:', fd);
    
    // If we have provinceCode, populate districts
    if (fd.provinceCode) {
      const prov = locations.find(p => String(p.code) === String(fd.provinceCode));
      if (prov) {
        console.log('[CheckoutModal] Found province:', prov.name, 'setting districts');
        setDistricts(prov.districts || []);
        setWards([]);
        
        // If we also have districtCode, populate wards
        if (fd.districtCode) {
          const dist = prov.districts?.find(d => String(d.code) === String(fd.districtCode));
          if (dist) {
            console.log('[CheckoutModal] Found district:', dist.name, 'setting wards');
            setWards(dist.wards || []);
          }
        }
      }
    }
    
    // If no provinceCode but we have city name, try to find and populate
    if (!fd.provinceCode && fd.city) {
      // Try to find by code first (if city is stored as code)
      let prov = locations.find(p => String(p.code) === String(fd.city));
      if (!prov) {
        // Try to find by name
        prov = locations.find(p => p.name === fd.city);
      }
      if (prov) {
        console.log('[CheckoutModal] Found province by city:', prov.name);
        setDistricts(prov.districts || []);
        setWards([]);
        // Update provinceCode
        setFormData(prev => ({ ...prev, provinceCode: String(prov.code) }));
      } else {
        console.log('[CheckoutModal] Could not find province for city:', fd.city);
      }
    }
    
    // If provinceCode exists but no districtCode, try to find district by name
    if (fd.provinceCode && !fd.districtCode && fd.district) {
      const prov = locations.find(p => String(p.code) === String(fd.provinceCode));
      // Try to find by code first
      let dist = prov?.districts?.find(d => String(d.code) === String(fd.district));
      if (!dist) {
        // Try to find by name
        dist = prov?.districts?.find(d => d.name === fd.district);
      }
      if (dist) {
        console.log('[CheckoutModal] Found district by name:', dist.name);
        setWards(dist.wards || []);
        // Update districtCode
        setFormData(prev => ({ ...prev, districtCode: String(dist.code) }));
      } else {
        console.log('[CheckoutModal] Could not find district for:', fd.district);
      }
    }
    
    // If provinceCode and districtCode exist but no wardCode, try to find ward by name
    if (fd.provinceCode && fd.districtCode && !fd.wardCode && fd.ward) {
      const prov = locations.find(p => String(p.code) === String(fd.provinceCode));
      const dist = prov?.districts?.find(d => String(d.code) === String(fd.districtCode));
      // Try to find by code first
      let ward = dist?.wards?.find(w => String(w.code) === String(fd.ward));
      if (!ward) {
        // Try to find by name
        ward = dist?.wards?.find(w => w.name === fd.ward);
      }
      if (ward) {
        console.log('[CheckoutModal] Found ward by name:', ward.name);
        // Update wardCode
        setFormData(prev => ({ ...prev, wardCode: String(ward.code) }));
      } else {
        console.log('[CheckoutModal] Could not find ward for:', fd.ward);
      }
    }
  }, [locations, formData.provinceCode, formData.districtCode, formData.city, formData.district, formData.ward]);

  // Additional useEffect to populate when locations load and we have address data but no codes
  useEffect(() => {
    if (!locations || locations.length === 0) return;
    if (!formData.city && !formData.district && !formData.ward) return;
    if (formData.provinceCode && formData.districtCode && formData.wardCode) return; // Already have codes
    
    console.log('[CheckoutModal] Additional populate triggered with locations loaded');
    
    // Try to populate from names if we don't have codes
    if (!formData.provinceCode && formData.city) {
      let prov = locations.find(p => String(p.code) === String(formData.city));
      if (!prov) {
        prov = locations.find(p => p.name === formData.city);
      }
      if (prov) {
        console.log('[CheckoutModal] Additional: Found province:', prov.name);
        setDistricts(prov.districts || []);
        setWards([]);
        setFormData(prev => ({ ...prev, provinceCode: String(prov.code) }));
      }
    }
  }, [locations]);

  const cities = [
    { value: 'hanoi', label: 'Hà Nội' },
    { value: 'hcm', label: 'TP. Hồ Chí Minh' },
    { value: 'danang', label: 'Đà Nẵng' },
    { value: 'haiphong', label: 'Hải Phòng' },
    { value: 'cantho', label: 'Cần Thơ' }
  ];

  const paymentMethods = [
    { value: 'cod', label: 'Thanh toán khi nhận hàng (COD)', description: 'Thanh toán bằng tiền mặt khi nhận hàng' },
    { value: 'sepay', label: 'Chuyển khoản ngân hàng (QR Code)', description: 'Thanh toán tự động 24/7 qua mã QR (SePay)' }
  ];

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    })?.format(price);
  };

  // SePay Logic
  const { paymentSuccessData } = usePaymentSocket(isLoggedIn ? userData?.id : null);
  const [sepayQrData, setSepayQrData] = useState(null);
  const [waitingForPayment, setWaitingForPayment] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState(null); // Track created order ID for SePay
  
  // Watch for payment success
  useEffect(() => {
    if (paymentSuccessData && waitingForPayment) {
      console.log('Payment success received!', paymentSuccessData);
      setWaitingForPayment(false);
      toast.push({ title: 'Thanh toán thành công', message: 'Đơn hàng của bạn đã được thanh toán', type: 'success' });
      
      // Clear cart after successful payment
      (async () => {
        try {
          await cart.clearCart();
          console.log('Cart cleared after SePay payment');
        } catch (e) {
          console.error('Error clearing cart:', e);
        }
      })();
      
      // Clean up and close modal
      setSepayQrData(null);
      onClose();
      
      // Navigate to order confirmation using the order ID from payment success
      const orderId = paymentSuccessData.orderId || createdOrderId;
      if (orderId) {
        navigate(`/order-confirmation/${orderId}`);
      }
    }
  }, [paymentSuccessData, waitingForPayment, onClose, toast, navigate, createdOrderId]);


  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleProvinceChange = (code) => {
    const province = locations.find(p => String(p.code) === String(code));
    const ds = province?.districts || [];
    setDistricts(ds);
    setWards([]);
    handleInputChange('provinceCode', String(code));
    handleInputChange('district', '');
    handleInputChange('districtCode', '');
    handleInputChange('ward', '');
    handleInputChange('wardCode', '');
  };

  const handleDistrictChange = (code) => {
    const district = districts.find(d => String(d.code) === String(code));
    const ws = district?.wards || [];
    setWards(ws);
    handleInputChange('district', district?.name || '');
    handleInputChange('districtCode', String(code));
    handleInputChange('ward', '');
    handleInputChange('wardCode', '');
  };

  const handleWardChange = (code) => {
    const ward = wards.find(w => String(w.code) === String(code));
    handleInputChange('ward', ward?.name || '');
    handleInputChange('wardCode', String(code));
  };

  /**
   * Validate current step before proceeding
   */
  const validateStep = () => {
    // Reset errors
    setErrors({});
    let newErrors = {};
    let isValid = true;
    
    if (step === 1) {
      // Step 1: Authentication - skip if already logged in
      if (isLoggedIn) {
        return true; // Auto-pass if logged in
      }
      
      // Validate guest/login
      if (!isGuest) {
        // Login validation
        if (!formData.email) {
          newErrors.email = 'Vui lòng nhập email';
          isValid = false;
        } else {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Email không hợp lệ';
            isValid = false;
          }
        }
        
        if (!formData.password) {
          newErrors.password = 'Vui lòng nhập mật khẩu';
          isValid = false;
        }
        
        if (!isValid) {
          toast.push({ title: 'Lỗi', message: 'Vui lòng điền đầy đủ thông tin đăng nhập', type: 'error' });
        }
      } else {
        // Guest checkout validation
        if (!formData.email) {
          newErrors.email = 'Vui lòng nhập email';
          isValid = false;
        } else {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Email không hợp lệ';
            isValid = false;
          }
        }
        
        if (!isValid) {
          toast.push({ title: 'Lỗi', message: 'Vui lòng nhập email hợp lệ để tiếp tục', type: 'error' });
        }
      }
      
      setErrors(newErrors);
      return isValid;
    }
    
    if (step === 2) {
      // Step 2: Shipping Information - must be complete
      if (!formData.fullName || formData.fullName.trim() === '') {
        newErrors.fullName = 'Vui lòng nhập họ tên';
        isValid = false;
      }
      
      if (!formData.phone || formData.phone.trim() === '') {
        newErrors.phone = 'Vui lòng nhập số điện thoại';
        isValid = false;
      } else {
        // Validate phone number (Vietnamese format: 0/+84 + 3/5/7/8/9 + 8 digits)
        const phoneRegex = /^(0|\+84)[3|5|7|8|9][0-9]{8}$/;
        const cleanPhone = formData.phone.replace(/\s/g, '');
        if (!phoneRegex.test(cleanPhone)) {
          newErrors.phone = 'Số điện thoại không hợp lệ (VD: 0912345678)';
          isValid = false;
        }
      }
      
      if (!formData.address || formData.address.trim() === '') {
        newErrors.address = 'Vui lòng nhập địa chỉ';
        isValid = false;
      }
      
      if (!formData.provinceCode || !formData.districtCode || !formData.wardCode) {
        newErrors.location = 'Vui lòng chọn tỉnh, quận/huyện và phường/xã.';
        isValid = false;
      }
      
      if (!isValid) {
        toast.push({ title: 'Lỗi', message: 'Vui lòng điền đầy đủ thông tin giao hàng', type: 'error' });
      }
      
      setErrors(newErrors);
      return isValid;
    }
    
    if (step === 3) {
      // Step 3: Payment Method
      if (!formData.paymentMethod || formData.paymentMethod === '') {
        newErrors.paymentMethod = 'Vui lòng chọn phương thức thanh toán';
        isValid = false;
      }
      
      // If credit card, validate card details
      if (formData.paymentMethod === 'credit') {
        if (!formData.cardNumber || formData.cardNumber.trim() === '') {
          newErrors.cardNumber = 'Vui lòng nhập số thẻ';
          isValid = false;
        } else {
          // Validate card number (basic check: 13-19 digits)
          const cleanCardNumber = formData.cardNumber.replace(/\s/g, '');
          if (!/^\d{13,19}$/.test(cleanCardNumber)) {
            newErrors.cardNumber = 'Số thẻ không hợp lệ (13-19 chữ số)';
            isValid = false;
          }
        }
        
        if (!formData.expiryDate || formData.expiryDate.trim() === '') {
          newErrors.expiryDate = 'Vui lòng nhập ngày hết hạn';
          isValid = false;
        } else {
          // Validate expiry date format (MM/YY)
          if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
            newErrors.expiryDate = 'Ngày hết hạn không hợp lệ (định dạng: MM/YY)';
            isValid = false;
          }
        }
        
        if (!formData.cvv || formData.cvv.trim() === '') {
          newErrors.cvv = 'Vui lòng nhập CVV';
          isValid = false;
        } else {
          // Validate CVV (3-4 digits)
          if (!/^\d{3,4}$/.test(formData.cvv)) {
            newErrors.cvv = 'CVV không hợp lệ (3-4 chữ số)';
            isValid = false;
          }
        }
        
        if (!formData.cardName || formData.cardName.trim() === '') {
          newErrors.cardName = 'Vui lòng nhập tên trên thẻ';
          isValid = false;
        }
      }
      
      if (!formData.agreeTerms) {
        newErrors.agreeTerms = 'Vui lòng đồng ý với điều khoản sử dụng và chính sách bảo mật';
        isValid = false;
      }
      
      if (!isValid) {
        toast.push({ title: 'Lỗi', message: 'Vui lòng điền đầy đủ thông tin thanh toán', type: 'error' });
      }
      
      setErrors(newErrors);
      return isValid;
    }
    
    setErrors(newErrors);
    return isValid;
    
    return true;
  };

  const handleNextStep = async () => {
    // If on step 1 and already logged in, auto-skip to step 2
    if (step === 1 && isLoggedIn) {
      console.log('[CheckoutModal] Skipping step 1, moving to step 2');
      setStep(2);
      return;
    }
    
    // Special handling for step 1 - Authentication
    if (step === 1) {
      if (!isGuest) {
        // Handle login with AuthContext
        const loginSuccess = await handleLogin();
        if (!loginSuccess) return;
      } else {
        // Handle guest checkout with possible registration
        const registerSuccess = await handleRegister();
        if (!registerSuccess) return;
      }
      return; // The handlers above will set the step if successful
    }
    
    // For other steps, validate before moving to next step
    console.log('[CheckoutModal] Validating step', step);
    if (validateStep()) {
      console.log('[CheckoutModal] Validation passed, moving to next step');
      setStep(prev => prev + 1);
    } else {
      console.log('[CheckoutModal] Validation failed, staying on step', step);
    }
  };

  const handlePrevStep = () => {
    // If logged in and on step 2, don't go back to step 1
    if (step === 2 && isLoggedIn) {
      console.log('[CheckoutModal] Cannot go back from step 2 when logged in, closing modal');
      onClose(); // Close modal instead
      return;
    }
    console.log('[CheckoutModal] Going back from step', step, 'to', step - 1);
    setStep(prev => prev - 1);
  };
  
  /**
   * Handle address selection from dropdown
   * 
   * When a user selects an address from the dropdown:
   * - If they select "new address", clear the form fields for address
   * - If they select a saved address, populate the form with that address data
   * 
   * @param {string} addressId - ID of the selected address or 'new' for a new address
   */
  const handleAddressSelect = (addressId) => {
    console.log('[CheckoutModal] Address selected:', addressId);
    setSelectedAddress(addressId);
    
    // Clear any previous errors when selecting an address
    setErrors({});
    
    if (addressId === 'new') {
      // Clear form for new address entry (but keep name and phone from user data)
      console.log('[CheckoutModal] Clearing form for new address');
      setFormData(prev => ({
        ...prev,
        address: '',
        city: '',
        district: '',
        ward: '',
        provinceCode: '',
        districtCode: '',
        wardCode: '',
        saveAddress: true // Enable save checkbox for new addresses
      }));
      toast.push({ message: 'Vui lòng nhập thông tin địa chỉ mới', type: 'info' });
      return;
    }
    
    // Find the selected address from saved addresses
    const selectedAddressData = savedAddresses.find(addr => addr.id === addressId);
    if (selectedAddressData) {
      console.log('[CheckoutModal] Filling form with selected address:', selectedAddressData);
      console.log('[CheckoutModal] Current formData before fill:', formData);
      
      // Fill the form with the selected address
      setFormData(prev => {
        const newFormData = {
          ...prev,
          fullName: selectedAddressData.name || prev.fullName,
          phone: selectedAddressData.phone || prev.phone,
          address: selectedAddressData.address,
          city: selectedAddressData.city || '',
          district: selectedAddressData.district || '',
          ward: selectedAddressData.ward || '',
          // Include codes for future reference
          provinceCode: selectedAddressData.provinceCode || '',
          districtCode: selectedAddressData.districtCode || '',
          wardCode: selectedAddressData.wardCode || '',
          saveAddress: false // Disable save checkbox for existing addresses
        };
        console.log('[CheckoutModal] New formData after fill:', newFormData);
        return newFormData;
      });
      toast.push({ message: 'Đã chọn địa chỉ', type: 'success' });
    } else {
      console.warn('[CheckoutModal] Address not found:', addressId, 'in savedAddresses:', savedAddresses);
      toast.push({ message: 'Không tìm thấy địa chỉ đã chọn', type: 'error' });
    }
  };

  /**
   * Handle login with AuthContext
   */
  const handleLogin = async () => {
    // Validate fields first
    let loginErrors = {};
    let isValid = true;
    
    if (!formData.email) {
      loginErrors.email = 'Vui lòng nhập email';
      isValid = false;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        loginErrors.email = 'Email không hợp lệ';
        isValid = false;
      }
    }
    
    if (!formData.password) {
      loginErrors.password = 'Vui lòng nhập mật khẩu';
      isValid = false;
    }
    
    if (!isValid) {
      setErrors(loginErrors);
      toast.push({ title: 'Lỗi', message: 'Vui lòng điền đầy đủ thông tin đăng nhập', type: 'error' });
      return false;
    }

    setIsLoading(true);
    try {
      const result = await login({
        email: formData.email,
        password: formData.password
      });
      
      if (result.success) {
        toast.push({ title: 'Thành công', message: `Đăng nhập thành công`, type: 'success' });
        // Clear any errors
        setErrors({});
        // Move to shipping step
        setStep(2);
        return true;
      } else {
        setErrors({...loginErrors, auth: result.message || 'Đăng nhập không thành công'});
        toast.push({ title: 'Lỗi', message: result.message || 'Đăng nhập không thành công', type: 'error' });
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors({...loginErrors, auth: 'Đăng nhập thất bại'});
      toast.push({ title: 'Lỗi', message: 'Đăng nhập thất bại', type: 'error' });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle registration with AuthContext
   */
  const handleRegister = async () => {
    // Validate fields first
    let registerErrors = {};
    let isValid = true;
    
    if (!formData.email) {
      registerErrors.email = 'Vui lòng nhập email';
      isValid = false;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        registerErrors.email = 'Email không hợp lệ';
        isValid = false;
      }
    }
    
    if (!isValid) {
      setErrors(registerErrors);
      toast.push({ title: 'Lỗi', message: 'Vui lòng nhập email hợp lệ để tiếp tục', type: 'error' });
      return false;
    }

    // For guest checkout with account creation
    if (formData.createAccount) {
      setIsLoading(true);
      try {
        // Generate a random password or prompt for one
        const tempPassword = Math.random().toString(36).slice(-8);
        
        const result = await register({
          email: formData.email,
          password: tempPassword,
          fullName: formData.fullName || '',
          phone: formData.phone || ''
        });
        
        if (result.success) {
          toast.push({ title: 'Thành công', message: `Tài khoản đã được tạo với email ${formData.email}`, type: 'success' });
          toast.push({ title: 'Thông tin', message: `Mật khẩu tạm thời của bạn: ${tempPassword}`, type: 'info' });
          // Clear errors
          setErrors({});
          setStep(2); // Move to shipping step
          return true;
        } else {
          setErrors({...registerErrors, auth: result.message || 'Đăng ký không thành công'});
          toast.push({ title: 'Lỗi', message: result.message || 'Đăng ký không thành công', type: 'error' });
          return false;
        }
      } catch (error) {
        console.error('Registration error:', error);
        setErrors({...registerErrors, auth: 'Đăng ký thất bại'});
        toast.push({ title: 'Lỗi', message: 'Đăng ký thất bại', type: 'error' });
        return false;
      } finally {
        setIsLoading(false);
      }
    }
    
    // If guest checkout without account creation
    setErrors({});
    setStep(2);
    return true;
  };

  /**
   * Handle order placement
   * 
   * This function:
   * 1. Saves the new address to the user's address book if requested
   * 2. Places the order with all the collected form data
   * 3. Closes the modal upon successful order placement
   * 
   * For logged-in users with a new address and the "save address" option checked,
   * the address will be added to their saved addresses for future use.
   */
  const handlePlaceOrder = async () => {
    // Validate step 3 before placing order
    if (!validateStep()) {
      return;
    }
    
    setIsLoading(true);
    try {
      // 1. SePay Payment
      if (formData.paymentMethod === 'sepay') {
        try {
          console.log('[CheckoutModal] Initializing SePay payment');
          
          // Create Order first (backend needs connection between Order and Payment)
          console.log('[CheckoutModal] Cart items:', JSON.stringify(cartItems, null, 2));
          const orderData = {
            items: cartItems.map(item => {
              // Prioritize product_id over id (id might be cart item id, not product id)
              const productId = item.product_id || item.productId || item.product?._id || item.product?.id || item.id;
              console.log('[CheckoutModal] Item mapping - id:', item.id, 'product_id:', item.product_id, 'using:', productId);
              return {
                product_id: productId,
                quantity: item.quantity,
                price: item.price,
                // Flatten variant attributes for backend
                size: item.selected_variant?.size || null,
                color: item.selected_variant?.color || null,
                variant_name: item.selected_variant ? `${item.selected_variant.size ? `Size: ${item.selected_variant.size}` : ''}${item.selected_variant.size && item.selected_variant.color ? ', ' : ''}${item.selected_variant.color ? `Màu: ${item.selected_variant.color}` : ''}` : null
              };
            }),
            total: orderSummary.total, // Required by backend
            subtotal: orderSummary.subtotal,
            total_amount: orderSummary.total,
            shipping_address: {
              full_name: formData.fullName,
              phone: formData.phone,
              address: formData.address,
              province_code: formData.provinceCode,
              district_code: formData.districtCode,
              ward_code: formData.wardCode,
              city: formData.city || locations.find(p => String(p.code) === String(formData.provinceCode))?.name || '',
              district: formData.district,
              ward: formData.ward
            },
            payment_method: 'sepay',
            shipping_method: 'standard',
            user_id: isLoggedIn ? userData.id : null, 
            guest_info: !isLoggedIn ? {
              email: formData.email,
              name: formData.fullName,
              phone: formData.phone
            } : null,
            email: formData.email,
            notes: formData.deliveryNotes
          };
          // Create order via API
          // Use /api/orders to match server route
          const orderRes = await API.post('/api/orders', orderData);
          if (!orderRes.data || !orderRes.data.success) {
            throw new Error(orderRes.data?.message || 'Không thể tạo đơn hàng');
          }
          
          const createdOrder = orderRes.data.data || orderRes.data.order;
          
          // Call SePay Init
          const sepayRes = await API.post('/api/payment/sepay/init', {
            orderId: createdOrder._id || createdOrder.id
          });
          
          if (sepayRes.data && sepayRes.data.success) {
            setSepayQrData(sepayRes.data.data);
            setCreatedOrderId(createdOrder._id || createdOrder.id); // Save order ID for later navigation
            setWaitingForPayment(true);
            setStep(4); // Move to new QR step
            
            // Should we save address here? Or wait for payment?
            // Let's save address now to be safe, or maybe after payment?
            // Usually safest to save address if order created successfully.
            await saveAddressIfNeeded(); 
            
          } else {
            throw new Error('Không thể tạo mã QR thanh toán');
          }
           
        } catch (error) {
          console.error('[CheckoutModal] SePay Init Error:', error);
          toast.push({ 
            title: 'Lỗi', 
            message: error.message || 'Có lỗi xảy ra khi khởi tạo thanh toán', 
            type: 'error' 
          });
          setIsLoading(false); // Stop loading if error
        }
        // Return here, don't close modal yet
        return;
      }

      // 2. COD or other methods
      await onPlaceOrder(formData);
      
      // Save address if requested
      await saveAddressIfNeeded();
      
      onClose();
    } catch (error) {
      console.error('Order placement failed:', error);
      toast.push({ title: 'Lỗi', message: 'Đặt hàng thất bại. Vui lòng thử lại.', type: 'error' });
    } finally {
      // Only stop loading if we are NOT waiting for payment (SePay)
      if (formData.paymentMethod !== 'sepay') {
        setIsLoading(false);
      }
    }
  };

  const saveAddressIfNeeded = async () => {
    if (isLoggedIn && saveAddress && (selectedAddress === 'new' || selectedAddress === '')) {
      try {
        const newAddressData = {
          fullName: formData.fullName,
          phone: formData.phone,
          addressLine1: formData.address,
          addressLine2: [formData.ward, formData.district].filter(Boolean).join(', '),
          city: formData.city,
          district: formData.district,
          ward: formData.ward,
          provinceCode: formData.provinceCode || '',
          districtCode: formData.districtCode || '',
          wardCode: formData.wardCode || '',
          isDefault: savedAddresses.length === 0
        };
        
        try {
          // Use direct API call instead of missing function
          const createdRes = await API.post('/api/addresses', newAddressData);
          const created = createdRes.data ? (createdRes.data.data || createdRes.data.address || createdRes.data) : null;
          
          const returnedAddress = created?.address || created;
          const normalized = normalizeServerAddress(returnedAddress);
          setSavedAddresses(prev => [...prev, normalized]);
          if (newAddressData.isDefault && normalized?.id) {
             // Set default via API
             await API.put(`/api/addresses/${normalized.id}/default`);
          }
        } catch (apiErr) {
          console.warn('[CheckoutModal] Address API failed, trying UserService fallback', apiErr);
          // Fallback if needed
          if (userData && userData.id) {
             const addedAddress = await UserService.addUserAddress(userData.id, newAddressData);
             setSavedAddresses(prev => [...prev, addedAddress]);
          }
        }
        
        toast.push({ message: 'Địa chỉ đã được lưu', type: 'success' });
      } catch (error) {
        console.error('[CheckoutModal] Error saving address:', error);
      }
    }
  };

  // Auto-skip step 1 if user is already logged in when modal opens
  // Also reset form when modal closes
  useEffect(() => {
    if (isOpen) {
      // Reset errors when opening modal
      setErrors({});
      
      if (isLoggedIn && userData) {
        // Skip authentication step if already logged in
        console.log('[CheckoutModal] User logged in, skipping to step 2. User data:', userData);
        setStep(2);
        
        // Fill form with user data
        setFormData(prev => ({
          ...prev,
          email: userData.email || prev.email,
          fullName: userData.name || userData.fullName || prev.fullName,
          phone: userData.phone || prev.phone
        }));
        
        // If we have saved addresses, set default one
        if (savedAddresses.length > 0) {
          const defaultAddress = savedAddresses.find(addr => addr.isDefault);
          const addressToUse = defaultAddress || savedAddresses[0];
          
          console.log('[CheckoutModal] Using saved address:', addressToUse);
          setSelectedAddress(addressToUse.id);
          
          // Fill form with address data
          setFormData(prev => ({
            ...prev,
            fullName: addressToUse.name || prev.fullName,
            phone: addressToUse.phone || prev.phone,
            address: addressToUse.address,
            provinceCode: addressToUse.provinceCode || '',
            districtCode: addressToUse.districtCode || '',
            wardCode: addressToUse.wardCode || '',
            district: addressToUse.district || '',
            ward: addressToUse.ward || ''
          }));
        } else {
          setSelectedAddress('new');
        }
        
        // Show notification that we're logged in (ONLY ONCE when modal opens)
        toast.push({
          title: 'Đăng nhập',
          message: `Đang thanh toán với tài khoản: ${userData.email || userData.fullName}`,
          type: 'success'
        });
      } else {
        // Start from step 1 if not logged in
        console.log('[CheckoutModal] Not logged in, starting at step 1');
        setStep(1);
        // Reset form for guests
        setFormData({
          email: '',
          password: '',
          createAccount: false,
          fullName: '',
          phone: '',
          address: '',
          city: '',
          district: '',
          ward: '',
          provinceCode: '',
          districtCode: '',
          wardCode: '',
          paymentMethod: '',
          cardNumber: '',
          expiryDate: '',
          cvv: '',
          cardName: '',
          deliveryNotes: '',
          agreeTerms: false
        });
      }
    } else {
      // Reset when modal closes
      setIsGuest(false);
      setSelectedAddress('');
      setSaveAddress(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]); // CHỈ chạy khi modal open/close, KHÔNG phụ thuộc vào isLoggedIn, userData, toast

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-background border border-border rounded-lg shadow-elegant max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold text-foreground">Thanh toán</h2>
            <div className="flex items-center gap-2">
              {[1, 2, 3]?.map((stepNum) => (
                <div key={stepNum} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= stepNum 
                      ? 'bg-accent text-accent-foreground' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {stepNum}
                  </div>
                  {stepNum < 3 && (
                    <div className={`w-8 h-0.5 mx-1 ${
                      step > stepNum ? 'bg-accent' : 'bg-muted'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        {step < 4 && (
        <div className="flex flex-col lg:flex-row max-h-[calc(90vh-80px)]">
          {/* Main Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {/* Step 1: Login/Guest */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Thông tin tài khoản
                  </h3>
                  <p className="text-muted-foreground">
                    Đăng nhập hoặc tiếp tục với tư cách khách
                  </p>
                </div>

                <div className="flex gap-4">
                  <Button
                    variant={!isGuest ? "default" : "outline"}
                    onClick={() => setIsGuest(false)}
                    className="flex-1"
                  >
                    Đăng nhập
                  </Button>
                  <Button
                    variant={isGuest ? "default" : "outline"}
                    onClick={() => setIsGuest(true)}
                    className="flex-1"
                  >
                    Khách hàng
                  </Button>
                </div>

                {!isGuest ? (
                  <div className="space-y-4">
                    <Input
                      label="Email"
                      type="email"
                      value={formData?.email}
                      onChange={(e) => handleInputChange('email', e?.target?.value)}
                      placeholder="Nhập email của bạn"
                      required
                      error={errors.email}
                    />
                    <Input
                      label="Mật khẩu"
                      type="password"
                      value={formData?.password}
                      onChange={(e) => handleInputChange('password', e?.target?.value)}
                      placeholder="Nhập mật khẩu"
                      required
                      error={errors.password}
                    />
                    <div className="text-center">
                      <Button variant="link" size="sm">
                        Quên mật khẩu?
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Input
                      label="Email"
                      type="email"
                      value={formData?.email}
                      onChange={(e) => handleInputChange('email', e?.target?.value)}
                      placeholder="Nhập email để nhận thông tin đơn hàng"
                      required
                      error={errors.email}
                    />
                    <Checkbox
                      label="Tạo tài khoản để theo dõi đơn hàng dễ dàng hơn"
                      checked={formData?.createAccount}
                      onChange={(e) => handleInputChange('createAccount', e?.target?.checked)}
                    />
                  </div>
                )}

                <Button onClick={handleNextStep} fullWidth>
                  Tiếp tục
                </Button>
              </div>
            )}

            {/* Step 2: Shipping Info */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Thông tin giao hàng
                  </h3>
                     {isLoggedIn && userData ? (
                    <div className="mb-3 p-3 bg-accent/10 border border-accent/20 rounded-lg">
                      <p className="text-sm text-foreground">
                        Bạn đang thanh toán với tài khoản: <span className="font-semibold text-accent">{userData.fullName || userData.email}</span>
                      </p>
                      {userData.email && userData.fullName && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Email: {userData.email}
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">
                      Nhập địa chỉ để chúng tôi giao hàng cho bạn
                    </p>
                  )}
                </div>

                  {/* Address Selection for Logged-in Users */}
                {isLoggedIn && (
                  <div className="mb-4">
                    <Select
                      label="Địa chỉ đã lưu"
                      options={[
                        { value: 'new', label: '+ Thêm địa chỉ mới' },
                        ...savedAddresses.map(addr => {
                          // Format address for better readability with line breaks (similar to AddressBook)
                          const isDefault = addr.isDefault ? ' (Mặc định)' : '';
                          const formattedLabel = [
                            `${addr.name}${isDefault}`,
                            addr.phone,
                            `${addr.address}`,
                            `${addr.ward ? addr.ward + ', ' : ''}${addr.district}, ${addr.city}`
                          ].join('\n');
                          
                          return {
                            value: addr.id,
                            label: formattedLabel
                          };
                        })
                      ]}
                      value={selectedAddress}
                      onChange={handleAddressSelect}
                      placeholder="Chọn địa chỉ đã lưu hoặc thêm mới"
                      error={errors.address}
                    />
                    {savedAddresses.length === 0 && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Bạn chưa có địa chỉ nào được lưu. Vui lòng thêm địa chỉ mới.
                      </p>
                    )}
                  </div>
                )}                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Họ và tên *"
                    value={formData?.fullName}
                    onChange={(e) => handleInputChange('fullName', e?.target?.value)}
                    placeholder="Nhập họ và tên"
                    required
                    error={errors.fullName}
                  />
                  <Input
                    label="Số điện thoại *"
                    type="tel"
                    value={formData?.phone}
                    onChange={(e) => handleInputChange('phone', e?.target?.value)}
                    placeholder="0912345678"
                    required
                    error={errors.phone}
                  />
                </div>

                <Input
                  label="Địa chỉ *"
                  value={formData?.address}
                  onChange={(e) => handleInputChange('address', e?.target?.value)}
                  placeholder="Số nhà, tên đường"
                  required
                  error={errors.address}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm mb-1">Tỉnh/Thành phố *</label>
                    <div className="text-xs text-gray-500 mb-1">{formData.city ? `Bạn đã chọn: ${formData.city}` : 'Chưa chọn tỉnh'}</div>
                    <select className="w-full px-4 py-3 border border-border rounded-md" value={formData?.provinceCode || ''} onChange={(e) => handleProvinceChange(e?.target?.value)} required>
                      <option value="">Chọn tỉnh/thành phố</option>
                      {locations?.map(loc => <option key={loc.code} value={loc.code}>{loc.name}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm mb-1">Quận/Huyện *</label>
                    <div className="text-xs text-gray-500 mb-1">{formData.district ? `Bạn đã chọn: ${formData.district}` : 'Chưa chọn quận/huyện'}</div>
                    <select className="w-full px-4 py-3 border border-border rounded-md" value={formData?.districtCode || ''} onChange={(e) => handleDistrictChange(e?.target?.value)} required>
                      <option value="">Chọn quận/huyện</option>
                      {districts?.map(d => <option key={d.code} value={d.code}>{d.name}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm mb-1">Phường/Xã *</label>
                    <div className="text-xs text-gray-500 mb-1">{formData.ward ? `Bạn đã chọn: ${formData.ward}` : 'Chưa chọn phường/xã'}</div>
                    <select className="w-full px-4 py-3 border border-border rounded-md" value={formData?.wardCode || ''} onChange={(e) => handleWardChange(e?.target?.value)} required>
                      <option value="">Chọn phường/xã</option>
                      {wards?.map(w => <option key={w.code} value={w.code}>{w.name}</option>)}
                    </select>
                  </div>

                  {/* Live preview of selected location */}
                  <div className="md:col-span-3">
                    <div className="mt-2 p-3 bg-white border border-border rounded-md text-sm">
                      <strong>Bạn đã chọn:</strong>
                      <div className="mt-1 text-foreground">
                        {formData?.city || '—'}{formData?.district ? ` / ${formData?.district}` : ''}{formData?.ward ? ` / ${formData?.ward}` : ''}
                      </div>
                      {errors.location && <div className="text-sm text-error mt-2">{errors.location}</div>}
                    </div>
                  </div>
                </div>

                <Input
                  label="Ghi chú giao hàng (tùy chọn)"
                  value={formData?.deliveryNotes}
                  onChange={(e) => handleInputChange('deliveryNotes', e?.target?.value)}
                  placeholder="Ví dụ: Giao hàng giờ hành chính"
                />
                
                {/* Option to save address for logged-in users */}
                {isLoggedIn && (selectedAddress === 'new' || selectedAddress === '') && (
                  <Checkbox
                    label="Lưu địa chỉ này vào sổ địa chỉ sau khi đặt hàng thành công"
                    checked={saveAddress}
                    onChange={(e) => setSaveAddress(e?.target?.checked)}
                  />
                )}

                <div className="flex gap-4">
                  {/* Hide "Quay lại" button if user is logged in (no step 1 to go back to) */}
                  {!isLoggedIn && (
                    <Button variant="outline" onClick={handlePrevStep} className="flex-1">
                      Quay lại
                    </Button>
                  )}
                  <Button onClick={handleNextStep} className={isLoggedIn ? 'w-full' : 'flex-1'}>
                    Tiếp tục
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Payment */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Phương thức thanh toán
                  </h3>
                  <p className="text-muted-foreground">
                    Chọn cách thức thanh toán phù hợp với bạn
                  </p>
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-medium">Phương thức thanh toán <span className="text-red-500">*</span></label>
                  
                  {paymentMethods.map((method) => (
                    <div 
                      key={method.value}
                      className={`border p-4 rounded-md cursor-pointer transition-all ${
                        formData.paymentMethod === method.value 
                          ? 'border-primary bg-primary/5' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleInputChange('paymentMethod', method.value)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                            formData.paymentMethod === method.value ? 'bg-primary' : 'border border-gray-400'
                          }`}>
                            {formData.paymentMethod === method.value && (
                              <div className="w-2 h-2 rounded-full bg-white"></div>
                            )}
                          </div>
                          <div>
                            <div className="font-medium">{method.label}</div>
                            <div className="text-sm text-muted-foreground">{method.description}</div>
                          </div>
                        </div>
                        <div>
                          {method.value === 'cod' && <Icon name="cash" className="w-6 h-6" />}
                          {method.value === 'vnpay' && <img src="/assets/images/vnpay-logo.png" alt="VNPay" className="h-6" />}
                        </div>
                      </div>
                    </div>
                  ))}
                  {errors.paymentMethod && (
                    <p className="text-sm text-red-500 mt-1">{errors.paymentMethod}</p>
                  )}
                </div>



                <Checkbox
                  label="Tôi đồng ý với điều khoản sử dụng và chính sách bảo mật"
                  checked={formData?.agreeTerms}
                  onChange={(e) => handleInputChange('agreeTerms', e?.target?.checked)}
                  required
                />

                <div className="flex gap-4">
                  <Button variant="outline" onClick={handlePrevStep} className="flex-1">
                    Quay lại
                  </Button>
                  <Button 
                    onClick={handlePlaceOrder} 
                    className="flex-1"
                    disabled={!formData?.agreeTerms || isLoading}
                    loading={isLoading}
                  >
                    Đặt hàng
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:w-80 bg-muted/30 border-l border-border p-6 overflow-y-auto">
            <h4 className="font-semibold text-foreground mb-4">Đơn hàng của bạn</h4>
            
            <div className="space-y-3 mb-6">
              {cartItems?.slice(0, 3)?.map((item) => (
                <div key={item?.id} className="flex gap-3">
                  <div className="w-12 h-12 rounded bg-background overflow-hidden flex-shrink-0">
                    <img src={item?.image} alt={item?.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground line-clamp-1">{item?.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item?.color} • Size {item?.size} • SL: {item?.quantity}
                    </p>
                    <p className="text-sm font-medium text-accent">{formatPrice(item?.price * item?.quantity)}</p>
                  </div>
                </div>
              ))}
              {cartItems?.length > 3 && (
                <p className="text-xs text-muted-foreground text-center">
                  +{cartItems?.length - 3} sản phẩm khác
                </p>
              )}
            </div>

            <div className="space-y-2 text-sm border-t border-border pt-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tạm tính</span>
                <span className="text-foreground">{formatPrice(orderSummary?.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Vận chuyển</span>
                <span className="text-foreground">
                  {orderSummary?.shipping === 0 ? 'Miễn phí' : formatPrice(orderSummary?.shipping)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Thuế</span>
                <span className="text-foreground">{formatPrice(orderSummary?.tax)}</span>
              </div>
              {orderSummary?.discount > 0 && (
                <div className="flex justify-between">
                  <span className="text-success">Giảm giá</span>
                  <span className="text-success">-{formatPrice(orderSummary?.discount)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg pt-4 border-t border-border mt-4">
                <span>Tổng cộng</span>
                <span className="text-secondary">{formatPrice(orderSummary.total)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* STEP 4: SEPAY QR CODE */}
      {step === 4 && sepayQrData && (
        <div className="flex flex-col items-center justify-center py-6">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-secondary mb-2">Quét mã QR để thanh toán</h3>
            <p className="text-muted-foreground">
              Vui lòng sử dụng ứng dụng ngân hàng để quét mã QR bên dưới.<br/>
              Hệ thống sẽ tự động xác nhận sau khi bạn chuyển khoản thành công.
            </p>
          </div>
          
          <div className="bg-white p-4 rounded-xl shadow-lg border border-border mb-6">
            <img 
              src={sepayQrData.qrUrl} 
              alt="QR Code thanh toán" 
              className="w-64 h-64 object-contain"
            />
          </div>
          
          <div className="w-full bg-accent/5 p-4 rounded-lg mb-6 text-sm">
             <div className="flex justify-between mb-2 pb-2 border-b border-accent/10">
               <span className="text-muted-foreground">Ngân hàng:</span>
               <span className="font-semibold">{sepayQrData.bankCode}</span>
             </div>
             <div className="flex justify-between mb-2 pb-2 border-b border-accent/10">
               <span className="text-muted-foreground">Số tài khoản:</span>
               <span className="font-semibold">{sepayQrData.accountNumber}</span>
             </div>
             <div className="flex justify-between mb-2 pb-2 border-b border-accent/10">
               <span className="text-muted-foreground">Chủ tài khoản:</span>
               <span className="font-semibold">{sepayQrData.accountName}</span>
             </div>
             <div className="flex justify-between mb-2 pb-2 border-b border-accent/10">
               <span className="text-muted-foreground">Số tiền:</span>
               <span className="font-semibold text-secondary">{formatPrice(orderSummary.total)}</span>
             </div>
             <div className="flex justify-between">
               <span className="text-muted-foreground">Nội dung CK:</span>
               <span className="font-bold text-accent">{sepayQrData.description}</span>
             </div>
          </div>

          <div className="flex items-center gap-2 text-yellow-600 bg-yellow-50 px-4 py-3 rounded-lg w-full mb-6">
            <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full flex-shrink-0"></div>
            <span className="text-sm font-medium">Đang chờ thanh toán...</span>
          </div>
          
          <div className="flex justify-center w-full">
             <Button
               variant="outline"
               onClick={() => {
                 // Allow user to close manually if needed, but warn them
                 if(window.confirm('Bạn có chắc muốn đóng? Đơn hàng đã được tạo nhưng chưa thanh toán.')) {
                   onClose();
                 }
               }}
               className="w-full sm:w-auto"
             >
               Đóng cửa sổ này
             </Button>
          </div>
        </div>
      )}

      {/* FOOTER ACTIONS - Hide in Step 4 */}
      {step !== 4 && (
        <div className="p-6 border-t border-border bg-gray-50 flex justify-between items-center rounded-b-2xl">
          {step > 1 && (
            <Button 
              variant="outline" 
              onClick={handlePrevStep}
              className="px-6"
            >
              Quay lại
            </Button>
          )}
          
          <div className="ml-auto flex items-center gap-4">
             {/* Only show 'Next' or 'Finish' buttons here */}
             {step < 3 ? (
               <Button 
                 onClick={handleNextStep}
                 className="px-8 bg-secondary hover:bg-secondary/90 text-white shadow-lg shadow-secondary/20"
               >
                 Tiếp tục
               </Button>
             ) : (
               <Button 
                 onClick={handlePlaceOrder}
                 disabled={isLoading}
                 className="px-8 bg-accent hover:bg-accent/90 text-white shadow-lg shadow-accent/20 min-w-[140px]"
               >
                 {isLoading ? (
                   <span className="flex items-center gap-2">
                     <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                     Đang xử lý...
                   </span>
                 ) : (
                   'Đặt hàng'
                 )}
               </Button>
             )}
          </div>
        </div>
      )}
    </div>
  </div>
  );
};

export default CheckoutModal;
