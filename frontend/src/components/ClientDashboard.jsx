import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SearchIcon from '@mui/icons-material/Search';
import api from "../api/axios";

export default function ClientDashboard() {
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [updating, setUpdating] = useState("");

    useEffect(() => {
        fetchMyTasks();
    }, []);

    const fetchMyTasks = async () => {
        try {
            const { data } = await api.get('/api/tasks/my');
            setTasks(data);
        } catch (error) {
            console.error('Failed to fetch tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddTask = () => {
        navigate('/create-task');
    };

    const handleMarkCompleted = async (taskId) => {
        setUpdating(taskId);
        try {
            await api.put(`/api/tasks/${taskId}`, { status: 'completed' });
            await fetchMyTasks();
        } catch (error) {
            alert('Failed to mark as completed');
        } finally {
            setUpdating("");
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="clientDashboard">
            <div className="searchSection">
                <div className="searchBar">
                    <input
                        type="text"
                        placeholder="Search tasks..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                    <div className="searchIcon"><SearchIcon /></div>
                </div>
            </div>
            <div className="tasksSection">
                <h3>Posted Tasks</h3>
                <div className="tasksGrid">
                    {tasks.filter(task => ['open', 'in progress'].includes(task.status) && (
                        task.title?.toLowerCase().includes(search.toLowerCase()) ||
                        task.description?.toLowerCase().includes(search.toLowerCase()) ||
                        task.category?.toLowerCase().includes(search.toLowerCase())
                    )).length === 0 ? (
                        <div className="noTasks">
                            <p>No open or in-progress tasks</p>
                        </div>
                    ) : (
                        tasks.filter(task => ['open', 'in progress'].includes(task.status) && (
                            task.title?.toLowerCase().includes(search.toLowerCase()) ||
                            task.description?.toLowerCase().includes(search.toLowerCase()) ||
                            task.category?.toLowerCase().includes(search.toLowerCase())
                        )).map((task) => (
                            <div key={task._id} className="taskCard" onClick={() => navigate(`/task/${task._id}`)}>
                                <div className="taskImg">
                                    {task.image ? (
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
                                    {task.status === 'in progress' && (
                                        <button
                                            className="completeButton"
                                            disabled={updating === task._id}
                                            onClick={e => {e.stopPropagation(); handleMarkCompleted(task._id);}}
                                        >
                                            {updating === task._id ? 'Updating...' : 'Mark as Completed'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
            <button className="addTaskButton" onClick={handleAddTask}>
                + Add
            </button>
        </div>
    );
}