import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import AdminDashboard from "./AdminDashboard";
import "./App.css";

// 🔥 Protected Route
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
}

function App() {
  const token = localStorage.getItem("token");

  return (
    <Router>
      {/* 🔥 NAVBAR */}
      <nav className="navbar">
        <h2>My App</h2>
        <div>
          <Link to="/">Home</Link>

          {!token && <Link to="/login">Login</Link>}
          {token && <Link to="/admin">Dashboard</Link>}
          {token && <Link to="/logout">Logout</Link>}
        </div>
      </nav>

      {/* 🔥 ROUTES */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* 🔐 Protected */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* 🔥 Logout Route */}
        <Route
          path="/logout"
          element={
            (() => {
              localStorage.removeItem("token");
              window.location.href = "/login";
            })()
          }
        />
      </Routes>
    </Router>
  );
}

export default App;