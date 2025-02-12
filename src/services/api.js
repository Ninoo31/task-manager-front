import AuthProvider from '../context/AuthContext'

export async function fetchWithAuth(endpoint, options={}, accessToken, refreshToken, setAccessToken, logout) {
    if (!accessToken) {
        console.error("No access token found, trying to refresh...");
        accessToken = await refreshAccessToken(refreshToken, setAccessToken, logout);
        if (!accessToken) {
            logout();
            return;
        }
    }

    options.headers = {
        ...options.headers,
        "Authorization": `Bearer ${accessToken}`
    };

    let response = await fetch(`${endpoint}`, options);

    if (response.status === 401 ) { // Token expired
        console.log("Access token expired, refreshing...")
        accessToken = await refreshAccessToken(refreshToken, setAccessToken, logout);
        if (!accessToken) {
            logout();
            return;
        }

        options.headers["Authorization"] = `Bearer ${accessToken}`;
        response = await fetch(`${endpoint}`, options)
    }

    return response.json();
}


export async function refreshAccessToken(refreshToken, setAccessToken, logout) {
    if (!refreshToken) {
        logout();
        return
    }

    try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/users/refresh`, {
            method: "POST",
            headers: { "Authorization": `Bearer ${refreshToken}` },
        });

        if (response.ok) {
            const data = await response.json();
            setAccessToken(data.access_token); // ✅ Now it's correctly passed as a parameter
            localStorage.setItem("access_token", data.access_token);
        } else {
            logout();
        }
    } catch (error) {
        console.error("Failed to refresh token:", error);
        logout();
    }
}


