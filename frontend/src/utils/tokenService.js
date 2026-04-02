// Simple token service to centralize storage operations and parsing
export function getToken() {
  return localStorage.getItem('token');
}

export function setToken(token) {
  if (token) localStorage.setItem('token', token);
  else localStorage.removeItem('token');
}

export function getRefreshToken() {
  return localStorage.getItem('refreshToken');
}

export function setRefreshToken(token) {
  if (token) localStorage.setItem('refreshToken', token);
  else localStorage.removeItem('refreshToken');
}

export function clearTokens() {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
}

export function getUser() {
  try {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
  } catch (e) {
    localStorage.removeItem('user');
    return null;
  }
}

export function setUser(user) {
  if (user) localStorage.setItem('user', JSON.stringify(user));
  else localStorage.removeItem('user');
}

export default {
  getToken,
  setToken,
  getRefreshToken,
  setRefreshToken,
  clearTokens,
  getUser,
  setUser,
};
