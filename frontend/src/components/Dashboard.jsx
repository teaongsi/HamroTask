import ClientDashboard from "./ClientDashboard";
import TaskerDashboard from "./TaskerDashboard";
import AdminDashboard from "./AdminDashboard";
import Header from "./Header";
import Footer from "./Footer";
import "../styles/dashboard.css";

export default function Dashboard() {
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