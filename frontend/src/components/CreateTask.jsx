import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from './Header';
import Footer from './Footer';
import api from "../api/axios";
import "../styles/createTask.css";

export default function CreateTask() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        title: "",
        description: "",
        category: "",
        budget: "",
        location: ""
    });
    const [image, setImage] = useState(null);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!image) {
            alert('Please upload an image for the task.');
            return;
        }
        try {
            const formData = new FormData();
            Object.entries(form).forEach(([key, value]) => {
                if (key === 'budget') {
                    formData.append('budget', parseFloat(value));
                } else {
                    formData.append(key, value);
                }
            });
            formData.append('image', image);
            await api.post('/api/tasks', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            navigate('/dashboard');
        } catch (error) {
            console.error('Failed to create task:', error);
            alert('Failed to create task');
        }
    };

    return (
        <div className="createTaskWrapper">
            <Header />
            <div className="createTaskContent">
                <form onSubmit={handleSubmit} className="createTaskForm" encType="multipart/form-data">
                    <h2>Create Task</h2>
                    <div className="formGroup">
                        <input
                            type="text"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            placeholder="Task Title"
                            required
                        />
                    </div>
                    <div className="formGroup">
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            placeholder="Task Description"
                            required
                        ></textarea>
                    </div>
                    <div className="formGroup">
                        <input
                            type="text"
                            name="category"
                            value={form.category}
                            onChange={handleChange}
                            placeholder="Category"
                            required
                        />
                    </div>
                    <div className="formGroup">
                        <input
                            type="number"
                            name="budget"
                            value={form.budget}
                            onChange={handleChange}
                            placeholder="Budget (NPR)"
                            required
                        />
                    </div>
                    <div className="formGroup">
                        <input
                            type="text"
                            name="location"
                            value={form.location}
                            onChange={handleChange}
                            placeholder="Location (optional)"
                        />
                    </div>
                    <div className="formGroup">
                        <input
                            type="file"
                            name="image"
                            accept="image/*"
                            onChange={handleImageChange}
                            required
                        />
                    </div>
                    <button type="submit" className="createButton">
                        Create
                    </button>
                </form>
            </div>
            <Footer />
        </div>
    );
}
