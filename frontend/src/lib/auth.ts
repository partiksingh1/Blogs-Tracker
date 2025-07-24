import toast from 'react-hot-toast';
import { useNavigate } from "react-router";
let hasShownAuthError = false;
export const getAuth = (navigate: ReturnType<typeof useNavigate>, showError = true): { token: string; userId: string } | null => {
    console.log("called auth");

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    if (!token || !userId) {
        if (showError && !hasShownAuthError) {
            toast.error("Please Login");
            hasShownAuthError = true;
            navigate?.("/login");
        }
        return null;
    }
    return { token, userId };
}