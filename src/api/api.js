import { fetchWithAuth } from "../services/api.js"


const URL = process.env.REACT_APP_API_URL

// Get User's tasks
export async function fetchUserTasks(accessToken, page = 1, perPage = 10){
    if (!accessToken) return;
    
    const url = new URL(`${URL}/tasks`);
    url.searchParams.append("page", page);
    url.searchParams.append("perPage", perPage);

    return fetchWithAuth(url.toString(), {}, accessToken);
}

// Get User's profil
export async function fetchUserProfile(accessToken, setUser) {
    if (!accessToken) return;

    try {
        const response = await fetch(`${URL}/users/profile`, {
            headers: { "Authorization": `Bearer ${accessToken}`}
        });

        if (response.ok) {
            const data = await response.json();
            setUser(data);
        }
    } catch (error) {
        console.error("Failed to fetch user profile: ", error);
    }
};
