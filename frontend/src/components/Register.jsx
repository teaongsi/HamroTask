import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import api from "../api/axios"
import logo from "../assets/logo.png";
import "../styles/register.css";

export default function Register() {
    const navigate = useNavigate();

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
            await api.post("/api/auth/register", input, { withCredentials: true });
            navigate('/login');
        } catch (error) {
            console.error(error.response?.data);
            alert(error.response?.data?.message || "Something went wrong");
        }
    };

  return (
    <div className="registerContainer">
      <div className="registerCard">
        <img src={logo} alt="logo" className="logo" />
        <form className="registerForm" onSubmit={handleSubmit}>
          <input
            value={input.firstName}
            onChange={handleChange}
            name="firstName"
            className="inputField"
            placeholder="First Name"
          />
          <input
            value={input.lastName}
            onChange={handleChange}
            name="lastName"
            className="inputField"
            placeholder="Last Name"
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
          <input
            value={input.email}
            onChange={handleChange}
            name="email"
            className="inputField"
            placeholder="Email"
            type="email"
          />
          <input
            value={input.password}
            onChange={handleChange}
            name="password"
            className="inputField"
            placeholder="Password"
            type="password"
          />
          <input
            value={input.confirmPassword}
            onChange={handleChange}
            name="confirmPassword"
            className="inputField"
            placeholder="Confirm Password"
            type="password"
          />
          <button type="submit" className="registerButton">
            Register
          </button>
        </form>
        <p className="loginText">Already have an account?</p>
        <Link to="/login" className="loginLink">Login</Link>
      </div>
    </div>
  );
}