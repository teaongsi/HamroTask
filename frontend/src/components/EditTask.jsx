import { useState } from "react";
import api from "../api/axios";
import "../styles/editTask.css";

export default function EditTask({ task, onSave, onCancel }) {
  const [form, setForm] = useState({
    title: task.title || "",
    description: task.description || "",
    budget: task.budget || "",
    category: task.category || "",
    location: task.location || "",
    image: task.image || ""
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    const { name, value, files } = e.target;
    if (name === "image" && files && files[0]) {
      setImageFile(files[0]);
      // Only use blob URL for preview, never persist
      setForm({ ...form, image: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('description', form.description);
      formData.append('budget', parseFloat(form.budget));
      formData.append('category', form.category);
      formData.append('location', form.location);
      if (imageFile) {
        formData.append('image', imageFile);
      }
      await api.put(`/api/tasks/${task._id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      onSave();
    } catch {
      alert("Failed to update task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="editTaskWrapper">
      <main className="editTaskContent">
        <form className="editTaskForm" onSubmit={handleSubmit} encType="multipart/form-data">
          <h2>Edit Task</h2>
          <div className="formGroup">
            <label>Title</label>
            <input name="title" value={form.title} onChange={handleChange} required />
          </div>
          <div className="formGroup">
            <label>Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} required />
          </div>
          <div className="formGroup">
            <label>Budget</label>
            <input name="budget" value={form.budget} onChange={handleChange} required type="number" min="0" />
          </div>
          <div className="formGroup">
            <label>Category</label>
            <input name="category" value={form.category} onChange={handleChange} required />
          </div>
          <div className="formGroup">
            <label>Location</label>
            <input name="location" value={form.location} onChange={handleChange} />
          </div>
          <div className="formGroup">
            <label>Task Image</label>
            <input type="file" name="image" accept="image/*" onChange={handleChange} />
            {form.image && (
              <img
                src={typeof form.image === 'string'
                  ? form.image.startsWith('/uploads/')
                    ? `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}${form.image}`
                    : form.image
                  : URL.createObjectURL(form.image)}
                alt="Preview"
                className="previewImage"
              />
            )}
          </div>
          <div className="editTaskActions">
            <button type="submit" className="saveButton" disabled={loading}>{loading ? "Saving..." : "Save"}</button>
            <button type="button" className="cancelButton" onClick={onCancel}>Cancel</button>
          </div>
        </form>
      </main>
    </div>
  );
}
