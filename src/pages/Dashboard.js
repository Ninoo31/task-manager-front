import React, { useEffect, useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import TaskModal from "../components/TaskModal";
import { useNavigate } from "react-router-dom";
import { fetchUserTasks, createTask } from "../api/tasks";

const perPage = 10 // Should be dynamic

const Dashboard = () => {
    const { user, accessToken , refreshToken, setAccessToken, logout} = useContext(AuthContext)
    const [tasks, setTasks] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const loadTasks = async () => {
            if(accessToken){
                const data = await fetchUserTasks(accessToken, refreshToken, setAccessToken, logout, currentPage, perPage);
                if (data) {
                    setTasks(data.tasks);
                    setTotalPages(Math.ceil(data.total_tasks / perPage))
                } else {
                    setTasks([])
                }
            }
        };

        loadTasks();
    }, [user, currentPage, accessToken, refreshToken, setAccessToken, logout]);

    const handleCreateTask = async (taskData) => {
        try {
            const data = await createTask(accessToken, taskData); // API call to create a task
            setTasks((prevTasks) => [...prevTasks, taskData]); // Add the new task to the existing list
        } catch (error) {
            console.error("Error creating task:", error);
        }
    };


    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">📋 My Tasks</h2>

            {/* Display the user's name */}
            {user && <p className="text-gray-700">👋 Hello, <strong>{user.username}</strong> !</p>}

            {/* Add Task Button */}
            <button
                className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
                onClick={() => setIsModalOpen(true)}
            >
                ➕ Create Task
            </button>

            {/* Task Modal Form */}
            <TaskModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onCreate={handleCreateTask}
            />

            {/* Task List */}
            <ul className="border rounded p-4 bg-white shadow">
                {tasks.length === 0 ? (
                    <p className="text-gray-500">Nothing Today.</p>
                ) : (
                    tasks.map((task) => (
                        <li key={task.id} className="p-2 border-b flex justify-between">
                            <span>{task.title}</span>
                            <span className="text-sm text-gray-600">{task.status}</span>
                        </li>
                    ))
                )}
            </ul>

            {/* Pagination */}
            <div className="mt-4 flex justify-center">
                <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className="px-4 py-2 bg-gray-300 rounded mx-2"
                >
                    ⬅️ Previous
                </button>
                <span>Page {currentPage} / {totalPages}</span>
                <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className="px-4 py-2 bg-gray-300 rounded mx-2"
                >
                    Next ➡️
                </button>
            </div>
        </div>
    );
};

export default Dashboard;