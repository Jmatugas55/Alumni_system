import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import "../css/OverallStyle.css";
import EventList from "../Data_Retrieval/EventList.jsx";
import AlumniInfo from "./AlumniInfo";
import CompanyForm from "./Company";
import JobForm from "./JobForm"; // Make sure this path is correct

const AlumniDashboard = () => {
  const [alumni, setAlumni] = useState([]);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [events, setEvents] = useState([]);
  const [showAlumniInfo, setShowAlumniInfo] = useState(false);
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const location = useLocation();
  const [showJobModal, setShowJobModal] = useState(false);


  useEffect(() => {
    fetchAlumni();
    fetchEvents();
  }, []);

  const openJobModal = () => setShowJobModal(true);
const closeJobModal = () => setShowJobModal(false);

const handleJobAdded = () => {
  closeJobModal();
  // Optionally: Fetch jobs again or show toast
};


  // Fetch alumni data
  const fetchAlumni = async () => {
    try {
      const res = await axios.get("http://localhost:5000/alumni");
      setAlumni(res.data);
    } catch (error) {
      console.error("Error fetching alumni data:", error);
    }
  };

  // Fetch events data
  const fetchEvents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/events");
      setEvents(res.data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  // Search input handler
  const handleSearch = (e) => setSearch(e.target.value);

  // Sort alumni by name asc/desc
  const handleSort = () => {
    const sorted = [...alumni].sort((a, b) => {
      return sortOrder === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    });
    setAlumni(sorted);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const filteredAlumni = alumni.filter((alum) =>
    alum.name.toLowerCase().includes(search.toLowerCase())
  );

  const openAlumniInfo = (e) => {
    e.preventDefault();
    setShowAlumniInfo(true);
  };

  const closeAlumniInfo = () => setShowAlumniInfo(false);
  const openCompanyModal = () => setShowCompanyModal(true);
  const closeCompanyModal = () => setShowCompanyModal(false);

  // Refresh alumni or companies list after company is added
  // Assuming company affects alumni.company_name, you might want to re-fetch alumni to reflect changes.
  const handleCompanyAdded = () => {
    closeCompanyModal();
    fetchAlumni(); // Refresh alumni list to reflect new company data if relevant
  };

  // Check if current path is active
  const isActive = (path) => location.pathname === path;

  return (
    <div className="alumni_dashboard_layout">
      <aside className="alumni_dashboard_sidebar">
        <h2 className="alumni_dashboard_sidebar_title">Admin panel</h2>
        <div className="alumni_dashboard_sidebar_scroll">
          <ul className="alumni_dashboard_sidebar_list">
            <li className={isActive("/") ? "alumni_dashboard_active" : ""}>
              <Link to="/" className="alumni_dashboard_sidebar_link">
                Home
              </Link>
            </li>
            <li className={isActive("/events") ? "alumni_dashboard_active" : ""}>
              <Link to="/events" className="alumni_dashboard_sidebar_link">
                Events
              </Link>
            </li>
            <li>
              <button
                onClick={openJobModal}
                className="alumni_dashboard_sidebar_link"
                aria-haspopup="dialog"
              >
                Add Job
              </button>
            </li>


            <li>
              <button
                onClick={openCompanyModal}
                className="alumni_dashboard_sidebar_link"
                aria-haspopup="dialog"
              >
                Add Company
              </button>
            </li>
            <li>
              <button
                onClick={openAlumniInfo}
                className="alumni_dashboard_sidebar_link"
                aria-haspopup="dialog"
              >
                Alumni Info
              </button>
            </li>
            <p className="alumni_dashboard_list_header">List</p>
            <li className={isActive("/userlist") ? "alumni_dashboard_active" : ""}>
              <Link to="/userlist" className="alumni_dashboard_sidebar_link">
                User list
              </Link>
            </li>
            <li className={isActive("/joblist") ? "alumni_dashboard_active" : ""}>
              <Link to="/joblist" className="alumni_dashboard_sidebar_link">
                Job List
              </Link>
            </li>
            <li className={isActive("/companylist") ? "alumni_dashboard_active" : ""}>
              <Link to="/companylist" className="alumni_dashboard_sidebar_link">
                Company lists
              </Link>
            </li>
            <li className={isActive("/alumnilist") ? "alumni_dashboard_active" : ""}>
              <Link to="/alumnilist" className="alumni_dashboard_sidebar_link">
                Alumni lists
              </Link>
            </li>
          </ul>
        </div>
      </aside>

      <main
        className="alumni_dashboard_container"
        style={{
          opacity: showAlumniInfo || showCompanyModal ? 0.3 : 1,
          pointerEvents: showAlumniInfo || showCompanyModal ? "none" : "auto",
        }}
      >
        <h1 className="alumni_dashboard_heading">Admin Dashboard</h1>

        <input
          type="text"
          placeholder="Search alumni by name..."
          value={search}
          onChange={handleSearch}
          className="alumni_dashboard_search_input"
          aria-label="Search alumni by name"
        />

        <button
          onClick={handleSort}
          className="alumni_dashboard_sort_button"
          aria-pressed={sortOrder === "asc" ? "false" : "true"}
        >
          Sort by Name ({sortOrder})
        </button>

        <table className="alumni_dashboard_table" aria-label="Alumni Table">
          <thead className="alumni_dashboard_table_head">
            <tr className="alumni_dashboard_table_row">
              <th className="alumni_dashboard_table_header">Name</th>
              <th className="alumni_dashboard_table_header">Graduation Year</th>
              <th className="alumni_dashboard_table_header">Course</th>
              <th className="alumni_dashboard_table_header">Current Job</th>
              <th className="alumni_dashboard_table_header">Company</th>
            </tr>
          </thead>
          <tbody className="alumni_dashboard_table_body">
            {filteredAlumni.length > 0 ? (
              filteredAlumni.map((alum) => (
                <tr key={alum.alumni_id} className="alumni_dashboard_table_row">
                  <td className="alumni_dashboard_table_cell">{alum.name}</td>
                  <td className="alumni_dashboard_table_cell">{alum.graduation_year}</td>
                  <td className="alumni_dashboard_table_cell">{alum.course}</td>
                  <td className="alumni_dashboard_table_cell">{alum.current_job}</td>
                  <td className="alumni_dashboard_table_cell">{alum.company_name || "N/A"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  No alumni found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <h2 className="alumni_dashboard_events_title" style={{ marginTop: "2rem" }}>
          Events
        </h2>
        <EventList events={events} />
      </main>

      {/* Alumni Info Modal */}
      {showAlumniInfo && (
        <div
          className="modal_overlay"
          onClick={closeAlumniInfo}
          role="dialog"
          aria-modal="true"
          aria-labelledby="alumniInfoTitle"
        >
          <div className="modal_content" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal_close_button"
              onClick={closeAlumniInfo}
              aria-label="Close Alumni Info"
            >
              &times;
            </button>
            <AlumniInfo />
          </div>
        </div>
      )}

      {/* Add Company Modal */}
      {showCompanyModal && (
        <div
          className="modal_overlay"
          onClick={closeCompanyModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="companyFormTitle"
        >
          <div className="modal_content" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal_close_button"
              onClick={closeCompanyModal}
              aria-label="Close Add Company"
            >
              &times;
            </button>
                  <h2 className="company-form-title">Add a Company</h2>

            <CompanyForm onSuccess={handleCompanyAdded} onCancel={closeCompanyModal} />
          </div>
        </div>
      )}

      {/* Job Form Modal */}
           {showJobModal && (
              <div
                className="modal_overlay"
                onClick={closeJobModal}
                role="dialog"
                aria-modal="true"
                aria-labelledby="jobFormTitle"
              >
                <div className="modal_content" onClick={(e) => e.stopPropagation()}>
                  <button
                    className="modal_close_button"
                    onClick={closeJobModal}
                    aria-label="Close Add Job"
                  >
                    &times;
                  </button>
                  <h2 className="job-form-title">Add a Job</h2>
                  <JobForm onJobAdded={handleJobAdded} />
                </div>
              </div>
            )}


    </div>
  );
};

export default AlumniDashboard;
