import React from "react";
import Navbar from "./Navbar"; // Import the Navbar component

const Layout = ({ children }) => {
    return (
        <div>
            <Navbar /> {/* Navbar is included on all pages */}
            <main className="p-4">{children}</main>
        </div>
    );
};

export default Layout;
