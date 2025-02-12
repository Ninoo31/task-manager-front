import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/Layout";

const App = () => {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/dashboard" 
                        element={
                            <Layout>
                                <Dashboard />
                            </Layout>
                        }>
                    </Route>
                </Routes>
            </AuthProvider>
        </Router>
    );
};

export default App;
