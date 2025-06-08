import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EventList from "../Data_Retrieval/EventList.jsx"
import Jobs from "../Data_Retrieval/Jobs.jsx"

const UserDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [alumniList, setAlumniList] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [events, setEvents] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const [showCompanyModal, setShowCompanyModal] = useState(false);

useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchProfile();
        await fetchCombinedAlumni();
        await fetchCompanies();
        await fetchEvents();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);




  const fetchEvents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/events");
      setEvents(res.data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

          const CompanyModal = () => (
          <div style={{
            position: "fixed",
            top: 0, left: 0,
            width: "100vw", height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 9999
          }}>
            <div style={{
              background: "#fff",
              padding: "25px",
              borderRadius: "12px",
              width: "90%",
              maxWidth: "500px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
              position: "relative"
            }}>
              <h2 style={{ marginBottom: "15px", fontSize: "1.5rem", color: "#333" }}>Company List</h2>
              <ul style={{ listStyle: "none", padding: 0, maxHeight: "300px", overflowY: "auto" }}>
                {companies.length > 0 ? (
                  companies.map((company, index) => (
                    <li
                      key={index}
                      style={{
                        padding: "12px",
                        borderBottom: "1px solid #eee",
                        display: "flex",
                        flexDirection: "column",
                        gap: "4px",
                        fontSize: "15px",
                        color: "#444"
                      }}
                    >
                      <strong style={{ fontSize: "16px", color: "#111" }}>{company.name}</strong>
                      <span style={{ color: "#777" }}>{company.location}</span>
                    </li>
                  ))
                ) : (
                  <li style={{ padding: "12px", color: "#888" }}>No companies found.</li>
                )}
              </ul>
              <button
                onClick={() => setShowCompanyModal(false)}
                style={{
                  marginTop: "20px",
                  padding: "10px 18px",
                  backgroundColor: "#007BFF",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  float: "right"
                }}
              >
                Close
              </button>
            </div>
          </div>
        );



  const fetchProfile = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    const decoded = jwtDecode(token);
    const userId = decoded.userId;

    const res = await axios.get("http://localhost:5000/users");
    const currentUser = res.data.find((user) => user.user_id === userId);

    if (currentUser) {
      setProfile(currentUser);
      setFormData({
        name: currentUser.name,
        course: currentUser.course,
        graduation_year: currentUser.graduation_year,
        current_job: currentUser.current_job || "",
        photo: currentUser.photo || null,
      });

      // Use permanent photo from server, not temporary blob URL
      if (currentUser.photo) {
        setImagePreview(`http://localhost:5000/uploads/${currentUser.photo}?t=${new Date().getTime()}`);
      } else {
        setImagePreview(null);
      }
    } else {
      setProfile(null);
    }
  } catch (error) {
    console.error("Error fetching profile", error);
    setProfile(null);
  }
};


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

 const handleSave = async () => {
  try {
    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== "photo") form.append(key, value);
    });
    if (selectedImage) {
      form.append("photo", selectedImage);
    }

    const token = localStorage.getItem("token");
    const decoded = jwtDecode(token);
    const userId = decoded.userId;

    const res = await axios.put(`http://localhost:5000/users/${userId}`, form, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    const updatedUser = res.data;

    // ✅ Update full profile and image preview with real file name
    setProfile(updatedUser);
    setFormData({
      name: updatedUser.name,
      course: updatedUser.course,
      graduation_year: updatedUser.graduation_year,
      current_job: updatedUser.current_job || "",
      photo: updatedUser.photo || null,
    });

    if (updatedUser.photo) {
      setImagePreview(`http://localhost:5000/uploads/${updatedUser.photo}?t=${new Date().getTime()}`);
    } else {
      setImagePreview(null);
    }

    setSelectedImage(null);
    toast.success("Profile updated!");
    setEditMode(false);
  } catch (error) {
    console.error("Update failed", error);
    toast.error("Failed to update profile");
  }
};


  const fetchCombinedAlumni = async () => {
    try {
      const [alumniRes, usersRes] = await Promise.all([
        axios.get("http://localhost:5000/alumni"),
        axios.get("http://localhost:5000/users"),
      ]);

      const alumniData = alumniRes.data.map((item) => ({
        ...item,
        id: item.alumni_id,
        source: "alumni",
      }));

      const userAlumni = usersRes.data
        .filter((user) => user.role === "alumni")
        .map((item) => ({
          ...item,
          id: item.user_id,
          source: "user",
        }));

      const combined = [...alumniData, ...userAlumni];
      setAlumniList(combined);
    } catch (error) {
      console.error("Error fetching alumni list", error);
    }
  };


  const fetchCompanies = async () => {
    try {
      const res = await axios.get("http://localhost:5000/companies");
      setCompanies(res.data.slice(0, 5));
    } catch (error) {
      console.error("Error fetching companies", error);
    }
  };

  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    return (parts[0][0] + (parts[1]?.[0] || "")).toUpperCase();
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
    
    <div className="user_dashboard_layout">
      {showCompanyModal && <CompanyModal />}
      <ToastContainer />
      <aside className="user_dashboard_sidebar">
        <h2 className="user_dashboard_title">Alumni Portal</h2>
        <div className="user_dashboard_profile_info">
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Profile"
              style={{
                width: "100px",
                borderRadius: "8px",
                marginTop: "10px",
                objectFit: "cover",
              }}
            />
          ) : (
            <div className="user_dashboard_initials">{getInitials(profile?.name)}</div>
          )}
          <span className="user_dashboard_name">{profile?.name || "Loading..."}</span>
        </div>
        <ul className="user_dashboard_nav">
          <li className={location.pathname === "/userdashboard" ? "active" : ""}>
            <Link  className="alumni_dashboard_sidebar_link" to="/userdashboard">Dashboard</Link>
          </li>
          
          <li>
             <button               
                onClick={() => setShowCompanyModal(true)}
                style={{ background: "none", border: "none", padding: 0, cursor: "pointer", textAlign: "left", width: "100%" }}
              >
              <Link className="alumni_dashboard_sidebar_link" >          
                Companies
              </Link>

              
              </button>
            </li>        
          <li>
            <button onClick={confirmLogout} className="logout-button">Logout</button>
          </li>
        </ul>
      </aside>

      <main className="user_dashboard_main">
        <h1>Welcome, {profile ? profile.name : "Alumni"}!</h1>

        {profile ? (
          <div className="user_dashboard_profile_card">
            <h2>Your Profile</h2>
            {!editMode ? (
              <>
                <p><strong>Name:</strong> {profile.name}</p>
                <p><strong>Graduation Year:</strong> {profile.graduation_year}</p>
                <p><strong>Course:</strong> {profile.course}</p>
                <p><strong>Current Job:</strong> {profile.current_job || "Not specified"}</p>
                <button onClick={() => setEditMode(true)}>Edit Profile</button>
              </>
            ) : (
              <>
                <label>Name: <input type="text" name="name" value={formData.name} onChange={handleInputChange} /></label><br />
                <label>Graduation Year: <input type="text" name="graduation_year" value={formData.graduation_year} onChange={handleInputChange} /></label><br />
                <label>Course: <input type="text" name="course" value={formData.course} onChange={handleInputChange} /></label><br />
                <label>Current Job: <input type="text" name="current_job" value={formData.current_job} onChange={handleInputChange} /></label><br />
                <label>Photo: <input type="file" accept="image/*" onChange={handleImageChange} /></label><br />
                {imagePreview && <img src={imagePreview} alt="Preview" style={{ width: "100px", borderRadius: "8px", marginTop: "10px" }} />}
                <br />
                <button onClick={handleSave}>Save</button>
                <button
                  onClick={() => {
                    setEditMode(false);
                    setSelectedImage(null);
                    setImagePreview(profile?.photo ? `http://localhost:5000/uploads/${profile.photo}?t=${new Date().getTime()}` : null);
                  }}
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        ) : (
          <p>Loading profile...</p>
        )}
        <div className="user_dashboard_sections">
              <div className="user_dashboard_row">
                 <div className="user_dashboard_box alumni_box">
      <h2>Fellow Alumni</h2>
      <ul className="user_dashboard_list">
        {alumniList.length === 0 ? (
          <li>No alumni found.</li>
        ) : (
          alumniList.map((alumni) => {
            const hasPhoto = alumni.photo && alumni.photo !== "";
            const username = alumni.username || alumni.name || ""; // fallback to name if username is missing
            const initials =
              username.length >= 2
                ? `${username[0].toUpperCase()}${username[username.length - 1].toUpperCase()}`
                : username.toUpperCase();

            return (
              <li key={`${alumni.source}-${alumni.id}`} className="alumni_item">
                {hasPhoto ? (
                  <img
                    src={`http://localhost:5000/uploads/${alumni.photo}`}
                    alt={alumni.name}
                    className="alumni_photo"
                  />
                ) : (
                  <div className="alumni_initials">
                    {initials}
                  </div>
                )}

                <div className="alumni_info">
                  <strong>{alumni.name}</strong><br />
                  <span>
                    {alumni.course || "N/A"} | Class of {alumni.graduation_year || "N/A"}
                  </span>
                  <br />
                  <em>{alumni.current_job || "No current job listed"}</em>
                </div>
              </li>
            );
          })
        )}
      </ul>
    </div>


              <div className="user_dashboard_box companies_box">
                <h2>Top Companies</h2>
                <ul className="user_dashboard_list">
                  {companies.length === 0 ? (
                    <li>No companies available.</li>
                  ) : (
                    companies.map((company) => (
                      <li key={company.company_id}>
                        <strong>{company.name}</strong><br />
                        <span>{company.industry || "Industry N/A"}</span>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </div>

              <div className="user_dashboard_row">
               <div className="companies_box">
                 <div className="c">
                <h2 className="alumni_dashboard_events_title" style={{ marginTop: "0" }}>
                  Jobs
                </h2>
               
                <Jobs/>
                
              </div>
              </div>
            </div>
              <div className="user_dashboard_row">
               <div className="companies_box">
                <h2 className="alumni_dashboard_events_title" style={{ marginTop: "0" }}>
                  Events
                </h2>
                <EventList
                      events={events}
                      isUserDashboard={true} // or false depending on context
                    />

             </div>
              </div>
            </div>


      </main>

      
    </div>
  );
};

export default UserDashboard;
