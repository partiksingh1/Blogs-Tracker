export const setAuth = (token: string, user: string) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", user);
};

// Get token
export const getAuthToken = (): string | null => {
    return localStorage.getItem("token");
};

// Remove token (for logout)
export const clearAuthToken = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
    return !!getAuthToken();
};
