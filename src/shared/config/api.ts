export const API_BASE_URL = import.meta.env.PROD
  ? import.meta.env.VITE_API_URL || window.location.origin
  : window.location.origin;
