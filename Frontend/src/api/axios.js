import axios from 'axios';

// 👇 التغيير هنا: نستخدم رابط جهازك المحلي
const BASE_URL = "https://cy-password.onrender.com/api";

const api = axios.create({
    baseURL: BASE_URL
});

// هذا الكود يضيف التوكن تلقائياً لكل الطلبات (لا تغيره)
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth-token');
    if (token) {
        config.headers['auth-token'] = token;
    }
    return config;
});

export default api;