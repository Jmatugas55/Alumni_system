import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const notifySuccess = () => {
    toast.success("Login successful!", {
      position: "top-center",
      autoClose: 2000,
      pauseOnHover: true,
      closeOnClick: true,
    });
  };

  const notifyError = (message) => {
    toast.error(message, {
      position: "top-center",
      autoClose: 3000,
      pauseOnHover: true,
      closeOnClick: true,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/login", { email, password });
      localStorage.setItem("token", res.data.token);

      notifySuccess();

      // Small delay so user can see toast before redirect
      setTimeout(() => {
        if (res.data.role === "admin") {
          navigate("/alumnidashboard");
        } else {
          navigate("/userdashboard");
        }
      }, 2100);
    } catch (error) {
      notifyError(error.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="login-bg">
      <ToastContainer />
      <div className="login-container">
        <button 
          style={{ marginTop: "20px", marginLeft: "-4px" }} 
          className="btn btn-outline" 
          onClick={() => navigate("/")}
        >
          Home
        </button>

        <div style={{ marginTop: "20px" }} className="login-header">
          <img
            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80"
            alt="Alumni"
            className="login-logo"
          />
          <h2 className="login-title">Alumni Login</h2>
        </div>

        <form className="login-form" onSubmit={handleLogin}>
          <input
            type="email"
            className="login-input"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            className="login-input"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="login-btn" type="submit">Login</button>
        </form>

        <Link to="/register">Don't have an account? Register here:</Link>
      </div>
    </div>
  );
};

export default Login;
