import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    // Load from localStorage on mount
    useEffect(() => {
        const storedUser = localStorage.getItem('serveease_user');
        const storedToken = localStorage.getItem('serveease_token');
        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser));
            setToken(storedToken);
        }
        setLoading(false);
    }, []);

    const login = (userData, jwtToken) => {
        setUser(userData);
        setToken(jwtToken);
        localStorage.setItem('serveease_user', JSON.stringify(userData));
        localStorage.setItem('serveease_token', jwtToken);
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('serveease_user');
        localStorage.removeItem('serveease_token');
    };

    // Update user data in context + localStorage (after profile edit)
    const updateUser = (updatedFields) => {
        const merged = { ...user, ...updatedFields };
        setUser(merged);
        localStorage.setItem('serveease_user', JSON.stringify(merged));
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, updateUser, loading, isAdmin: user?.role === 'admin' }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

