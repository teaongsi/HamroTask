import { Card, TextField, Button } from "@mui/material";
import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import "../styles/register.css";

export default function Register() {
    const [input, setInput] = useState({
        firstName: "",
        lastName: "",
        role: "",
        email: "",
        password: "",
        confirmPassword: ""
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
            const res = await axios.post("http://localhost:5000/api/auth/register", input);
            alert(res.data.message);
        } catch (error) {
            console.error(error.response?.data);
            alert(error.response?.data?.message || "Something went wrong");
        }
    };

  return (
    <div className="registerContainer">
      <Card className="registerCard">
        <img src={logo} alt="logo" className="logo" />
        <h2 className="headingText">Create Account</h2>
        <form className="loginForm" onSubmit={handleSubmit}>
          <TextField
            value={input.firstName}
            onChange={handleChange}
            name="firstName"
            className="inputField"
            label="First Name"
          />
          <TextField
            value={input.lastName}
            onChange={handleChange}
            name="lastName"
            className="inputField"
            label="Last Name"
          />
          <select
            value={input.role}
            onChange={handleChange}
            name="role"
            className="roleField"
          >
            <option value="">Select Role</option>
            <option value="client">Client</option>
            <option value="tasker">Tasker</option>
          </select>
          <TextField
            value={input.email}
            onChange={handleChange}
            name="email"
            className="inputField"
            label="Email"
          />
          <TextField
            value={input.password}
            onChange={handleChange}
            name="password"
            className="inputField"
            label="Password"
            type="password"
          />
          <TextField
            value={input.confirmPassword}
            onChange={handleChange}
            name="confirmPassword"
            className="inputField"
            label="Confirm Password"
            type="password"
          />
          <Button type="submit" className="registerButton">
            Register
          </Button>
        </form>
        <p className="loginText">Already have an account?</p>
        <Link to="/login" className="loginLink">
          Login
        </Link>
      </Card>
    </div>
  );
}