import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function CreateProfile({ user }) {
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    navigate("/dashboard");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Profile</h2>
      <input type="text" placeholder="Name" required />
      <button type="submit">Save</button>
    </form>
  );
}