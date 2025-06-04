import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/OverallStyle.css";
import { FaArrowCircleLeft } from "react-icons/fa";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const toastStyle = {
  background: "linear-gradient(to right, #a8edea, #fed6e3)",
  color: "#333",
  borderRadius: "10px",
  fontWeight: "bold",
};

const CompanyList = () => {
  const [companies, setCompanies] = useState([]);
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({
    name: "",
    location: "",
    industry: "",
  });

  // Track which company is pending delete confirmation
    const [deletePendingId, setDeletePendingId] = useState(null);


              useEffect(() => {
              // Initial fetch without toast
              fetchCompanies(false);
            }, []);

           const fetchCompanies = async () => {
              try {
                const res = await axios.get("http://localhost:5000/companies");
                setCompanies(res.data);
                // Removed: success toast
              } catch (error) {
                console.error("Error fetching companies:", error);
                toast.error("Error fetching companies", {
                  position: "top-center",
                  style: toastStyle,
                });
              }
              };



  // Function to show toast with Confirm & Cancel buttons for delete
  const confirmDelete = (id) => {
    setDeletePendingId(id);

    toast.info(
      <div>
        Are you sure you want to delete this company?
        <div style={{ marginTop: "10px" }}>
          <button
            style={{
              marginRight: "10px",
              backgroundColor: "#e74c3c",
              color: "white",
              border: "none",
              padding: "5px 10px",
              borderRadius: "5px",
              cursor: "pointer",
            }}
            onClick={() => handleDelete(id)}
          >
            Confirm
          </button>
          <button
            style={{
              backgroundColor: "#95a5a6",
              color: "white",
              border: "none",
              padding: "5px 10px",
              borderRadius: "5px",
              cursor: "pointer",
            }}
            onClick={() => {
              toast.dismiss();
              setDeletePendingId(null);
            }}
          >
            Cancel
          </button>
        </div>
      </div>,
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        style: toastStyle,
      }
    );
  };

  // Delete company API call
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/companies/${id}`);
      toast.dismiss();
      toast.success("Company deleted successfully!", {
        position: "top-center",
        style: toastStyle,
      });
      fetchCompanies(true); // show toast after delete

    } catch {
      toast.error("Failed to delete company", {
        position: "top-center",
        style: toastStyle,
      });
    }
  };

  const handleEdit = (company) => {
    setEditId(company.company_id);
    setEditData({
      name: company.name,
      location: company.location,
      industry: company.industry,
    });
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleEditSave = async (id) => {
    try {
            await axios.put(`http://localhost:5000/companies/${id}`, editData);
      setEditId(null);
      toast.success("Company updated successfully!", {
        position: "top-center",
        style: toastStyle,
      });
      fetchCompanies(true); // show toast after update

    } catch {
      toast.error("Failed to update company", {
        position: "top-center",
        style: toastStyle,
      });
    }
  };

  const filteredCompanies = companies.filter((company) =>
    company.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="alumni-list-container">
      <ToastContainer />
      <Link to={"/alumnidashboard"}>
        <button>
          <FaArrowCircleLeft /> Back
        </button>
      </Link>

      <h2>Company List</h2>
     
      <input
        className="alumni-list-search"
        type="text"
        placeholder="Search by company name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="table-wrapper">
        <table className="company-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Location</th>
              <th>Industry</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCompanies.map((company) => (
              <tr key={company.company_id}>
                {editId === company.company_id ? (
                  <>
                    <td>
                      <input
                        name="name"
                        value={editData.name}
                        onChange={handleEditChange}
                      />
                    </td>
                    <td>
                      <input
                        name="location"
                        value={editData.location}
                        onChange={handleEditChange}
                      />
                    </td>
                    <td>
                      <input
                        name="industry"
                        value={editData.industry}
                        onChange={handleEditChange}
                      />
                    </td>
                    <td>
                      <button onClick={() => handleEditSave(company.company_id)}>
                        Save
                      </button>
                      <button onClick={() => setEditId(null)}>Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{company.name}</td>
                    <td>{company.location}</td>
                    <td>{company.industry}</td>
                    <td>
                      <button onClick={() => handleEdit(company)}>Edit</button>
                      <button onClick={() => confirmDelete(company.company_id)}>
                        Delete
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CompanyList;
