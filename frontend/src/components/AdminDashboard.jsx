
import { useEffect, useState } from "react";
import api from "../api/axios";
import CompactTaskCard from "./CompactTaskCard";
import CompactUserCard from "./CompactUserCard";
import "../styles/admin.css";
import "../styles/profile.css";

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

    const handleDeleteTask = async (taskId, e) => {
        e.stopPropagation();
        if (!window.confirm('Are you sure you want to delete this task? This action cannot be undone.')) {
            return;
        }
        try {
            await api.delete(`/api/tasks/${taskId}`);
            alert('Task deleted successfully!');
            fetchData();
        } catch (error) {
            console.error('Failed to delete task:', error);
            alert(error.response?.data?.message || 'Failed to delete task');
        }
    };

    const handleDeleteUser = async (userId, e) => {
        e.stopPropagation();
        if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            return;
        }
        try {
            await api.delete(`/api/users/${userId}`);
            alert('User deleted successfully!');
            fetchData();
        } catch (error) {
            console.error('Failed to delete user:', error);
            alert(error.response?.data?.message || 'Failed to delete user');
        }
    };

    return (
        <div className="adminProfileDashboardWrapper" style={{display:'flex',flexDirection:'row',height:'100vh'}}>
            <div className="adminProfileSidebar" style={{width:'40%',minWidth:'320px',maxWidth:'500px',display:'flex',alignItems:'center',justifyContent:'center',background:'#fff',boxShadow:'0 0 8px #eee'}}>
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
                                <button className="editButton" onClick={logout}>Logout</button>
                            </div>
                        </>
                    )}
                </div>
            </div>
            <div className="adminDashboardMainContent" style={{width:'60%',display:'flex',alignItems:'flex-start',justifyContent:'center',overflowY:'auto'}}>
                <div className="mainCard" style={{width:'100%',marginTop:'24px'}}>
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
                                            <CompactTaskCard
                                                key={task._id}
                                                task={task}
                                                showDelete={true}
                                                onDelete={handleDeleteTask}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="adminUsersGrid">
                                    <h3>All Users</h3>
                                    <div className="cardGrid">
                                        {users.map(user => (
                                            <CompactUserCard
                                                key={user._id}
                                                user={user}
                                                showDelete={true}
                                                onDelete={handleDeleteUser}
                                            />
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