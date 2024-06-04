import axios from 'axios';

const apiUrl = process.env.EXPO_PUBLIC_BASE_URL;
const STATIC_TOKEN = process.env.EXPO_PUBLIC_STATIC_TOKEN;
const apiClient = axios.create({
    baseURL: apiUrl,
    headers: {
        'Content-Type': 'application/json'
    }
});

apiClient.interceptors.request.use(config => {
    config.headers['authorization'] = STATIC_TOKEN;
    return config;
}, error => {
    return Promise.reject(error);
});

export default apiClient;
