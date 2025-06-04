import React from "react";

const EventList = ({ events, currentUser, handleDelete }) => (
  <ul className="events-list">
    {events.map(ev => (
      <li key={ev.event_id} className="events-item">
        <div className="events-item-content">
          <div className="events-item-header">
            <h3 className="events-item-title">{ev.title}</h3>
            {currentUser?.role === "admin" && handleDelete && (
              <button
                className="events-delete-btn"
                onClick={() => handleDelete(ev.event_id)}
                aria-label={`Delete event ${ev.title}`}
                title="Delete Event"
              >
                &times;
              </button>
            )}
          </div>
          <div className="events-item-date-location">
            {new Date(ev.event_date).toLocaleString()} | {ev.location}
          </div>
          {ev.image_url && (
            <div className="events-item-image">
              <img
                src={ev.image_url}
                alt={`${ev.title} venue`}
                loading="lazy"
              />
            </div>
          )}
          <p className="events-item-desc">{ev.description}</p>
          {ev.creator_name && (
            <div className="events-item-meta">By: <span>{ev.creator_name}</span></div>
          )}
        </div>
      </li>
    ))}
  </ul>
);

export default EventList;
