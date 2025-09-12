import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SearchIcon from '@mui/icons-material/Search';
import api from "../api/axios";

export default function ClientDashboard() {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");

    return (
        <div className="clientDashboard">
            <div className="searchSection">
                <div className="searchBar">
                    <input
                        type="text"
                        placeholder="Search tasks..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                    <div className="searchIcon"><SearchIcon /></div>
                </div>
            </div>
            <div className="tasksSection">
                <h3>Posted Tasks</h3>
                <div className="tasksGrid">
                </div>
            </div>
            <button className="addTaskButton" onClick={handleAddTask}>
                + Add
            </button>
        </div>
    );
}