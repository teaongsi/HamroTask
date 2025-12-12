import { useEffect, useState } from "react";
import api from "../api/axios";
import "../styles/admin.css";

export default function AdminDashboard() {
    const [tab, setTab] = useState('tasks');
    const [tasks, setTasks] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [admin, setAdmin] = useState(null);
    const [adminLoading, setAdminLoading] = useState(true);

    useEffect(() => {
        fetchAdmin();
    }, []);

    useEffect(() => {
        fetchData();
    }, [tab]);

    const fetchAdmin = async () => {
        setAdminLoading(true);
        try {
            const ls = localStorage.getItem('userData');
            if (ls) {
                try {
                    const parsed = JSON.parse(ls);
                    if (parsed?.user && parsed.user.role === 'admin') {
                        setAdmin(parsed.user);
                    }
                } catch {}
            }
            const { data } = await api.get('/api/users/me');
            if (data.role === 'admin') setAdmin(data);
        } catch (error) {
            setAdmin(null);
        } finally {
            setAdminLoading(false);
        }
    };

    const fetchData = async () => {
        setLoading(true);
        setError("");
        try {
            if (tab === 'tasks') {
                const { data } = await api.get('/api/tasks/all', { withCredentials: true });
                setTasks(data);
            } else {
                const { data } = await api.get('/api/users/all', { withCredentials: true });
                setUsers(data);
            }
        } catch (err) {
            setError('Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            await api.post("/api/auth/logout", {}, { withCredentials: true });
        } catch (error) {
            console.error("Error during logout:", error);
        }
        window.location.href = "/login";
    };

    return (
        <div className="adminProfileDashboardWrapper">
            <div className="adminProfile">
                <div className="profileCard">
                    {adminLoading ? (
                        <div>Loading profile...</div>
                    ) : !admin ? (
                        <div>Admin profile not found</div>
                    ) : (
                        <>
                            <div className="profileImageContainer">
                                {admin.profilePicture && typeof admin.profilePicture === 'string' && !admin.profilePicture.startsWith('blob:') ? (
                                    <img
                                        src={
                                            admin.profilePicture.startsWith('/uploads/')
                                                ? `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}${admin.profilePicture}`
                                                : admin.profilePicture
                                        }
                                        alt="Profile"
                                        className="profileImage"
                                        onError={e => {
                                            e.target.onerror = null;
                                            e.target.src = '/assets/logo.png';
                                        }}
                                    />
                                ) : (
                                    <div className="profileImagePlaceholder">Profile pic</div>
                                )}
                            </div>
                            <div className="profileInfo">
                                <h2>{admin.firstName} {admin.lastName}</h2>
                                <p className="profileRole">{admin.role}</p>
                                <p className="profileEmail">{admin.email}</p>
                                {admin.bio && <p className="profileBio">{admin.bio}</p>}
                                <button className="logoutButton" onClick={logout} style={{marginTop:'16px'}}>Logout</button>
                            </div>
                        </>
                    )}
                </div>
            </div>
            <div className="adminDashboardMainContent">
                <div className="mainCard">
                    <h2>Admin Dashboard</h2>
                    <div className="adminTabs">
                        <button className={`adminTab${tab === 'tasks' ? ' active' : ''}`} onClick={() => setTab('tasks')}>Tasks</button>
                        <button className={`adminTab${tab === 'users' ? ' active' : ''}`} onClick={() => setTab('users')}>Users</button>
                    </div>
                    <div className="adminContent">
                        {loading ? <p>Loading...</p> : error ? <p>{error}</p> : (
                            tab === 'tasks' ? (
                                <div className="adminTasksGrid">
                                    <h3>All Tasks</h3>
                                    <div className="cardGrid">
                                        {tasks.map(task => (
                                            <div key={task._id} className="adminTaskCard">
                                                <div className="adminTaskTitle">{task.title}</div>
                                                <div className="adminTaskStatus">Status: <b>{task.status}</b></div>
                                                <div className="adminTaskUser">Posted by: {task.postedBy?.firstName} {task.postedBy?.lastName}</div>
                                                <div className="adminTaskCategory">Category: {task.category}</div>
                                                <div className="adminTaskBudget">Budget: NPR {task.budget}</div>
                                                <div className="adminTaskDate">Created: {new Date(task.createdAt).toLocaleString()}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="adminUsersGrid">
                                    <h3>All Users</h3>
                                    <div className="cardGrid">
                                        {users.map(user => (
                                            <div key={user._id} className="adminUserCard">
                                                <div className="adminUserName">{user.firstName} {user.lastName}</div>
                                                <div className="adminUserEmail">{user.email}</div>
                                                <div className="adminUserRole">Role: <b>{user.role}</b></div>
                                                {user.location && <div className="adminUserLocation">Location: {user.location}</div>}
                                                {user.skills?.length > 0 && <div className="adminUserSkills">Skills: {user.skills.join(', ')}</div>}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}