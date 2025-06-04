import React, { useEffect, useState } from "react";
import axios from "axios";

const AlumniInfo = () => {
  const [companies, setCompanies] = useState([]);
  const [alumniUsers, setAlumniUsers] = useState([]);
  const [formData, setFormData] = useState({
    user_id: "",
    graduation_year: "",
    course: "",
    current_job: "",
    company_id: "",
  });

  useEffect(() => {
    fetchCompanies();
    fetchAlumniUsers();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await axios.get("http://localhost:5000/companies");
      setCompanies(response.data);
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  const fetchAlumniUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/users");
      const alumniOnly = response.data.filter(user => user.role === "alumni");
      setAlumniUsers(alumniOnly);
    } catch (error) {
      console.error("Error fetching alumni users:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/alumni", formData);
      setFormData({
        user_id: "",
        graduation_year: "",
        course: "",
        current_job: "",
        company_id: "",
      });
      alert("Alumni info added successfully!");
    } catch (error) {
      console.error("Error adding alumni info:", error);
    }
  };

  return (
    <div className="alumni-container">
      <h2>Add Alumni Info</h2>
      <form onSubmit={handleSubmit}>
        <select
          required
          value={formData.user_id}
          onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
        >
          <option value="">Select Alumni</option>
          {alumniUsers.map((user) => (
            <option key={user.user_id} value={user.user_id}>
              {user.name} ({user.email})
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Graduation Year"
          value={formData.graduation_year}
          onChange={(e) => setFormData({ ...formData, graduation_year: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Course"
          value={formData.course}
          onChange={(e) => setFormData({ ...formData, course: e.target.value })}
        />
        <input
          type="text"
          placeholder="Current Job"
          value={formData.current_job}
          onChange={(e) => setFormData({ ...formData, current_job: e.target.value })}
        />
        <select
          value={formData.company_id}
          onChange={(e) => setFormData({ ...formData, company_id: e.target.value })}
        >
          <option value="">Select Company</option>
          {companies.map((company) => (
            <option key={company.company_id} value={company.company_id}>
              {company.name}
            </option>
          ))}
        </select>
        <button type="submit">Add Alumni Info</button>
      </form>
    </div>
  );
};

export default AlumniInfo;
