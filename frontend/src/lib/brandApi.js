/**
 * Brand API - Quản lý thương hiệu (3NF)
 * 
 * API functions cho Brand collection
 */

import api from './api';

/**
 * Lấy danh sách brands
 * @param {Object} options - Tùy chọn filter
 * @param {boolean} options.activeOnly - Chỉ lấy brands active
 * @param {string} options.search - Tìm kiếm theo tên
 * @returns {Promise<Array>} - Danh sách brands
 */
export async function getBrands(options = {}) {
  const params = new URLSearchParams();
  
  if (options.activeOnly) {
    params.append('active_only', 'true');
  }
  if (options.search) {
    params.append('search', options.search);
  }
  
  const query = params.toString();
  const url = query ? `/api/brands?${query}` : '/api/brands';
  
  const response = await api.get(url);
  return response.data?.brands || [];
}

/**
 * Lấy chi tiết brand theo ID hoặc slug
 * @param {string} idOrSlug - Brand ID hoặc slug
 * @returns {Promise<Object>} - Chi tiết brand
 */
export async function getBrand(idOrSlug) {
  const response = await api.get(`/api/brands/${idOrSlug}`);
  return response.data?.brand || null;
}

/**
 * Tạo brand mới (Admin only)
 * @param {Object} data - Dữ liệu brand
 * @param {string} data.name - Tên brand (bắt buộc)
 * @param {string} data.logo_url - URL logo
 * @param {string} data.description - Mô tả
 * @param {string} data.website - Website URL
 * @returns {Promise<Object>} - Brand đã tạo
 */
export async function createBrand(data) {
  const response = await api.post('/api/brands', data);
  return response.data?.brand || null;
}

/**
 * Cập nhật brand (Admin only)
 * @param {string} id - Brand ID
 * @param {Object} data - Dữ liệu cập nhật
 * @returns {Promise<Object>} - Brand đã cập nhật
 */
export async function updateBrand(id, data) {
  const response = await api.put(`/api/brands/${id}`, data);
  return response.data?.brand || null;
}

/**
 * Xóa brand (Admin only)
 * @param {string} id - Brand ID
 * @returns {Promise<boolean>} - Kết quả xóa
 */
export async function deleteBrand(id) {
  const response = await api.delete(`/api/brands/${id}`);
  return response.data?.ok || false;
}

/**
 * Toggle trạng thái active của brand (Admin only)
 * @param {string} id - Brand ID
 * @returns {Promise<Object>} - Brand đã cập nhật
 */
export async function toggleBrandActive(id) {
  const response = await api.patch(`/api/brands/${id}/toggle-active`);
  return response.data?.brand || null;
}

export default {
  getBrands,
  getBrand,
  createBrand,
  updateBrand,
  deleteBrand,
  toggleBrandActive
};
