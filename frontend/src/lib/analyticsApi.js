import api from './api';

const buildQueryString = (params = {}) => {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    search.append(key, value);
  });
  const query = search.toString();
  return query ? `?${query}` : '';
};

export const getAnalyticsOverview = async (params = {}) => {
  const query = buildQueryString(params);
  const response = await api.get(`/api/analytics/overview${query}`);
  const data = response?.data?.data || response?.data || {};
  return data;
};

export default {
  getAnalyticsOverview
};
