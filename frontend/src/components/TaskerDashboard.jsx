import React, { useEffect, useMemo, useState } from "react";
import SearchIcon from '@mui/icons-material/Search';
import api from "../api/axios";

export default function TaskerDashboard() {
    const [tasks, setTasks] = useState([]);
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [assignedTasks, setAssignedTasks] = useState([]);
    const [assignedLoading, setAssignedLoading] = useState(true);

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
    }, []);

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
            <h3>Available Tasks</h3>

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
                        </div>
                        <div className="taskActions">
                            <button className="acceptButton" onClick={e => {e.stopPropagation(); handleAccept(task._id);}}>Accept</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}