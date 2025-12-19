import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ClientDashboard from "./ClientDashboard";
import TaskerDashboard from "./TaskerDashboard";
import AdminDashboard from "./AdminDashboard";
import Header from "./Header";
import Footer from "./Footer";
import api from "../api/axios";
import "../styles/dashboard.css";

export default function Dashboard() {
    const navigate = useNavigate();
    const [userData, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("userData");
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error("Error parsing user data from localStorage:", error);
                setUser(null);
            }
        }
    }, []);

    const logout = async () => {
        try {
            await api.post("/api/auth/logout", {}, {
                withCredentials: true
            });
        } catch (error) {
            console.error("Error during logout:", error);
        }

        setUser(null);
        window.location.href = "/login";
    };

    if (!userData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="dashboardContainer">
            <Header />
            <div className="dashboardContent">
                {userData.user.role === "client" && <ClientDashboard />}
                {userData.user.role === "tasker" && <TaskerDashboard />}
                {userData.user.role === "admin" && <AdminDashboard />}
            </div>
            <Footer />
        </div>
    );
}