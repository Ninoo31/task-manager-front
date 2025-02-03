import React, { createContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [accessToken, setAccessToken] = useState(localStorage.getItem("access_token") || null)
    const [refreshToken, setRefreshToken] = useState(localStorage.getItem("refresh_token") || null)
    const [user, setUser] = useState(null);

    const refreshAccessToken = async () => {
        if (!refreshToken) return

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/users/refresh`, {
                method: "POST",
                headers: { "Authorization": `Bearer ${refreshToken}`}
            });

            if (response.ok) {
                const data = await response.json();
                setAccessToken("access_token", data.access_token)
                localStorage.setItem("access_token", data.access_token)
            } else {
                logout();
            }
        } catch (error) {
            console.error("Refresh token failed: ", error);
            logout();
        }
    };

    // Function to get user profil
    const fetchUserProfile = async () => {
        if (!accessToken) return;

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/users/profile`, {
                headers: { "Authorization": `Bearer ${accessToken}`}
            });

            if (response.ok) {
                const data = await response.json();
                setUser(data);
            } else if (response.status === 401) {
                await refreshAccessToken(); // Refresh token if expired
            }
        
        } catch (error) {
            console.error("Failed to fetch user profile: ", error);
        }
    };

    const logout = () => {
        setAccessToken(null);
        setRefreshToken(null);
        setUser(null);
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
    };

    useEffect(() => {
        fetchUserProfile(); // Charger le profil utilisateur au démarrage
    }, [accessToken]);

    return (
        <AuthContext.Provider value={{ accessToken, user, refreshAccessToken, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;