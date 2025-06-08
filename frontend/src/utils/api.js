import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000, // Optional: prevent hanging requests
});

// Attach token if available
API.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem('token');
    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Optional: Log responses with errors (can help debugging)
// API.interceptors.response.use(
//   response => response,
//   error => {
//     console.error('API response error:', error?.response || error);
//     return Promise.reject(error);
//   }
// );

export default API;
