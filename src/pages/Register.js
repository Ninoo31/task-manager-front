import { useNavigate } from "react-router-dom";
import { register } from "../api/users";
import { useState } from "react";
import { validatePassword } from "../utils/validation";

// Create User Page
const Register = () => {
    
    const [ formData, setFormData ] = useState({
        username: "",
        password: "",
        email: "",
        role: "user", // Default role
    });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({...formData, [name]: value });
        
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!validatePassword(formData.password)) {
            setError("Password must be at least 8 characters and include uppercase, lowercase, and a number.");
            return;
        }

        try { 
            await register(formData, {navigate});   
        } catch (error) {
            setError(error.message || "An error occurred. Please try again.");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-6 bg-white shadow-md rounded-lg">
                <h2 className="text-2xl font-semibold text-center">Register</h2>
                {error && <p className="text-red-500 text-center">{error}</p>}
                <form onSubmit={handleSubmit} className="mt-4">
                    <div>
                        <label className="block text-gray-700">Username</label>
                        <input
                            type="text"
                            name="username"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mt-3">
                        <label className="block text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mt-3">
                        <label className="block text-gray-700">Password</label>
                        <input
                            type="password"
                            name="password"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mt-3">
                        <label className="block text-gray-700">Role</label>
                        <select
                            name="role"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring"
                            value={formData.role}
                            onChange={handleChange}
                        >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="w-full mt-4 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
                    >
                        Register
                    </button>
                </form>
                <p className="mt-4 text-center text-gray-600">
                    Already have an account?{" "}
                    <span
                        onClick={() => navigate("/login")}
                        className="text-blue-500 cursor-pointer hover:underline"
                    >
                        Login here
                    </span>
                </p>
            </div>
        </div>
    );
};

export default Register;