import axios from "axios";

export const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    withCredentials: true,
});

// Automatically attach token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

// Global error handler
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.error("Unauthorized - redirect to login");
        }

        return Promise.reject(error);
    }
);
