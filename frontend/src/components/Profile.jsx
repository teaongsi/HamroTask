import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import api from "../api/axios";
import CompactTaskCard from "./CompactTaskCard";
import "../styles/profile.css";

export default function Profile() {
  const logout = async () => {
    try {
      await api.post("/api/auth/logout", {}, { withCredentials: true });
    } catch (error) {
      console.error("Error during logout:", error);
    }
    setUser(null);
    window.location.href = "/login";
  };
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [assignedLoading, setAssignedLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  useEffect(() => {
    if (user && user.role === 'client') {
      fetchMyTasks();
    }
    if (user && user.role === 'tasker') {
      fetchAssignedTasks();
    }
    if (user && user.role === 'admin' && window.location.pathname === '/profile') {
      window.location.href = '/admin';
    }
  }, [user]);

  const fetchAssignedTasks = async () => {
    setAssignedLoading(true);
    try {
      const { data } = await api.get('/api/tasks/assigned', { withCredentials: true });
      setAssignedTasks(data);
    } catch (error) {
      setAssignedTasks([]);
    } finally {
      setAssignedLoading(false);
    }
  };

  const fetchMyTasks = async () => {
    setTasksLoading(true);
    try {
      const { data } = await api.get('/api/tasks/my', { withCredentials: true });
      setTasks(data);
    } catch (error) {
      setTasks([]);
    } finally {
      setTasksLoading(false);
    }
  };

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
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    navigate("/editprofile");
  };

  if (!user) return <div>Please log in to view profile</div>;
  if (loading) return <div>Loading...</div>;

  return (
    <div className="profileWrapper">
      <Header />
      <div className="profileLayout" style={{display:'flex',flexDirection:'row',height:'100vh'}}>
        <div className="profileSidebar" style={{width:'40%',minWidth:'320px',maxWidth:'500px',display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div className="profileCard">
            <div className="profileImageContainer">
              {user.profilePicture && typeof user.profilePicture === 'string' && !user.profilePicture.startsWith('blob:') ? (
                <img
                  src={
                    user.profilePicture.startsWith('/uploads/')
                      ? `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}${user.profilePicture}`
                      : user.profilePicture
                  }
                  alt="Profile"
                  className="profileImage"
                  onError={e => {
                    e.target.onerror = null;
                    e.target.src = '/assets/logo.png';
                  }}
                />
              ) : (
                <div className="profileImagePlaceholder">
                  Profile pic
                </div>
              )}
            </div>
            <div className="profileInfo">
              <h2>
                {user.firstName} {user.lastName}
              </h2>
              <p className="profileRole">{user.role}</p>
              <p className="profileEmail">{user.email}</p>
              {user.bio && <p className="profileBio">{user.bio}</p>}
              {user.skills?.length > 0 && (
                <div className="profileSkills">
                  <h4>Skills:</h4>
                  <ul>
                    {user.skills.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
              )}
              <button className="editButton" onClick={handleEdit}>
                Edit Profile
              </button>
              <button className="editButton" onClick={logout} style={{marginTop: '12px'}}>
                Logout
              </button>
            </div>
          </div>
        </div>
        <div className="profileMainContent" style={{width:'60%',display:'flex',alignItems:'flex-start',justifyContent:'center',overflowY:'auto'}}>
          <div className="mainCard" style={{width:'100%',marginTop:'24px'}}>
            {user.role === 'client' && (
              <div className="profileTasks">
                <h3>Posted Tasks</h3>
                {tasksLoading ? (
                  <p>Loading tasks...</p>
                ) : tasks.length === 0 ? (
                  <p>No tasks posted yet.</p>
                ) : (
                  <div className="profileTaskGrid">
                    {tasks.map(task => (
                      <CompactTaskCard
                        key={task._id}
                        task={task}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
            {user.role === 'tasker' && (
              <div className="profileTasks">
                <h3>My Completed & In-Progress Tasks</h3>
                {assignedLoading ? (
                  <p>Loading...</p>
                ) : assignedTasks.length === 0 ? (
                  <p>No completed or in-progress tasks yet.</p>
                ) : (
                  <div className="profileTaskGrid">
                    {assignedTasks.map(task => (
                      <CompactTaskCard
                        key={task._id}
                        task={task}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}