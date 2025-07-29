import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://typing-master-backend.onrender.com'
});

// Automatically attach token
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default instance; 