import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL_LOCAL;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

// Menambahkan interceptor untuk menambahkan token ke setiap permintaan
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Ambil token dari localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Set header Authorization
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
