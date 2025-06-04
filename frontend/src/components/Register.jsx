import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/OverallStyle.css";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const [ setUsers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("alumni");
  const [graduationYear, setGraduationYear] = useState("");
  const [course, setCourse] = useState("");
  const [currentJob, setCurrentJob] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  },);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/users");
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (
      !name ||
      !email ||
      !password ||
      !graduationYear ||
      !course ||
      !currentJob
    ) {
      toast.error("All fields are required!", {
        position: "top-center",
        autoClose: 2000,
      });
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/register", {
        name,
        email,
        password,
        role,
        graduation_year: graduationYear,
        course,
        current_job: currentJob,
      });

      toast.success(res.data.message, {
        position: "top-center",
        autoClose: 2000,
      });

      // Clear form
      setName("");
      setEmail("");
      setPassword("");
      setGraduationYear("");
      setCourse("");
      setCurrentJob("");

      fetchUsers();

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      toast.error(error.response?.data?.error || "Registration failed", {
        position: "top-center",
        autoClose: 2000,
      });
    }
  };

  return (
    <div className="reg-bg">
      <ToastContainer />
      <div className="reg-container">
        <img
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80"
          alt="Alumni"
          className="reg-logo"
        />
        <h2 className="reg-title">User Registration</h2>
        <form className="reg-form" onSubmit={handleRegister}>
          <input
            type="text"
            className="reg-input"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            className="reg-input"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            className="reg-input"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="number"
            className="reg-input"
            placeholder="Graduation Year"
            value={graduationYear}
            onChange={(e) => setGraduationYear(e.target.value)}
            required
          />
          <input
            type="text"
            className="reg-input"
            placeholder="Course"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            required
          />
          <input
            type="text"
            className="reg-input"
            placeholder="Current Job"
            value={currentJob}
            onChange={(e) => setCurrentJob(e.target.value)}
            required
          />
          <select
            className="reg-select"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="alumni">Alumni</option>
            <option value="admin">Admin</option>
          </select>
          <button className="reg-btn" type="submit">
            Register
          </button>
        </form>
        <Link to="/login" className="reg-login-link">
          Already have an account? Login here
        </Link>
      </div>
    </div>
  );
};

export default Register;
