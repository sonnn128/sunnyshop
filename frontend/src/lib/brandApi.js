/**
 * Brand API - Quản lý thương hiệu (3NF)
 * 
 * API functions cho Brand collection
 */

import api from './api';

const normalizeBrand = (brand = {}) => ({
  ...brand,
  _id: brand?._id ?? brand?.id,
  id: brand?.id ?? brand?._id,
  logo_url: brand?.logo_url ?? brand?.logoUrl ?? '',
  is_active: brand?.is_active ?? brand?.isActive ?? brand?.active ?? true,
  sort_order: brand?.sort_order ?? brand?.sortOrder ?? 0,
});

const normalizeBrandPayload = (data = {}) => ({
  ...data,
  logo_url: data?.logo_url ?? data?.logoUrl ?? '',
  is_active: data?.is_active ?? data?.isActive ?? true,
  active: data?.is_active ?? data?.isActive ?? true,
  sort_order: data?.sort_order ?? data?.sortOrder ?? 0,
  website: data?.website ?? ''
});

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
  const url = query ? `/brands?${query}` : '/brands';
  
  const response = await api.get(url);
  const brands = response.data?.brands || [];
  return Array.isArray(brands) ? brands.map(normalizeBrand) : [];
}

/**
 * Lấy chi tiết brand theo ID hoặc slug
 * @param {string} idOrSlug - Brand ID hoặc slug
 * @returns {Promise<Object>} - Chi tiết brand
 */
export async function getBrand(idOrSlug) {
  const response = await api.get(`/brands/${idOrSlug}`);
  const brand = response.data?.brand || null;
  return brand ? normalizeBrand(brand) : null;
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
  const response = await api.post('/brands', normalizeBrandPayload(data));
  const brand = response.data?.brand || null;
  return brand ? normalizeBrand(brand) : null;
}

/**
 * Cập nhật brand (Admin only)
 * @param {string} id - Brand ID
 * @param {Object} data - Dữ liệu cập nhật
 * @returns {Promise<Object>} - Brand đã cập nhật
 */
export async function updateBrand(id, data) {
  const response = await api.put(`/brands/${id}`, normalizeBrandPayload(data));
  const brand = response.data?.brand || null;
  return brand ? normalizeBrand(brand) : null;
}

/**
 * Xóa brand (Admin only)
 * @param {string} id - Brand ID
 * @returns {Promise<boolean>} - Kết quả xóa
 */
export async function deleteBrand(id) {
  const response = await api.delete(`/brands/${id}`);
  return response.data?.ok || false;
}

/**
 * Toggle trạng thái active của brand (Admin only)
 * @param {string} id - Brand ID
 * @returns {Promise<Object>} - Brand đã cập nhật
 */
export async function toggleBrandActive(id) {
  const response = await api.patch(`/brands/${id}/toggle-active`);
  const brand = response.data?.brand || null;
  return brand ? normalizeBrand(brand) : null;
}

export default {
  getBrands,
  getBrand,
  createBrand,
  updateBrand,
  deleteBrand,
  toggleBrandActive
};
