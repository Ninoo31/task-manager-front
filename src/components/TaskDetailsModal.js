import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { format } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";

const TaskDetailsModal = ({ isOpen, task, onClose, onUpdate, onDelete }) => {
    const [taskData, setTaskData] = useState({ ...task });

    useEffect(() => {
        // Update modal state when a new task is passed
        setTaskData({ ...task });
    }, [task]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTaskData({ ...taskData, [name]: value });
    };

    const handleDateChange = (date) => {
        const formattedDate = format(date, "yyyy-MM-dd");
        setTaskData({ ...taskData, deadline: formattedDate });
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        onUpdate(taskData); // Pass updated task to parent handler
        onClose(); // Close the modal
    };

    const handleDelete = () => {
        onDelete(taskData.id); // Pass task ID to parent handler for deletion
        onClose(); // Close the modal
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Task Details</h2>
                <form onSubmit={handleUpdate}>
                    <div className="mb-3">
                        <label className="block text-gray-700">Title</label>
                        <input
                            type="text"
                            name="title"
                            value={taskData.title}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring"
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="block text-gray-700">Description</label>
                        <textarea
                            name="description"
                            value={taskData.description}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring"
                        />
                    </div>
                    <div className="mb-3">
                        <label className="block text-gray-700">Priority</label>
                        <select
                            name="priority"
                            value={taskData.priority}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring"
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <label className="block text-gray-700">Deadline</label>
                        <DatePicker
                            selected={taskData.deadline ? new Date(taskData.deadline) : null}
                            onChange={handleDateChange}
                            dateFormat="yyyy-MM-dd"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring"
                        />
                    </div>
                    <div className="flex justify-between">
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            Save Changes
                        </button>
                        <button
                            type="button"
                            onClick={handleDelete}
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                        >
                            Delete
                        </button>
                    </div>
                </form>
                <button
                    onClick={onClose}
                    className="mt-4 w-full bg-gray-500 text-white py-2 rounded hover:bg-gray-600 transition"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default TaskDetailsModal;
