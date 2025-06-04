import React, { useState, useEffect } from "react";
import axios from "axios";
import '../css/OverallStyle.css';
import { FaArrowCircleLeft } from 'react-icons/fa';
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation } from "react-router-dom";
// Toastify custom style
const toastStyle = {
  background: 'linear-gradient(to right, #a8edea, #fed6e3)',
  color: '#333',
  borderRadius: '10px',
  fontWeight: 'bold',
};

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);
   const location = useLocation();
  const readOnly = location.state?.readOnly || false;
  const [editData, setEditData] = useState({
    name: "",
    email: "",
    role: "",
    graduation_year: "",
    course: "",
  });

  // For confirmation modal
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/users");
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Trigger confirmation modal instead of window.confirm
  const handleDeleteClick = (id) => {
    setDeleteUserId(id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/users/${deleteUserId}`);
      setShowConfirm(false);
      setDeleteUserId(null);
      fetchUsers();
      toast.success("User deleted successfully!", {
        position: "top-center",
        style: toastStyle,
      });
    } catch {
      setShowConfirm(false);
      setDeleteUserId(null);
      toast.error("Error deleting user!", {
        position: "top-center",
        style: toastStyle,
      });
    }
  };

  const cancelDelete = () => {
    setShowConfirm(false);
    setDeleteUserId(null);
  };

  const handleEdit = (user) => {
    setEditId(user.user_id);
    setEditData({
      name: user.name || "",
      email: user.email || "",
      role: user.role || "",
      graduation_year: user.graduation_year || "",
      course: user.course || "",
    });
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleEditSave = async (id) => {
    try {
      await axios.put(`http://localhost:5000/users/${id}`, editData);
      setEditId(null);
      fetchUsers();
      toast.success("User updated successfully!", {
        position: "top-center",
        style: toastStyle,
      });
    } catch {
      toast.error("Error updating user!", {
        position: "top-center",
        style: toastStyle,
      });
    }
  };

  const filteredUsers = users.filter((user) =>
    user.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="userlist-container">
      <ToastContainer />
      
      <Link to={'/alumnidashboard'}>
        <button><FaArrowCircleLeft /> Back</button>
      </Link>
      <h2>Users List</h2>

      <input
        type="text"
        placeholder="Search by name..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ marginBottom: "1rem", padding: "0.5rem", width: "250px" }}
      />

      <table className="userlist-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Profile</th>
            <th>Email</th>
            <th>Role</th>
            <th>Graduation Year</th>
            <th>Course</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length === 0 && (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>No users found.</td>
            </tr>
          )}
          {filteredUsers.map((user) => (
            <tr key={user.user_id}>
              {editId === user.user_id ? (
                <>
                  <td><input name="name" value={editData.name} onChange={handleEditChange} /></td>
                  <td><input name="email" value={editData.email} onChange={handleEditChange} /></td>
                  <td><input name="role" value={editData.role} onChange={handleEditChange} /></td>
                  <td><input name="graduation_year" value={editData.graduation_year} onChange={handleEditChange} /></td>
                  <td><input name="course" value={editData.course} onChange={handleEditChange} /></td>
                  <td>
                    <button className="userlist-delete" onClick={() => handleEditSave(user.user_id)}>Save</button>
                    <button className="userlist-delete" style={{ background: "#aaa" }} onClick={() => setEditId(null)}>Cancel</button>
                  </td>
                </>
              ) : (
                <>
                  <td data-label="Name">{user.name || "N/A"}</td>
                  <td data-label="Profile">
                    {user.photo ? (
                      <img
                        src={`http://localhost:5000/uploads/${user.photo}`}
                        alt="Profile"
                        className="profile-img"
                      />
                    ) : (
                      <span style={{ fontStyle: 'italic', color: '#777' }}>No Image</span>
                    )}
                  </td>

                  <td data-label="Email">{user.email}</td>
                  <td data-label="Role">{user.role}</td>
                  <td data-label="Graduation Year">{user.graduation_year || "N/A"}</td>
                  <td data-label="Course">{user.course || "N/A"}</td>
                  <td data-label="Action" className="action-buttons">
                    <button
                      className="userlist-delete"
                      style={{ background: "#3a7afe" }}
                      onClick={() => handleEdit(user)}
                    >
                      Edit
                    </button>
                    <button
                      className="userlist-delete"
                      onClick={() => handleDeleteClick(user.user_id)}
                    >
                      Delete
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h3>Are you sure you want to delete this user?</h3>
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

export default UserList;
