import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const JobForm = () => {
  const [companies, setCompanies] = useState([]);
  const [form, setForm] = useState({
    company_id: "",
    title: "",
    description: "",
    location: "",
    salary: "",
  });
  const [ setUserName] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/companies")
      .then((res) => setCompanies(res.data))
      .catch(() => setCompanies([]));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:5000/alumni", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data.length > 0) {
          setUserName(res.data[0].name);
        }
      })
      .catch(() => setUserName(""));
  }, );

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/jobs", form);
      toast.success("Job added successfully!");
      setForm({
        company_id: "",
        title: "",
        description: "",
        location: "",
        salary: "",
      });
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to add job");
    }
  };

  return (
    <div className="job-form-container">
      <h1 className="form-title">Add a Job</h1>

      <form onSubmit={handleSubmit} className="job-form">
        <div className="form-group">
          <label>Company</label>
          <select
            name="company_id"
            value={form.company_id}
            onChange={handleChange}
            required
          >
            <option value="">Select Company</option>
            {companies.map((company) => (
              <option key={company.company_id} value={company.company_id}>
                {company.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Job Title</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            rows="4"
          />
        </div>

        <div className="form-group">
          <label>Location</label>
          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Salary</label>
          <input
            type="number"
            name="salary"
            value={form.salary}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="submit-button">
          Add Job
        </button>
      </form>
    </div>
  );
};

export default JobForm;
