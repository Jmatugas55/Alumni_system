// CompanyForm.jsx
import React, { useState } from "react";
import axios from "axios";

const CompanyForm = ({ onSuccess, onCancel }) => {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [industry, setIndustry] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name) {
      alert("Company name is required");
      return;
    }

    try {
      await axios.post("http://localhost:5000/companies", {
        name,
        location,
        industry,
      });
      alert("Company added successfully");
      if (onSuccess) onSuccess(); // Notify parent (dashboard) about success
    } catch (error) {
      console.error("Error adding company:", error.response?.data || error);
      alert("Failed to add company: " + (error.response?.data?.error || "Unknown error"));
    }
  };

  return (
    <form className="company-form" onSubmit={handleSubmit}>
      <input
        type="text"
        className="company-input"
        placeholder="Company Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="text"
        className="company-input"
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
      <input
        type="text"
        className="company-input"
        placeholder="Industry"
        value={industry}
        onChange={(e) => setIndustry(e.target.value)}
      />
      
      <button className="company-btn" type="submit">Add Company</button>
      <button
        type="button"
        onClick={onCancel}
        style={{ marginLeft: "10px" }}
        className="company-btn cancel-btn"
      >
        Cancel
      </button>
    </form>
  );
};

export default CompanyForm;
