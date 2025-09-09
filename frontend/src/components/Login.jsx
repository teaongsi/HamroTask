import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../api/axios";
import logo from "../assets/logo.png";
import "../styles/login.css";

export default function Login({ setUser }) {
    const navigate = useNavigate();
    const [input, setInput] = useState({
        email: "",
        password: "",
    });

    const handleChange = (event) => {
        setInput((prevVal) => ({
            ...prevVal,
            [event.target.name]: event.target.value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const res = await api.post("/api/auth/login", input, { withCredentials: true })
            

            localStorage.setItem('userData', JSON.stringify({
                user: res.data.user,
                loginTime: new Date().toISOString()
            }));

            setUser(res.data.user);
            navigate('/dashboard');
        } catch (error) {
            console.error(error.response?.data);
            alert(error.response?.data?.message || "Something went wrong");
        }
    };

    return (
        <div className="loginContainer">
            <div className="loginCard">
                <img src={logo} alt="logo" className="logo" />
                <form onSubmit={handleSubmit} className="loginForm">
                    <input 
                        type="email" 
                        name="email" 
                        value={input.email} 
                        onChange={handleChange} 
                        className="inputField" 
                        placeholder="Email" 
                        required 
                    />
                    <input 
                        type="password" 
                        name="password" 
                        value={input.password} 
                        onChange={handleChange} 
                        className="inputField" 
                        placeholder="Password" 
                        required 
                    />
                    <button type="submit" className="loginButton">Login</button>
                </form>
                <p className="registerText">Don't have an account yet?</p>
                <Link to="/register" className="registerLink">Register</Link>
            </div>
        </div>
    )
}