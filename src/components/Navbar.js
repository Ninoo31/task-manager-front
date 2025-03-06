import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";


const Navbar = () => {
    const { user, logout } = useAuthContext;
    const navigate = useNavigate();

    return (
        <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
            <div>
                <h1 className="text-lg font-bold cursor-pointer" onClick={() => navigate("/dashboard")}>
                    Task Manager
                </h1>
            </div>
            <div>
                {user ? (
                    <>
                        <span className="mr-4">👋 Hello, {user.username}</span>
                        <button
                            onClick={logout}
                            className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <button
                        onClick={() => navigate("/login")}
                        className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Login
                    </button>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
