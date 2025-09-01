import { Card, TextField, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import logo from "../assets/logo.png";
import "../styles/login.css";

export default function Login() {
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
            const res = await axios.post("http://localhost:5000/api/auth/login", input);
            alert(res.data.message);
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