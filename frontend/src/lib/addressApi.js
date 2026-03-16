/**
 * Address API - Quản lý địa chỉ người dùng (3NF)
 * 
 * API functions cho Address collection
 */

import api from './api';

/**
 * Lấy danh sách địa chỉ của user hiện tại
 * @returns {Promise<Array>} - Danh sách địa chỉ
 */
export async function getAddresses() {
  const response = await api.get('/api/addresses');
  return response.data?.addresses || [];
}

/**
 * Lấy địa chỉ mặc định
 * @returns {Promise<Object|null>} - Địa chỉ mặc định hoặc null
 */
export async function getDefaultAddress() {
  const response = await api.get('/api/addresses/default');
  return response.data?.address || null;
}

/**
 * Lấy chi tiết địa chỉ theo ID
 * @param {string} id - Address ID
 * @returns {Promise<Object>} - Chi tiết địa chỉ
 */
export async function getAddress(id) {
  const response = await api.get(`/api/addresses/${id}`);
  return response.data?.address || null;
}

/**
 * Tạo địa chỉ mới
 * @param {Object} data - Dữ liệu địa chỉ
 * @param {string} data.label - Nhãn (VD: "Nhà", "Công ty")
 * @param {string} data.full_name - Họ tên người nhận (bắt buộc)
 * @param {string} data.phone - Số điện thoại (bắt buộc)
 * @param {string} data.address_line1 - Địa chỉ chi tiết (bắt buộc)
 * @param {string} data.address_line2 - Địa chỉ bổ sung
 * @param {string} data.ward - Phường/Xã
 * @param {string} data.district - Quận/Huyện (bắt buộc)
 * @param {string} data.city - Tỉnh/Thành phố (bắt buộc)
 * @param {string} data.postal_code - Mã bưu điện
 * @param {boolean} data.is_default - Đặt làm mặc định
 * @returns {Promise<Object>} - Địa chỉ đã tạo
 */
export async function createAddress(data) {
  const response = await api.post('/api/addresses', data);
  return response.data?.address || null;
}

/**
 * Cập nhật địa chỉ
 * @param {string} id - Address ID
 * @param {Object} data - Dữ liệu cập nhật
 * @returns {Promise<Object>} - Địa chỉ đã cập nhật
 */
export async function updateAddress(id, data) {
  const response = await api.put(`/api/addresses/${id}`, data);
  return response.data?.address || null;
}

/**
 * Xóa địa chỉ
 * @param {string} id - Address ID
 * @returns {Promise<boolean>} - Kết quả xóa
 */
export async function deleteAddress(id) {
  const response = await api.delete(`/api/addresses/${id}`);
  return response.data?.ok || false;
}

/**
 * Đặt địa chỉ làm mặc định
 * @param {string} id - Address ID
 * @returns {Promise<Object>} - Địa chỉ đã cập nhật
 */
export async function setDefaultAddress(id) {
  const response = await api.patch(`/api/addresses/${id}/set-default`);
  return response.data?.address || null;
}

/**
 * Format địa chỉ thành chuỗi đầy đủ
 * @param {Object} address - Đối tượng địa chỉ
 * @returns {string} - Chuỗi địa chỉ đầy đủ
 */
export function formatAddress(address) {
  if (!address) return '';
  
  const parts = [
    address.address_line1,
    address.address_line2,
    address.ward,
    address.district,
    address.city,
    address.country
  ].filter(Boolean);
  
  return parts.join(', ');
}

/**
 * Format địa chỉ ngắn gọn (chỉ district, city)
 * @param {Object} address - Đối tượng địa chỉ
 * @returns {string} - Chuỗi địa chỉ ngắn
 */
export function formatShortAddress(address) {
  if (!address) return '';
  
  const parts = [address.district, address.city].filter(Boolean);
  return parts.join(', ');
}

export default {
  getAddresses,
  getDefaultAddress,
  getAddress,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  formatAddress,
  formatShortAddress
};
