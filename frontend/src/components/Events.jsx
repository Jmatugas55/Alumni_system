// Events.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/OverallStyle.css";
import EventList from "../Data_Retrieval/EventList"; 
import { FaArrowCircleLeft } from "react-icons/fa";
import { Link } from "react-router-dom";

const Events = ({ currentUser }) => {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    event_date: "",
    location: "",
    image_url: "",
  });
  const [showForm, setShowForm] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/events");
      setEvents(res.data);
    } catch (error) {
      console.error("Failed to fetch events:", error);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let imageUrl = "";
    if (imageFile) {
      const data = new FormData();
      data.append("image", imageFile);
      try {
        const uploadRes = await axios.post("http://localhost:5000/upload", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        imageUrl = uploadRes.data.url;
      } catch (error) {
        console.error("Image upload failed:", error);
        return; // Stop submit if image upload fails
      }
    }

    try {
      // Create event
      const eventRes = await axios.post("http://localhost:5000/events", {
        ...form,
        image_url: imageUrl,
        created_by: currentUser?.user_id || null,
      });

              // Only admin triggers notifications
            if (currentUser?.role === "admin") {
          const usersRes = await axios.get("http://localhost:5000/users");
          const users = usersRes.data.filter(user => user.user_id !== currentUser.user_id);

          const notificationsPayload = users.map(user => ({
            user_id: user.user_id,
            message: `New event created: ${form.title}`,
          }));

          if (notificationsPayload.length > 0) {
            await axios.post("http://localhost:5000/notifications/bulk", {
              notifications: notificationsPayload,
              
            });
            console.log("Sending notifications:", notificationsPayload);

          }
        }


      // Reset form and refresh event list
      setForm({ title: "", description: "", event_date: "", location: "", image_url: "" });
      setImageFile(null);
      setShowForm(false);
      fetchEvents();

    } catch (error) {
      console.error("Error creating event or notifications:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this event?")) {
      try {
        await axios.delete(`http://localhost:5000/events/${id}`);
        fetchEvents();
      } catch (error) {
        console.error("Failed to delete event:", error);
      }
    }
  };

  return (
    <div className="events-bg">
      <div className="events-container">
        <Link to={'/alumnidashboard'}>
          <button><FaArrowCircleLeft />back</button>
        </Link>
        <h2 className="events-title">Upcoming Events</h2>
        <button className="events-add-btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "Add Event"}
        </button>
        {showForm && (
          <form className="events-form" onSubmit={handleSubmit}>
            <input
              className="events-input"
              name="title"
              placeholder="Title"
              value={form.title}
              onChange={handleChange}
              required
            />
            <input
              className="events-input"
              name="event_date"
              type="datetime-local"
              value={form.event_date}
              onChange={handleChange}
              required
            />
            <input
              className="events-input"
              name="location"
              placeholder="Location"
              value={form.location}
              onChange={handleChange}
            />
            <input
              className="events-input"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            <textarea
              className="events-textarea"
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
              rows={3}
            />
            <button className="events-btn" type="submit">
              Create Event
            </button>
          </form>
        )}
        <EventList
          events={events}
          currentUser={currentUser}
          handleDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default Events;
