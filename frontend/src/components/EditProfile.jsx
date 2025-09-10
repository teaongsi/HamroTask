import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from './Header';
import Footer from './Footer';
import logo from "../assets/logo.png";
import "../styles/editProfile.css";
import api from "../api/axios";

export default function EditProfile() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    bio: "",
    skills: "",
    profilePicture: "",
    location: ""
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const ls = localStorage.getItem('userData');
        if (ls) {
          try {
            const parsed = JSON.parse(ls);
            const u = parsed?.user;
            if (u) {
              setForm({
                firstName: u.firstName || "",
                lastName: u.lastName || "",
                bio: u.bio || "",
                skills: Array.isArray(u.skills) ? u.skills.join(', ') : "",
                profilePicture: u.profilePicture || "",
                location: u.location || ""
              });
            }
          } catch {}
        }

        let me = null;
        try {
          const { data } = await api.get('/api/users/me');
          me = data;
        } catch {}

        if (!me) {
          try {
            const { data } = await api.get('/api/auth/status');
            if (data?.loggedIn) me = data.user;
          } catch {}
        }

        if (me) {
          setForm({
            firstName: me.firstName || "",
            lastName: me.lastName || "",
            bio: me.bio || "",
            skills: Array.isArray(me.skills) ? me.skills.join(', ') : "",
            profilePicture: me.profilePicture || "",
            location: me.location || ""
          });
        }
      } catch (e) {
        console.error('Load profile failed', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profilePicture" && files && files[0]) {
      setImageFile(files[0]);
      setForm({ ...form, profilePicture: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('firstName', form.firstName);
      formData.append('lastName', form.lastName);
      formData.append('bio', form.bio);
      formData.append('location', form.location);
      if (form.skills)
        formData.append('skills', JSON.stringify(form.skills.split(',').map((s) => s.trim()).filter(Boolean)));
      if (imageFile) {
        formData.append('profilePicture', imageFile);
      }
      const { data } = await api.put('/api/users/me', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setForm(f => ({
        ...f,
        profilePicture: data.user.profilePicture || ''
      }));
      localStorage.setItem('userData', JSON.stringify({ user: data.user }));
      navigate('/profile');
    } catch (e) {
      console.error('Update failed', e);
      alert('Failed to update profile');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="editProfileWrapper">
      <Header />
      <main className="editProfileContent">
        <form onSubmit={handleSubmit} className="editProfileForm">
          <img src={logo} alt="logo" className="logo" />
          <h2>Edit Profile</h2>

          <div className="formGroup">
            <label>First Name</label>
            <input
              type="text"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
            />
          </div>

          <div className="formGroup">
            <label>Last Name</label>
            <input
              type="text"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
            />
          </div>

          <div className="formGroup">
            <label>Bio</label>
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="formGroup">
            <label>Skills (comma separated)</label>
            <input
              type="text"
              name="skills"
              value={form.skills}
              onChange={handleChange}
            />
          </div>

          <div className="formGroup">
            <label>Location</label>
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
            />
          </div>

          <div className="formGroup">
            <label>Profile Picture</label>
            <input
              type="file"
              accept="image/*"
              name="profilePicture"
              onChange={handleChange}
            />
            {form.profilePicture && (
              <img
                src={typeof form.profilePicture === 'string'
                  ? form.profilePicture.startsWith('/uploads/')
                    ? `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}${form.profilePicture}`
                    : form.profilePicture
                  : URL.createObjectURL(form.profilePicture)}
                alt="Preview"
                className="previewImage"
              />
            )}
          </div>

          <button type="submit" className="saveButton">
            Save Changes
          </button>
        </form>
      </main>
      <Footer />
    </div>
  );
}