import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './components/Login'
import Register from './components/Register';

function App() {
  return (
    <Routes>
      <Route path="/" exact element={<Login />} />
      <Route path="/login" exact element={<Login />} />
      <Route path="/register" exact element={<Register />} />
    </Routes>
  );
}

export default App
