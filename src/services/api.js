import AuthContext from "../context/AuthContext";
import { useContext } from "react";

const API_URL = process.env.REACT_APP_API_URL;

export async function fetchWithAuth(endpoint, options={}) {
    const { accessToken, refreshAccessToken, logout } = useContext(AuthContext);

    if (!accessToken) {
        console.error("No access token found, redirecting to login...");
        logout();
        return;
    }

    options.headers = {
        "Authorization": `Bearer ${accessToken}`
    };

    let response = await fetch(`${API_URL}${endpoint}`, options);

    if (response.status === 401 ) { // Token expired
        console.log("Access token expired, refreshing...")
        await refreshAccessToken();

        options.headers["Authorization"] = `Bearer ${localStorage.getItem("access_token")}`;
        response = await fetch(`${API_URL}${endpoint}`, options)
    }

    return response.json();
}