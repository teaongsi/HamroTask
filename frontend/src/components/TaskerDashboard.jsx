import { useEffect, useMemo, useState } from "react";
import SearchIcon from '@mui/icons-material/Search';
import api from "../api/axios";

export default function TaskerDashboard() {
    const [tasks, setTasks] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [assignedTasks, setAssignedTasks] = useState([]);
    const [assignedLoading, setAssignedLoading] = useState(true);
    const [applications, setApplications] = useState([]);
    const [applicationStatusMap, setApplicationStatusMap] = useState({});
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const { data } = await api.get("/api/tasks");
                setTasks(data);
            } catch (error) {
                console.error("Failed to fetch tasks:", error);
            } finally {
                setLoading(false);
            }
        };

        const fetchAssignedTasks = async () => {
            try {
                const { data } = await api.get("/api/tasks/assigned", {
                    withCredentials: true
                });
                setAssignedTasks(data);
            } catch {
                setAssignedTasks([]);
            } finally {
                setAssignedLoading(false);
            }
        };

        const fetchApplications = async () => {
            try {
                const { data } = await api.get("/api/applications/my");
                setApplications(data);

                const statusMap = {};
                data.forEach(app => {
                    if (app.task?._id) {
                        statusMap[app.task._id] = app.status;
                    }
                });
                setApplicationStatusMap(statusMap);
            } catch (error) {
                console.error("Failed to fetch applications:", error);
            }
        };

        const fetchUser = async () => {
            try {
                // 1. LocalStorage first
                const ls = localStorage.getItem("userData");
                if (ls) {
                    const parsed = JSON.parse(ls);
                    if (parsed?.user) {
                        setUser(parsed.user);
                    }
                }

                // 2. Verify with backend
                const { data } = await api.get("/api/auth/status", {
                    withCredentials: true
                });

                if (data?.loggedIn && data.user) {
                    setUser(data.user);
                    localStorage.setItem(
                        "userData",
                        JSON.stringify({ user: data.user })
                    );
                }
            } catch (err) {
                console.error("Failed to load user", err);
                setUser(null);
            }
        };

        fetchTasks();
        fetchAssignedTasks();
        fetchApplications();
        fetchUser();
    }, []);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return tasks;
        return tasks.filter(t =>
            t.title?.toLowerCase().includes(q) ||
            t.description?.toLowerCase().includes(q) ||
            t.category?.toLowerCase().includes(q)
        );
    }, [tasks, search]);

    const handleAccept = async (taskId) => {
        try {
            await api.post(`/api/applications/${taskId}/apply`, { message: 'I would like to work on this task' });
            setApplicationStatusMap(prev => ({ ...prev, [taskId]: 'pending' }));
            const { data } = await api.get('/api/applications/my');
            const statusMap = {};
            data.forEach(app => {
                if (app.task && app.task._id) {
                    statusMap[app.task._id] = app.status;
                }
            });
            setApplicationStatusMap(statusMap);
            alert('Application submitted successfully!');
        } catch (error) {
            console.error('Failed to apply:', error);
            alert(error.response?.data?.message || 'Failed to apply to task');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="taskerDashboard">
            <div className="searchRow">
                <div className="bigSearch">
                    <input 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search tasks..." 
                    />
                    <div className="searchIcon"><SearchIcon /></div>
                </div>
                <div className="categoryRow">
                    <button className="categoryChip">Categories</button>
                    <button className="categoryChip">Categories</button>
                    <button className="categoryChip">Categories</button>
                    <button className="categoryChip">Categories</button>
                    <button className="categoryChip">Categories</button>
                    <button className="categoryChip">Categories</button>
                    <button className="categoryChip">Categories</button>
                    <button className="categoryChip">Categories</button>
                    <button className="categoryChip">Categories</button>
                    <button className="categoryChip">Categories</button>
                    <button className="categoryChip">Categories</button>
                    <button className="categoryChip">Categories</button>
                    <button className="categoryChip">Categories</button>
                </div>
            </div>
            <div className="titleRow">
            <h3>Available Tasks</h3>
            {user && (
                        <div className="welcome">
                            Welcome <span className="name">{user.firstName} {user.lastName}</span>
                        </div>
                    )}
            </div>

            <div className="tasksGrid">
                {filtered.filter(task => task.status === 'open').map(task => (
                    <div className="taskCard" key={task._id} onClick={() => window.location.href = `/task/${task._id}`} style={{cursor: 'pointer'}}>
                        <div className="taskImg">
                            {task.image && typeof task.image === 'string' && !task.image.startsWith('blob:') ? (
                                <img
                                    src={task.image.startsWith('/uploads/')
                                        ? `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}${task.image}`
                                        : task.image}
                                    alt="Task"
                                    className="taskImage"
                                    onError={e => {e.target.onerror = null; e.target.src = '/assets/logo.png';}}
                                />
                            ) : (
                                <div className="imagePlaceholder">image</div>
                            )}
                        </div>
                        <div className="taskInfo">
                            <h4>{task.title}</h4>
                            <p className="taskStatus">{task.status}</p>
                             <div className="taskActions">
                            {applicationStatusMap[task._id] ? (
                                <button className="acceptedButton" disabled>
                                    {applicationStatusMap[task._id] === 'accepted' ? 'Accepted' : 
                                     applicationStatusMap[task._id] === 'rejected' ? 'Rejected' : 
                                     'Applied'}
                                </button>
                            ) : (
                                <button className="acceptButton" onClick={e => {e.stopPropagation(); handleAccept(task._id);}}>Accept</button>
                            )}
                        </div>
                        </div>
                       
                    </div>
                ))}
            </div>
        </div>
    );
}