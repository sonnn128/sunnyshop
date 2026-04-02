/**
 * JWT Utility Functions
 * Note: These are client-side utilities for reading JWT payload
 * For production, always verify tokens on the server side
 */

export const decodeJWT = (token) => {
  if (!token) return null;
  
  try {
    // Split token into parts
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid JWT format');
    }
    
    // Decode payload (middle part)
    const payload = parts[1];
    const decoded = atob(payload);
    const parsed = JSON.parse(decoded);
    
    return {
      header: JSON.parse(atob(parts[0])),
      payload: parsed,
      signature: parts[2]
    };
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

export const isTokenExpired = (token) => {
  const decoded = decodeJWT(token);
  if (!decoded || !decoded.payload.exp) return true;
  
  const currentTime = Date.now() / 1000;
  return decoded.payload.exp < currentTime;
};

export const getTokenExpiration = (token) => {
  const decoded = decodeJWT(token);
  if (!decoded || !decoded.payload.exp) return null;
  
  return new Date(decoded.payload.exp * 1000);
};

export const hasAuthority = (token, authority) => {
  const decoded = decodeJWT(token);
  if (!decoded || !decoded.payload.authorities) return false;
  
  return decoded.payload.authorities.includes(authority);
};

export const isAdmin = (token) => {
  return hasAuthority(token, 'ROLE_ADMIN');
};

export const getTokenInfo = (token) => {
  const decoded = decodeJWT(token);
  if (!decoded) return null;
  
  const { payload } = decoded;
  const isExpired = isTokenExpired(token);
  const expiresAt = getTokenExpiration(token);
  
  return {
    payload,
    isExpired,
    expiresAt: expiresAt ? expiresAt.toLocaleString() : null,
    authorities: payload.authorities || [],
    subject: payload.sub,
    issuedAt: payload.iat ? new Date(payload.iat * 1000).toLocaleString() : null
  };
};
