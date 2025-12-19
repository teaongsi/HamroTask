import { useEffect, useMemo, useState } from "react";
import SearchIcon from '@mui/icons-material/Search';
import api from "../api/axios";
import CompactTaskCard from "./CompactTaskCard";

export default function TaskerDashboard() {
    const [tasks, setTasks] = useState([]);
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [assignedTasks, setAssignedTasks] = useState([]);
    const [assignedLoading, setAssignedLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const { data } = await api.get('/api/tasks');
                setTasks(data);
            } catch (error) {
                console.error('Failed to fetch tasks:', error);
            } finally {
                setLoading(false);
            }
        })();
        (async () => {
            try {
                const { data } = await api.get('/api/tasks/assigned', { withCredentials: true });
                setAssignedTasks(data);
            } catch (error) {
                setAssignedTasks([]);
            } finally {
                setAssignedLoading(false);
            }
        })();
        loadUserData();
    }, []);

    const loadUserData = async () => {
        try {
            const ls = localStorage.getItem('userData');
            if (ls) {
                try {
                    const parsed = JSON.parse(ls);
                    if (parsed?.user) {
                        setUser(parsed.user);
                    }
                } catch {}
            }

            try {
                const { data } = await api.get('/api/users/me');
                setUser(data);
                localStorage.setItem('userData', JSON.stringify({ user: data }));
            } catch {
                const { data } = await api.get('/api/auth/status');
                if (data?.loggedIn) {
                    setUser(data.user);
                }
            }
        } catch (error) {
            console.error('Failed to load user data:', error);
        }
    };

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return tasks;
        return tasks.filter(t =>
            t.title?.toLowerCase().includes(q) ||
            t.description?.toLowerCase().includes(q) ||
            t.category?.toLowerCase().includes(q)
        );
    }, [tasks, query]);

    const handleAccept = async (taskId) => {
        try {
            await api.post(`/api/applications/${taskId}/apply`, { message: 'I would like to work on this task' });
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
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
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
                </div>
            </div>
            <div className="titleRow">
                <h3>Available Tasks</h3>
                {user && (
                    <div className="welcome">
                        welcome <span className="name">{user.firstName} {user.lastName}</span>
                    </div>
                )}
            </div>

            <div className="tasksGrid">
                {filtered.filter(task => task.status === 'open').map(task => (
                    <CompactTaskCard
                        key={task._id}
                        task={task}
                        showActions={true}
                        onAccept={handleAccept}
                    />
                ))}
            </div>
        </div>
    );
}