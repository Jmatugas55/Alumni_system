import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../css/OverallStyle.css";

const CompanyOwnerDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [jobForm, setJobForm] = useState({ title: "", location: "", description: "" });
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (profile?.user_id) {
      fetchMyJobs();
    }
  }, [profile]);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");

      const decoded = jwtDecode(token);
      const userId = decoded.userId;

      const res = await axios.get("http://localhost:5000/users");
      const user = res.data.find((u) => u.user_id === userId);
      setProfile(user);
    } catch (error) {
      console.error("Error fetching company profile", error);
    }
  };

  const fetchMyJobs = async () => {
    try {
      const res = await axios.get("http://localhost:5000/jobs");
      const userJobs = res.data.filter(job => job.posted_by === profile.user_id);
      setJobs(userJobs);
    } catch (error) {
      console.error("Error fetching jobs", error);
    }
  };

  const handleChange = (e) => {
    setJobForm({ ...jobForm, [e.target.name]: e.target.value });
  };

  const handleJobSubmit = async (e) => {
    e.preventDefault();
    try {
      const jobData = {
        ...jobForm,
        posted_by: profile.user_id,
        company_name: profile.company_name || "Unknown"
      };
      await axios.post("http://localhost:5000/jobs", jobData);
      alert("Job posted successfully!");
      setJobForm({ title: "", location: "", description: "" });
      fetchMyJobs();
    } catch (error) {
      console.error("Error posting job", error);
      alert("Failed to post job");
    }
  };

  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    return parts.length === 1 ? parts[0].substring(0, 2).toUpperCase() : (parts[0][0] + parts[1][0]).toUpperCase();
  };

  const confirmLogout = () => {
    const ToastContent = ({ closeToast }) => (
      <div>
        <p>Are you sure you want to logout?</p>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              closeToast();
              navigate("/");
            }}
            style={{
              backgroundColor: "#4CAF50",
              border: "none",
              color: "white",
              padding: "5px 12px",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Yes
          </button>
          <button
            onClick={() => closeToast()}
            style={{
              backgroundColor: "#f44336",
              border: "none",
              color: "white",
              padding: "5px 12px",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            No
          </button>
        </div>
      </div>
    );

    toast.info(<ToastContent />, {
      position: "top-center",
      autoClose: false,
      closeOnClick: false,
      closeButton: false,
      draggable: false,
      pauseOnHover: true,
    });
  };

  return (
    <div className="company_dashboard_layout">
      <ToastContainer />
      <aside className="company_dashboard_sidebar">
        <h2 className="company_dashboard_sidebar_title">Company Dashboard</h2>
        <div className="company_dashboard_profile">
          <div className="company_dashboard_profile_initials">
            {getInitials(profile?.name)}
          </div>
          <span className="company_dashboard_profile_name">
            {profile?.name || "Loading..."}
          </span>
        </div>
        <ul className="company_dashboard_nav">
          <li className={location.pathname === "/companydashboard" ? "company_dashboard_nav_item active" : "company_dashboard_nav_item"}>
            <Link to="/companydashboard">Dashboard</Link>
          </li>
           <button
                onClick={confirmLogout}
                className="company_dashboard_logout_button"
                aria-label="Logout"
                >
                Logout
                </button>
        </ul>
      </aside>

      <main className="company_dashboard_main">
        <h1 className="company_dashboard_heading">
          Welcome, {profile?.name || "Company Owner"}!
        </h1>

        <form onSubmit={handleJobSubmit} className="company_dashboard_job_form">
          <h2>Post a New Job</h2>
          <input
            type="text"
            name="title"
            placeholder="Job Title"
            value={jobForm.title}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={jobForm.location}
            onChange={handleChange}
            required
          />
          <textarea
            name="description"
            placeholder="Job Description"
            value={jobForm.description}
            onChange={handleChange}
            required
          />
          <button type="submit">Post Job</button>
        </form>

        <section className="company_dashboard_job_list">
          <h2>My Posted Jobs</h2>
          <ul>
            {jobs.length === 0 && <li>No jobs posted yet.</li>}
            {jobs.map((job) => (
              <li key={job.job_id}>
                <strong>{job.title}</strong> - {job.location}
                <br />
                <span>{job.description}</span>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
};

export default CompanyOwnerDashboard;
