import React, {useState, useContext } from "react"
import AuthContext from "../context/AuthContext"
import { useNavigate } from "react-router-dom"
import { loginUser } from "../api/users";

const Login = () => {
    const { setAccessToken, setRefreshToken, fetchUserProfile } = useContext(AuthContext);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();


    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            // Pass all dependencies into the loginUser function
            await loginUser(username, password, {
                setAccessToken,
                setRefreshToken,
                fetchUserProfile,
                navigate,
            });
        } catch (error) {
            setError(error.message || "An error occurred. Please try again.");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-6 bg-white shadow-md rounded-lg">
                <h2 className="text-2xl font-semibold text-center">Login</h2>
                {error && <p className="text-red-500 text-center">{error}</p>}
                <form onSubmit={handleLogin} className="mt-4">
                    <div>
                        <label className="block text-gray-700">Username</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mt-3">
                        <label className="block text-gray-700">Password</label>
                        <input
                            type="password"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full mt-4 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
                    >
                        Login
                    </button>
                </form>
            </div>
            <div>
                <p>
                    Don't have an account?{" "}
                    <span
                        onClick={() => navigate("/register")}
                        className="text-blue-500 cursor-pointer hover:underline"
                    >
                        Register here
                    </span>
                </p>
            </div>
        </div>
    );
};

export default Login;