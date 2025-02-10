import React, { useEffect, useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { fetchUserTasks } from "../api/api";

const perPage = 10 // Should be dynamic

const Dashboard = () => {
    const { user, accessToken } = useContext(AuthContext)
    const [tasks, setTasks] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        if(accessToken){
            loadTasks();
        }
    }, [currentPage, accessToken]);

    const loadTasks = async () => {
        const data = await fetchUserTasks(currentPage, perPage);
        setTasks(data.tasks);
        setTotalPages(Math.ceil(data.total_tasks / perPage))
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">📋 Mes Tâches</h2>

            {/* Display the user's name */}
            {user && <p className="text-gray-700">👋 Bonjour, <strong>{user.username}</strong> !</p>}

            {/* Add Task Button */}
            <button
                className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
                onClick={() => navigate("/create-task")}
            >
                ➕ Nouvelle Tâche
            </button>

            {/* Task List */}
            <ul className="border rounded p-4 bg-white shadow">
                {tasks.length === 0 ? (
                    <p className="text-gray-500">Aucune tâche trouvée.</p>
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
                    ⬅️ Précédent
                </button>
                <span>Page {currentPage} / {totalPages}</span>
                <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className="px-4 py-2 bg-gray-300 rounded mx-2"
                >
                    Suivant ➡️
                </button>
            </div>
        </div>
    );
};

export default Dashboard;