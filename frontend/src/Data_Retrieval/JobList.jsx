import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaArrowCircleLeft } from 'react-icons/fa';
import '../css/OverallStyle.css';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const toastStyle = {
  background: 'linear-gradient(to right, #a8edea, #fed6e3)',
  color: '#333',
  borderRadius: '10px',
  fontWeight: 'bold',
};

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({
    title: "",
    location: "",
    salary: "",
  });

  // For delete confirmation modal
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteJobId, setDeleteJobId] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await axios.get("http://localhost:5000/jobs");
      setJobs(res.data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  // Open delete confirmation modal
  const handleDeleteClick = (id) => {
    setDeleteJobId(id);
    setShowConfirm(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/jobs/${deleteJobId}`);
      toast.success("Job deleted successfully!", { position: "top-center", style: toastStyle });
      setShowConfirm(false);
      setDeleteJobId(null);
      fetchJobs();
    } catch  {
      toast.error("Error deleting job!", { position: "top-center", style: toastStyle });
      setShowConfirm(false);
      setDeleteJobId(null);
    }
  };

  // Cancel delete
  const cancelDelete = () => {
    setShowConfirm(false);
    setDeleteJobId(null);
  };

  // Start editing a job
  const handleEdit = (job) => {
    setEditId(job.job_id);
    setEditData({
      title: job.title || "",
      location: job.location || "",
      salary: job.salary || "",
    });
  };

  // Handle input changes in edit form
  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  // Save edited job data
  const handleEditSave = async (id) => {
    try {
      await axios.put(`http://localhost:5000/jobs/${id}`, editData);
      toast.success("Job updated successfully!", { position: "top-center", style: toastStyle });
      setEditId(null);
      fetchJobs();
    } catch  {
      toast.error("Error updating job!", { position: "top-center", style: toastStyle });
    }
  };

  // Cancel editing
  const handleEditCancel = () => {
    setEditId(null);
  };

  return (
    <div className="userlist-container">
      <ToastContainer />

      <Link to="/alumnidashboard">
        <button><FaArrowCircleLeft /> Back</button>
      </Link>
      <h2>Job Listings</h2>

      <table className="userlist-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Location</th>
            <th>Salary</th>
         
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {jobs.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>No jobs available.</td>
            </tr>
          ) : (
            jobs.map((job) => (
              <tr key={job.job_id}>
                {editId === job.job_id ? (
                  <>
                    <td><input name="title" value={editData.title} onChange={handleEditChange} /></td>
                    <td><input name="location" value={editData.location} onChange={handleEditChange} /></td>
                    <td><input name="salary" value={editData.salary} onChange={handleEditChange} type="number" min="0" /></td>
                    <td>{job.user_id || "N/A"}</td>
                    <td>
                      <button
                        className="userlist-delete"
                        onClick={() => handleEditSave(job.job_id)}
                        style={{ backgroundColor: "#3a7afe", marginRight: "0.5rem" }}
                      >
                        Save
                      </button>
                      <button
                        className="userlist-delete"
                        onClick={handleEditCancel}
                        style={{ backgroundColor: "#aaa" }}
                      >
                        Cancel
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{job.title}</td>
                    <td>{job.location}</td>
                    <td>${job.salary}</td>
                    
                    <td>
                      <button
                        className="userlist-delete"
                        onClick={() => handleEdit(job)}
                        style={{ backgroundColor: "#3a7afe", marginRight: "0.5rem" }}
                      >
                        Edit
                      </button>
                      <button
                        className="userlist-delete"
                        onClick={() => handleDeleteClick(job.job_id)}
                      >
                        Delete
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Delete confirmation modal */}
      {showConfirm && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h3>Are you sure you want to delete this job?</h3>
            <div style={styles.buttonGroup}>
              <button style={{ ...styles.button, ...styles.confirm }} onClick={confirmDelete}>
                Confirm
              </button>
              <button style={{ ...styles.button, ...styles.cancel }} onClick={cancelDelete}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  modal: {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '12px',
    width: '320px',
    boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
    textAlign: 'center',
  },
  buttonGroup: {
    marginTop: '1.5rem',
    display: 'flex',
    justifyContent: 'space-around',
  },
  button: {
    padding: '0.5rem 1.5rem',
    fontSize: '1rem',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold',
    minWidth: '100px',
  },
  confirm: {
    backgroundColor: '#e74c3c',
    color: '#fff',
  },
  cancel: {
    backgroundColor: '#95a5a6',
    color: '#fff',
  },
};

export default JobList;
