import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Delete as DeleteIcon } from "@mui/icons-material";
import api from "../api/axios";
import "../styles/taskDetails.css";
import EditTask from "./EditTask";

export default function TaskDetails() {
    const { taskId } = useParams();
    const navigate = useNavigate();
    const [task, setTask] = useState(null);
    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        loadUserData();
        loadTaskDetails();
        loadApplicants();
    }, [taskId]);

    const loadUserData = () => {
        try {
            const storedUser = localStorage.getItem('userData');
            if (storedUser) {
                const parsed = JSON.parse(storedUser);
                setUser(parsed.user);
            }
        } catch (error) {
            console.error('Failed to load user data:', error);
        }
    };

    const loadTaskDetails = async () => {
        try {
            const { data } = await api.get(`/api/tasks/${taskId}`);
            setTask(data);
        } catch (error) {
            console.error('Failed to load task:', error);
        }
    };

    const handleEdit = () => setEditing(true);
    const handleEditCancel = () => setEditing(false);
    const handleEditSave = async () => {
        setEditing(false);
        await loadTaskDetails();
    };

    const handleMarkCompleted = async () => {
        setUpdating(true);
        try {
            await api.put(`/api/tasks/${taskId}`, { status: 'completed' });
            await loadTaskDetails();
        } catch {
            alert('Failed to mark as completed');
        } finally {
            setUpdating(false);
        }
    };

    const loadApplicants = async () => {
        try {
            const { data } = await api.get(`/api/applications/task/${taskId}`);
            setApplicants(data);
        } catch (error) {
            console.error('Failed to load applicants:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAcceptReject = async (applicationId, status) => {
        try {
            await api.put(`/api/applications/${applicationId}`, { status });
            await loadApplicants();
            await loadTaskDetails();
            alert(`Application ${status} successfully!`);
        } catch (error) {
            console.error('Failed to update application:', error);
            alert('Failed to update application');
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this task? This action cannot be undone.')) {
            return;
        }

        try {
            await api.delete(`/api/tasks/${taskId}`);
            alert('Task deleted successfully!');
            navigate('/dashboard');
        } catch (error) {
            console.error('Failed to delete task:', error);
            alert(error.response?.data?.message || 'Failed to delete task');
        }
    };

    const isTaskOwner = () => {
        return user && task && user._id === task.postedBy?._id && user.role === 'client';
    };

    if (loading) return <div>Loading...</div>;
    if (!task) return <div>Task not found</div>;

    return (
        <div className="taskDetailsWrapper">
            <div className="taskDetailsContent">
                <button className="backButton" onClick={() => navigate('/dashboard')}>
                    ← Back to Dashboard
                </button>

                {editing ? (
                    <div className="editTaskSection">
                        {/* EditTask form */}
                        <div style={{marginBottom: '1rem'}}>
                            <h3>Edit Task</h3>
                        </div>
                        <EditTask task={task} onSave={handleEditSave} onCancel={handleEditCancel} />
                    </div>
                ) : (
                    <>
                        <div className="taskInfo">
                            <div className="taskImage">
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
                            <div className="taskDetails">
                                <h2>{task.title}</h2>
                                <p className="taskDescription">{task.description}</p>
                                <div className="taskMeta">
                                    <span className="budget">Budget: NPR {task.budget}</span>
                                    <span className="category">Category: {task.category}</span>
                                    <span className="status">Status: {task.status}</span>
                                </div>
                                <div className="taskActions">
                                    {isTaskOwner() && (
                                        <div className="taskOwnerActions">
                                            <button className="editBtn" onClick={handleEdit}>Edit Task</button>
                                            <button className="deleteBtn" onClick={handleDelete} title="Delete Task">
                                                <DeleteIcon />
                                            </button>
                                        </div>
                                    )}
                                    {task.status === 'in progress' && (
                                        <button className="completeBtn" onClick={handleMarkCompleted} disabled={updating}>
                                            {updating ? 'Updating...' : 'Mark as Completed'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                        {isTaskOwner() && (
                            <div className="applicantsSection">
                                <h3>Applicants ({applicants.length})</h3>
                                {applicants.length === 0 ? (
                                    <p>No applicants yet</p>
                                ) : (
                                    <div className="applicantsList">
                                        {applicants.map(applicant => (
                                            <div key={applicant._id} className="applicantCard">
                                                <div className="applicantInfo">
                                                    <h4>{applicant.applicant.firstName} {applicant.applicant.lastName}</h4>
                                                    <p className="applicantEmail">{applicant.applicant.email}</p>
                                                    {applicant.message && <p className="applicantMessage">{applicant.message}</p>}
                                                    <p className="applicationStatus">Status: {applicant.status}</p>
                                                </div>
                                                <div className="applicantActions">
                                                    {applicant.status === 'pending' ? (
                                                        <>
                                                            <button 
                                                                className="acceptBtn"
                                                                onClick={() => handleAcceptReject(applicant._id, 'accepted')}
                                                            >
                                                                Accept
                                                            </button>
                                                            <button 
                                                                className="rejectBtn"
                                                                onClick={() => handleAcceptReject(applicant._id, 'rejected')}
                                                            >
                                                                Reject
                                                            </button>
                                                        </>
                                                    ) : applicant.status === 'accepted' ? (
                                                        <button className="acceptedBtn" disabled>
                                                            Accepted
                                                        </button>
                                                    ) : (
                                                        <button className="rejectedBtn" disabled>
                                                            Rejected
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
