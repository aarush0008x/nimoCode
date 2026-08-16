export const getApiUrl = (endpoint: string = ''): string => {
  const base = import.meta.env.VITE_API_URL || (typeof window !== 'undefined' && window.location.hostname === 'localhost' ? 'http://localhost:5000/api' : 'https://nimocode.onrender.com/api');
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${base.replace(/\/$/, '')}${cleanEndpoint}`;
};
