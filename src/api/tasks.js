import { fetchWithAuth } from "../services/api.js"

const API_URL = process.env.REACT_APP_API_URL

// Get User's tasks
export async function fetchUserTasks(accessToken, refreshToken, setAccessToken, logout, page = 1, perPage = 10){
    if (!accessToken) return;
    
    const url = new URL(`${API_URL}/tasks/user`);
    url.searchParams.append("page", page);
    url.searchParams.append("perPage", perPage);

    return fetchWithAuth(url.toString(), {}, accessToken, refreshToken, setAccessToken, logout);
}