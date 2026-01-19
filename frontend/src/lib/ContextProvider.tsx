import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { clearAuthToken, getAuthToken } from "./auth";

type User = {
    email: string;
    username: string;
    id: string;
    picture: string
};

interface StateContextType {
    user: User | null;
    token: string | null;
    loading: boolean; // Loading state added
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    setToken: React.Dispatch<React.SetStateAction<string | null>>;
    logout: () => void;
}

const StateContext = createContext<StateContextType>({
    user: null,
    token: null,
    loading: true,  // By default, we assume loading until data is fetched
    setUser: () => { },
    setToken: () => { },
    logout: () => { },
});

interface ContextProviderProps {
    children: ReactNode;
}

export const ContextProvider: React.FC<ContextProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true); // Loading state

    useEffect(() => {
        const storedToken = getAuthToken(); // Replace with your actual logic to get token
        const storedUser = localStorage.getItem("user");

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }

        setLoading(false); // Once data is fetched, set loading to false
    }, []);

    const logout = () => {
        clearAuthToken();
        setUser(null);
        setToken(null);
    };

    const contextValue = useMemo(
        () => ({
            user,
            token,
            loading,  // Expose loading state
            setUser,
            setToken,
            logout,
        }),
        [user, token, loading]
    );

    return (
        <StateContext.Provider value={contextValue}>
            {children}
        </StateContext.Provider>
    );
};

export const useStateContext = () => useContext(StateContext);
