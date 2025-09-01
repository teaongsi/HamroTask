import { Card, TextField, Button } from "@mui/material";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import "../styles/login.css";

export default function Login() {
    return (
        <div className="loginContainer">
            <Card className="loginCard">
                <img src={logo} alt="logo" className="logo" />
                <h2 className="headingText">Welcome</h2>
                <form className="loginForm">
                    <TextField className="inputField" label="Email" />
                    <TextField className="inputField" label="Password" type="password" />
                    <Button variant="contained" fullWidth className="loginButton">Login</Button>
                </form>
                <p className="registerText">Don't have an account yet?</p>
                <Link to ="/register" className="registerLink">Register</Link>
            </Card>
        </div>
    )
}