import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [accessToken, setAccessToken] = useState(localStorage.getItem("access_token") || null)
    const [refreshToken, setRefreshToken] = useState(localStorage.getItem("refresh_token") || null)
    const [user, setUser] = useState(null);

    // Function to get a new access_token
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
                navigate("/dashboard")
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
        navigate("/login")
    };

    useEffect(() => {
        fetchUserProfile(); // Charger le profil utilisateur au démarrage
    }, [accessToken]);

    return (
        <AuthContext.Provider value={{ accessToken, setAccessToken, refreshToken, setRefreshToken, user, refreshAccessToken, fetchUserProfile, logout  }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;