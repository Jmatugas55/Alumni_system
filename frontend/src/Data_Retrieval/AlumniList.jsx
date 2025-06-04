import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaArrowCircleLeft } from "react-icons/fa";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AlumniList = () => {
  const [alumni, setAlumni] = useState([]);
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [editData, setEditData] = useState({
  name: "",
  graduation_year: "",
  course: "",
  current_job: "",
  company_id: "",  // <-- Use company_id, not company_name
});


  useEffect(() => {
  fetchAlumni();
  fetchCompanies();
}, []);

    const fetchCompanies = async () => {
    try {
      const response = await axios.get("http://localhost:5000/companies");
      setCompanies(response.data);
    } catch (error) {
      console.error("Error fetching companies:", error);
      toast.error("Failed to load companies.");
    }
  };

  const fetchAlumni = async () => {
    try {
      const response = await axios.get("http://localhost:5000/alumni");
      setAlumni(response.data);
    } catch (error) {
      console.error("Error fetching alumni:", error);
      toast.error("Failed to load alumni list.");
    }
  };

  // Custom Toast confirmation for delete
  const confirmDelete = (id) => {
    const toastId = toast.info(
      ({ closeToast }) => (
        <div>
          <p>Are you sure you want to delete this alumnus?</p>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
            <button
              onClick={async () => {
                try {
                  await axios.delete(`http://localhost:5000/alumni/${id}`);
                  toast.dismiss(toastId);
                  toast.success("Alumnus deleted successfully.");
                  fetchAlumni();
                } catch (error) {
                  toast.dismiss(toastId);
                  toast.error("Failed to delete alumnus.");
                }
              }}
              style={{
                backgroundColor: "#d33",
                color: "white",
                border: "none",
                padding: "5px 10px",
                cursor: "pointer",
                borderRadius: "4px",
              }}
            >
              Confirm
            </button>
            <button
              onClick={() => toast.dismiss(toastId)}
              style={{
                backgroundColor: "#aaa",
                color: "white",
                border: "none",
                padding: "5px 10px",
                cursor: "pointer",
                borderRadius: "4px",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        closeButton: false,
        draggable: false,
      }
    );
  };

  const handleDelete = (id) => {
    confirmDelete(id);
  };

      const handleEdit = (alumnus) => {
        setEditId(alumnus.alumni_id);
        setEditData({
          name: alumnus.name,
          graduation_year: alumnus.graduation_year,
          course: alumnus.course,
          current_job: alumnus.current_job,
          company_id: alumnus.company_id || "",  // <-- Use company_id
        });
      };


  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleEditSave = async (id) => {
    try {
      await axios.put(`http://localhost:5000/alumni/${id}`, editData);
      toast.success("Alumnus updated successfully.");
      setEditId(null);
      fetchAlumni();
    } catch (error) {
      console.error("Error updating alumni:", error);
      toast.error("Failed to update alumnus.");
    }
  };

  const filteredAlumni = alumni.filter((alumnus) =>
    alumnus.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="alumni-list-container">
      <Link to={"/alumnidashboard"}>
        <button>
          {" "}
          <FaArrowCircleLeft />
          Back
        </button>
      </Link>

      <h2>Alumni List</h2>
      <input
        className="alumni-list-search"
        type="text"
        placeholder="Search by name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <ul className="alumni-list-ul">
        {filteredAlumni.map((alumnus) => (
          <li className="alumni-list-li" key={alumnus.alumni_id}>
            {editId === alumnus.alumni_id ? (
              <>
                <input
                  name="name"
                  value={editData.name}
                  onChange={handleEditChange}
                  className="alumni-list-info"
                />
                <input
                  name="graduation_year"
                  value={editData.graduation_year}
                  onChange={handleEditChange}
                  className="alumni-list-info"
                />
                <input
                  name="course"
                  value={editData.course}
                  onChange={handleEditChange}
                  className="alumni-list-info"
                />
                <input
                  name="current_job"
                  value={editData.current_job}
                  onChange={handleEditChange}
                  className="alumni-list-info"
                />
                <input
                  name="company_name"
                  value={editData.company_name}
                  onChange={handleEditChange}
                  className="alumni-list-info"
                />

              <select
                  name="company_id"
                  value={editData.company_id}
                  onChange={handleEditChange}
                  className="alumni-list-info"
                >
                  <option value="">Select Company</option>
                  {companies.map((company) => (
                    <option key={company.company_id} value={company.company_id}>
                      {company.name}
                    </option>
                  ))}
                </select>


                <button
                  className="alumni-list-delete-btn"
                  onClick={() => handleEditSave(alumnus.alumni_id)}
                >
                  Save
                </button>
                <button
                  className="alumni-list-delete-btn"
                  style={{ background: "#aaa" }}
                  onClick={() => setEditId(null)}
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <span className="alumni-list-info">
                  {alumnus.name} ({alumnus.graduation_year}) - {alumnus.course} -{" "}
                  {alumnus.current_job} at {alumnus.company_name || "N/A"}
                </span>
                <button
                  className="alumni-list-delete-btn"
                  onClick={() => handleEdit(alumnus)}
                  style={{ background: "#3a7afe" }}
                >
                  Edit
                </button>
                <button
                  className="alumni-list-delete-btn"
                  onClick={() => handleDelete(alumnus.alumni_id)}
                >
                  Delete
                </button>
              </>
            )}
          </li>
        ))}
      </ul>

      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default AlumniList;
