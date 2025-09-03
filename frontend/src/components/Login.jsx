import { Card, TextField, Button } from "@mui/material";
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
            
            console.log(res.data);

            localStorage.setItem('userData', JSON.stringify({
                user: res.data.user,
                loginTime: new Date().toISOString()
            }));
            
            setUser(res.data.user);
            const r = res.data.user.role;    
            if(r === "client") {
                navigate('/dashboard/client');
            } else if(r === "tasker") {
                navigate('/dashboard/tasker');
            } else if(r === "admin") {
                navigate('/dashboard/admin');
            } else {
                navigate('unauthorized');
            }
        } catch (error) {
            console.error(error.response?.data);
            alert(error.response?.data?.message || "Something went wrong");
        }
    };

    return (
        <div className="loginContainer">
            <Card className="loginCard">
                <img src={logo} alt="logo" className="logo" />
                <h2 className="headingText">Welcome Back</h2>
                <form onSubmit={handleSubmit} className="loginForm">
                    <TextField value={input.email} onChange={handleChange} name="email" className="inputField" label="Email" />
                    <TextField value={input.password} onChange={handleChange} name="password"className="inputField" label="Password" type="password" />
                    <Button type="submit" className="loginButton">Login</Button>
                </form>
                <p className="registerText">Don't have an account yet?</p>
                <Link to ="/register" className="registerLink">Register</Link>
            </Card>
        </div>
    )
}