import React, { useEffect, useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import TaskModal from "../components/TaskModal";
import TaskDetailsModal from "../components/TaskDetailsModal";
import { fetchUserTasks, createTask, updateTask, deleteTask } from "../api/tasks";

const perPage = 10 // Should be dynamic

const Dashboard = () => {
    const { user, accessToken , refreshToken, setAccessToken, logout} = useContext(AuthContext)
    const [tasks, setTasks] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);

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

    const handleUpdateTask = async (updatedTask) => {
        try {
            const updated = await updateTask(accessToken, updatedTask);
            setTasks((prevTasks) =>
                prevTasks.map((task) => (task.id === updated.id ? updated : task))
            );
        } catch (error) {
            console.error("Error updating task:", error);
        }
    };

    const handleDeleteTask = async (taskId) => {
        try {
            await deleteTask(accessToken, taskId);
            setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    const openDetailsModal = (task) => {
        setSelectedTask(task);
        setIsDetailsModalOpen(true);
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

            {selectedTask && (
                <TaskDetailsModal
                    isOpen={isDetailsModalOpen}
                    task={selectedTask}
                    onClose={() => setIsDetailsModalOpen(false)}
                    onUpdate={handleUpdateTask}
                    onDelete={handleDeleteTask}
                />
            )}

            {/* Task List */}
            <ul className="border rounded p-4 bg-white shadow">
                {tasks.length === 0 ? (
                    <p className="text-gray-500">Nothing Today.</p>
                ) : (
                    tasks.map((task) => (
                        <li key={task.id} className="p-2 border-b flex justify-between cursor-pointer border rounded-lg focus:outline-none focus:ring hover:bg-blue-200" 
                            onClick={() => openDetailsModal(task)}>
                            <span>{task.title}</span>
                            <span className="text-sm text-gray-600">{task.status}</span>
                        </li>
                    ))
                )}
            </ul>

            {/* Pagination */}
            {totalPages > 0 && (
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
                </div> )
            }
        </div>
    );
};

export default Dashboard;