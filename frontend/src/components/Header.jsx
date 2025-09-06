import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";
import logo from "../assets/logo.png";
import "../styles/header.css";

export default function Header() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const { data } = await api.get("/api/auth/status");
                if (data.loggedIn) setUser(data.user);
            } catch {}
        })();
    }, []);

    return (
        <header className="header">
            <div className="headerContent">
                <Link to="/">
                    <img src={logo} alt="logo" className="headerLogo" />
                </Link>
                <nav className="headerNav">
                    <Link to="/dashboard" className="navLink">Home</Link>
                    <Link to="/about" className="navLink">About</Link>
                    <Link to="/contact" className="navLink">Contact Us</Link>
                    <Link to="/profile">
                    <div className="userAvatar">
                        {user?.profilePicture ? (
                            <img
                                src={
                                    user.profilePicture.startsWith('/uploads/')
                                        ? `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}${user.profilePicture}`
                                        : user.profilePicture
                                }
                                alt="Profile"
                                className="avatarImage"
                                onError={e => {
                                    event.target.onerror = null;
                                    event.target.src = logo;
                                }}
                            />
                        ) : (
                            <div className="avatarPlaceholder"></div>
                        )}
                    </div>
                    </Link>
                </nav>
            </div>
        </header>
    );
}