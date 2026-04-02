import api from '@/config/api';

export const couponService = {
  checkCoupon: async (code) => {
    // Should return { success: true, data: Coupon, message: ... }
    const response = await api.get(`/coupons/check?code=${code}`);
    return response.data;
  },
  createCoupon: async (coupon) => {
    const response = await api.post('/coupons', coupon);
    return response.data;
  }
};
