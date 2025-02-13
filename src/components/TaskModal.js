import "react-datepicker/dist/react-datepicker.css";
import { useState } from "react";
import DatePicker from "react-datepicker";
import { format } from "date-fns";


const TaskModal = ({ isOpen, onClose, onCreate }) =>{
    const [taskData, setTaskData] = useState({
        title: "",
        description: "",
        priority: "low", // Default priority
        deadline: null,
        status: "pending", // Default status
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTaskData({ ...taskData, [name]: value });
    };

    const handleDateChange = (date) => {
        if (date) {
            const formattedDate = format(date, "yyyy-MM-dd");
            setTaskData({ ...taskData, deadline: formattedDate });
        } else {
            setTaskData({ ...taskData, deadline: null });
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        onCreate(taskData); // Pass taskData to the parent handler
        console.log(taskData)
        setTaskData({ title: "", description: "", priority: "low", deadline: "", status: "pending" }); // Reset form
        onClose(); // Close modal
    };

    if (!isOpen) return null; // Don't render the modal if it's not open

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Create Task</h2>
                <form onSubmit={handleSubmit}>
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
                            dateFormat="yyyy-MM-dd" // Display format
                            placeholderText="Select a deadline"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
                    >
                        Create Task
                    </button>
                </form>
                <button
                    onClick={onClose}
                    className="mt-4 w-full bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default TaskModal;