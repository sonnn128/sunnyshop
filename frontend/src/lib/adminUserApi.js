import api from './api';

const extractId = (value) => {
  if (!value) return null;
  if (typeof value === 'string') return value;
  if (typeof value === 'object') {
    if (value.$oid) return value.$oid;
    if (value.$id) return value.$id;
    if (value.id) return value.id;
  }
  return String(value);
};

const normalizeUser = (raw = {}) => {
  const id = extractId(raw._id || raw.id || raw.user_id || raw);
  const firstName = raw.firstName || raw.first_name || '';
  const lastName = raw.lastName || raw.last_name || '';
  const fullName = raw.fullName
    || raw.full_name
    || raw.name
    || [firstName, lastName].filter(Boolean).join(' ').trim()
    || raw.username
    || raw.email
    || 'Người dùng';

  const role = (raw.role || raw.userRole || raw.type || 'customer')?.toString().toLowerCase();
  const status = (raw.status
    || (raw.is_active === false ? 'inactive' : null)
    || (raw.active === false ? 'inactive' : null)
    || 'active')?.toString().toLowerCase();

  const avatar = raw.avatar
    || raw.avatar_url
    || raw.profilePicture
    || raw.profile_picture
    || raw.image
    || '';

  const phone = raw.phone
    || raw.phoneNumber
    || raw.phone_number
    || raw.contact_phone
    || '';

  const email = raw.email
    || raw.contactEmail
    || raw.contact_email
    || '';

  const lastLogin = raw.lastLogin
    || raw.last_login
    || raw.lastLoginAt
    || raw.last_login_at
    || raw.last_active_at
    || null;

  const createdAt = raw.createdAt
    || raw.created_at
    || raw.createdDate
    || raw.created_date
    || raw.dateCreated
    || null;

  const updatedAt = raw.updatedAt
    || raw.updated_at
    || raw.updatedDate
    || raw.updated_date
    || null;

  const addressCount = raw.addressCount
    || raw.address_count
    || (Array.isArray(raw.addresses) ? raw.addresses.length : undefined);

  const orderCount = raw.orderCount
    || raw.ordersCount
    || raw.totalOrders
    || raw.order_count
    || 0;

  return {
    id,
    fullName,
    firstName,
    lastName,
    email,
    phone,
    role,
    status,
    avatar,
    lastLogin,
    createdAt,
    updatedAt,
    addressCount: typeof addressCount === 'number' ? addressCount : 0,
    orderCount: typeof orderCount === 'number' ? orderCount : 0,
    raw
  };
};

const toQueryString = (filters = {}) => {
  const params = new URLSearchParams();

  if (filters.page) params.append('page', filters.page);
  if (filters.limit) params.append('limit', filters.limit);
  if (filters.role) params.append('role', filters.role);
  if (filters.status) params.append('status', filters.status);
  if (filters.search) params.append('search', filters.search);
  if (filters.sort) params.append('sort', filters.sort);
  if (filters.email) params.append('email', filters.email);

  return params.toString();
};

const pickList = (response) => {
  const data = response?.data;
  if (!data) return { users: [], pagination: {} };

  const list = data.users
    || data.data?.users
    || data.results
    || data.items
    || data.list
    || (Array.isArray(data) ? data : []);

  const users = Array.isArray(list) ? list.map(normalizeUser) : [];

  const pagination = data.pagination
    || data.meta
    || {
      currentPage: data.currentPage || data.page || 1,
      totalPages: data.totalPages || 1,
      totalItems: data.totalItems || users.length,
      perPage: data.perPage || data.limit || users.length
    };

  return { users, pagination };
};

export const getAdminUsers = async (filters = {}) => {
  const queryString = toQueryString(filters);
  const suffix = queryString ? `?${queryString}` : '';

  const paths = [
    `/api/admin/users${suffix}`,
    `/admin/users${suffix}`,
    `/api/users${suffix}`,
    `/users${suffix}`,
    `/api/users/list${suffix}`
  ];

  let lastError = null;
  for (const path of paths) {
    try {
      const response = await api.get(path);
      return pickList(response);
    } catch (error) {
      if (error?.response?.status === 404) {
        console.warn(`Admin user listing endpoint missing at ${path}. Returning empty list.`);
        return {
          users: [],
          pagination: {
            currentPage: filters.page || 1,
            totalPages: 1,
            totalItems: 0,
            perPage: filters.limit || 0
          }
        };
      }
      lastError = error;
      continue;
    }
  }

  console.error('Failed to fetch admin users from all known endpoints.', lastError);
  throw lastError;
};

export const getAdminUserById = async (userId) => {
  const paths = [
    `/api/admin/users/${userId}`,
    `/admin/users/${userId}`,
    `/api/users/${userId}`,
    `/users/${userId}`
  ];

  let lastError = null;
  for (const path of paths) {
    try {
      const response = await api.get(path);
      const data = response?.data?.user || response?.data?.data?.user || response?.data;
      if (data) {
        return normalizeUser(data);
      }
    } catch (error) {
      if (error?.response?.status === 404) {
        console.warn(`Admin user ${userId} not found at ${path}.`);
        return null;
      }
      lastError = error;
      continue;
    }
  }

  console.error(`Failed to fetch user ${userId} from all known endpoints.`, lastError);
  throw lastError;
};

export const createAdminUser = async (payload) => {
  const paths = [
    '/api/admin/users',
    '/admin/users',
    '/api/users',
    '/users'
  ];

  let lastError = null;
  for (const path of paths) {
    try {
      const response = await api.post(path, payload);
      const data = response?.data?.user || response?.data?.data?.user || response?.data;
      return normalizeUser(data);
    } catch (error) {
      lastError = error;
      continue;
    }
  }

  console.error('Failed to create user via all known endpoints.', lastError);
  throw lastError;
};

export const updateAdminUser = async (userId, payload) => {
  const paths = [
    `/api/admin/users/${userId}`,
    `/admin/users/${userId}`,
    `/api/users/${userId}`,
    `/users/${userId}`
  ];

  let lastError = null;
  for (const path of paths) {
    try {
      const response = await api.put(path, payload);
      const data = response?.data?.user || response?.data?.data?.user || response?.data;
      return normalizeUser(data);
    } catch (error) {
      lastError = error;
      continue;
    }
  }

  console.error(`Failed to update user ${userId} via all known endpoints.`, lastError);
  throw lastError;
};

export const deleteAdminUser = async (userId) => {
  const paths = [
    `/api/admin/users/${userId}`,
    `/admin/users/${userId}`,
    `/api/users/${userId}`,
    `/users/${userId}`
  ];

  let lastError = null;
  for (const path of paths) {
    try {
      const response = await api.delete(path);
      return response?.data || { success: true };
    } catch (error) {
      lastError = error;
      continue;
    }
  }

  console.error(`Failed to delete user ${userId} via all known endpoints.`, lastError);
  throw lastError;
};

export default {
  getAdminUsers,
  getAdminUserById,
  createAdminUser,
  updateAdminUser,
  deleteAdminUser
};
