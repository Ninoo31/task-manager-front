// Get User's profil
export async function fetchUserProfile(accessToken) {
    if (!accessToken) return;

    try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/users/profile`, {
            headers: { "Authorization": `Bearer ${accessToken}`}
        });

        if (response.ok) {
            const data = await response.json();
            console.log(data)
            return data;
        }
    } catch (error) {
        console.error("Failed to fetch user profile: ", error);
    }
};

export async function loginUser(username, password, context) {
    const { setAccessToken, setRefreshToken, fetchUserProfile, navigate } = context;
    try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/users/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (response.ok) {
            const accessToken = data.access_token;
            setAccessToken(accessToken);
            setRefreshToken(data.refresh_token);
            localStorage.setItem("access_token", accessToken);
            localStorage.setItem("refresh_token", data.refresh_token);

            await fetchUserProfile(accessToken);
            navigate("/dashboard");
        } else {
            return data.error || "Login failed. Please try again.";
        }
    } catch (error) {
        console.error("Login error:", error);
        throw error;
    }
}

export async function register(user, context) {
    const { accessToken, navigate } = context
    const { username, password, email, role } = user
    if(accessToken) return;
    try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/users/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password, email, role })
        });

        const data = await response.json();

        if(response.ok){
            navigate("/login");
        } else {
            throw new Error(data.error || "Failed to Register");
        }
    } catch (error) {
        console.error("Register error", error);
        throw error;
    }
}
