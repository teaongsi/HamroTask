import { Card, TextField, Button } from "@mui/material";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import "../styles/register.css";

export default function Register() {
    return (
        <div className="registerContainer">
            <Card className="registerCard">
                <img src={logo} alt="logo" className="logo" />
                <h2 className="headingText">Create Account</h2>
                <form className="loginForm">
                    <TextField className="inputField" label="First Name" />
                    <TextField className="inputField" label="Last Name" />
                    <TextField className="inputField" label="Email" />
                    <TextField className="inputField" label="Password" type="password" />
                    <TextField className="inputField" label="Confirm Password" type="password" />
                    <Button variant="contained" fullWidth className="registerButton">Register</Button>
                </form>
                <p className="loginText">Already have an account?</p>
                <Link to ="/login" className="loginLink">Login</Link>
            </Card>
        </div>
    )
}