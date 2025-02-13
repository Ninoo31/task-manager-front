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

export async function createTask(accessToken, taskData) {
    try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/tasks`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(taskData),
        });
        const data = await response.json();
        console.log(data);
        if (!response.ok) {
            throw new Error(data || "Failed to create task.");
        }
        return data; // Return the created task
    } catch (error) {
        console.error("Error creating task:", error);
        throw error;
    }
}

export async function updateTask(accessToken, updatedTask) {
    try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/tasks/${updatedTask.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(updatedTask),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data || "Failed to update task.");
        }
        return data;
    } catch (error) {
        console.error("Error updating task:", error);
        throw error;
    }
}

export async function deleteTask(accessToken, taskId) {
    try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/tasks/${taskId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        const data = response.json();
        if (!response.ok) {
            throw new Error(data || "Failed to delete task.");
        }
        return true;
    } catch (error) {
        console.error("Error deleting task:", error);
        throw error;
    }
}
