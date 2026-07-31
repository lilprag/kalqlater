const configuredBackendUrl = process.env.REACT_APP_BACKEND_URL?.replace(/\/$/, '');

// Local development remains frictionless. Production must set REACT_APP_BACKEND_URL
// to the public HTTPS backend origin; the relative fallback avoids an undefined URL.
export const BACKEND_URL = configuredBackendUrl || (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:8000');
export const API_URL = `${BACKEND_URL}/api`;
