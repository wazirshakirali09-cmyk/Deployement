import React, { useState } from "react";
import "./App.css";

function Login() {
  const [data, setData] = useState({ username: "", password: "" });

  const login = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/api/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (result.token) {
      localStorage.setItem("token", result.token);
      alert("Login Success");
      window.location.href = "/admin";
    } else {
      alert("Login Failed");
    }
  };

  return (
    <div className="container">
      <h1>Admin Login</h1>

      <form onSubmit={login}>
        <input
          type="text"
          placeholder="Username"
          onChange={(e) =>
            setData({ ...data, username: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) =>
            setData({ ...data, password: e.target.value })
          }
        />

        <button>Login</button>
      </form>
    </div>
  );
}

export default Login;