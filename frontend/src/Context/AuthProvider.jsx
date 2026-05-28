import React, { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext();

const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);

    const fetchUser = async () => {
        try {
            const res = await fetch('/api/auth/me', {
                credentials: 'include'
            });

            if (res.ok) {
                const data = await res.json();
                setUser(data);
            } else {
                setUser(null);
            }
        } catch (error) {
            console.log("Something went wrong");
        }
    };

    useEffect(() => {
      fetchUser();
    }, []);
    

    const login = (userData) => {
        setUser(userData);
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext value={{ user, login, logout, fetchUser }}>
            {children}
        </AuthContext>
    )
}

export default AuthProvider

export function useAuth() {
    return useContext(AuthContext);
}