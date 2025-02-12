import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { refreshAccessToken } from "../services/api";
import { fetchUserProfile } from "../api/users";


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();

    const [accessToken, setAccessToken] = useState(localStorage.getItem("access_token") || null)
    const [refreshToken, setRefreshToken] = useState(localStorage.getItem("refresh_token") || null)
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (accessToken) {
            fetchUserProfile(accessToken).then((user) => setUser(user));
        } else if (refreshToken) {
            refreshAccessToken(refreshToken, setAccessToken, logout).then((newToken) => {
                if (newToken) {
                    fetchUserProfile(newToken).then((user) => setUser(user))
                }
            });
        }
    }, [accessToken, refreshToken]);
    

    const logout = () => {
        setAccessToken(null);
        setRefreshToken(null);
        setUser(null);
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        navigate("/login")
    };

    return (
        <AuthContext.Provider value={{ accessToken, setAccessToken, refreshToken, setRefreshToken, user, refreshAccessToken, fetchUserProfile, logout  }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;