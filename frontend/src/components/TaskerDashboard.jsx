import { useEffect, useMemo, useState } from "react";
import SearchIcon from '@mui/icons-material/Search';
import api from "../api/axios";

export default function TaskerDashboard() {
    const [search, setSearch] = useState("");

    return (
        <div className="taskerDashboard">
            <div className="searchRow">
                <div className="bigSearch">
                    <input 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search tasks..." 
                    />
                    <div className="searchIcon"><SearchIcon /></div>
                </div>
                <div className="categoryRow">
                    <button className="categoryChip">Categories</button>
                    <button className="categoryChip">Categories</button>
                    <button className="categoryChip">Categories</button>
                    <button className="categoryChip">Categories</button>
                    <button className="categoryChip">Categories</button>
                    <button className="categoryChip">Categories</button>
                    <button className="categoryChip">Categories</button>
                    <button className="categoryChip">Categories</button>
                    <button className="categoryChip">Categories</button>
                    <button className="categoryChip">Categories</button>
                    <button className="categoryChip">Categories</button>
                    <button className="categoryChip">Categories</button>
                    <button className="categoryChip">Categories</button>
                </div>
            </div>
            <h3>Available Tasks</h3>

            <div className="tasksGrid">
            </div>
        </div>
    );
}