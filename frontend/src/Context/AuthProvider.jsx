import { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext();

const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);

    useEffect(() => {
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
                console.log(`Something went wrong ${error}`);
            }
        };

      fetchUser();
    }, []);
    

    const login = (userData) => {
        setUser(userData);
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext value={{ user, setUser, login, logout }}>
            {children}
        </AuthContext>
    )
}

export default AuthProvider

export function useAuth() {
    return useContext(AuthContext);
}