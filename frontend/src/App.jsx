import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import Login from './components/Login'
import Contact from './components/Contact';
import About from './components/About';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import EditProfile from './components/EditProfile';
import CreateTask from './components/CreateTask';
import TaskDetails from './components/TaskDetails';
import api from "./api/axios"

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/api/auth/status");
        if (data.loggedIn) setUser(data.user);
      } catch {}
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:'100vh'}}><span>Loading...</span></div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={
          user ? <Navigate to="/dashboard" /> : <Login setUser={setUser} />
        } />
        <Route path="/register" element={
          <Register />
        } />
        <Route path="/dashboard" element={
          user ? <Dashboard /> : <Navigate to="/login" />
        } />
        <Route path="/create-task" element={
          user ? <CreateTask /> : <Navigate to="/login" />
        } />
        <Route path="/task/:taskId" element={
          user ? <TaskDetails /> : <Navigate to="/login" />
        } />
        <Route path="/profile" element={
          user ? <Profile /> : <Navigate to="/login" />
        } />
        <Route path="/editprofile" element={
          user ? <EditProfile /> : <Navigate to="/login" />
        } />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
      </Routes>
    </BrowserRouter>
  );
}
