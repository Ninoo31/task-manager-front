import React, { useContext, useEffect } from "react";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => { //Redirect to login if user not authorized
        if (!user) {
            navigate("/login");
        }
    }, [user, navigate]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-2xl p-6 bg-white shadow-md rounded-lg">
                <h2 className="text-3xl font-semibold text-center">Dashboard</h2>
                {user ? (
                    <div className="mt-4 text-center">
                        <p className="text-lg">Welcome, <span className="font-bold">{user.username}</span> 👋</p>
                        <button 
                            onClick={logout} 
                            className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition">
                            Déconnexion
                        </button>
                    </div>
                ) : (
                    <p className="text-center">Chargement...</p>
                )}
            </div>
        </div>
    );
};

export default Dashboard;