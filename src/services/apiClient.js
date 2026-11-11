import axios from 'axios';
import { auth } from '../firebase.js';

// Both APIs receive the same Firebase ID token. Firebase refreshes it when
// getIdToken is called with forceRefresh=true after a rejected request.
const AUTH_API_BASE_URL = import.meta.env.VITE_API_ONE_URL ||
  import.meta.env.VITE_AUTH_API_BASE_URL || 'http://localhost:8080';
const OTHER_API_BASE_URL = import.meta.env.VITE_API_TWO_URL ||
  import.meta.env.VITE_OTHER_API_BASE_URL || 'http://localhost:8000';
const isCredentialRequest = (url = '') =>
  url.startsWith('/api/auth/token/') || url.startsWith('/api/auth/register/');

// Requests that establish a session. They carry no token, and their 401s mean
// wrong credentials rather than an expired session.
const createClient = (baseURL) => {
  const client = axios.create({
    baseURL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  client.interceptors.request.use(async (config) => {
    const user = auth.currentUser;
    const token = user
      ? await user.getIdToken(Boolean(config._firebaseRetry))
      : localStorage.getItem('access_token');

    if (token && !isCredentialRequest(config.url)) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  client.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (
        error.response?.status === 401 &&
        !originalRequest._retry &&
        auth.currentUser &&
        !isCredentialRequest(originalRequest.url)
      ) {
        originalRequest._retry = true;
        originalRequest._firebaseRetry = true;
        return client(originalRequest);
      }

      return Promise.reject(error);
    }
  );

  return client;
};

// Business API: login, registration and business assessments
export const authApiClient = createClient(AUTH_API_BASE_URL);

// Personal score API
const apiClient = createClient(OTHER_API_BASE_URL);

export default apiClient;
