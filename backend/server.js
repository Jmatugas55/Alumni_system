// ...existing code...
require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Ensure uploads directory exists before using it
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}
app.use("/uploads", express.static(uploadsDir));

// Multer config for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Upload endpoint for event images
app.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  res.json({ url: `http://localhost:5000/uploads/${req.file.filename}` });
});

// Connect to MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "alumni_db",
});

db.connect((err) => {
  if (err) console.error("Database connection failed:", err);
  else console.log("Connected to MySQL Database");
});

/*************************************** user  **********************************/

// User Registration
// User Registration
app.post("/register", async (req, res) => {
  const { name, email, password, role, graduation_year, course, current_job } = req.body;
  if (!name || !email || !password || !role || !graduation_year || !course) {
    return res.status(400).json({ error: "All fields are required!" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    db.query(
      "INSERT INTO users (name, email, password, role, graduation_year, course, current_job) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [name, email, hashedPassword, role, graduation_year, course, current_job],
      (err) => {
        if (err) return res.status(500).json({ error: "User already exists" });
        res.json({ message: "User registered successfully!" });
      }
    );
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});


// User Login
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "All fields are required!" });

  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (results.length === 0) return res.status(401).json({ error: "User not found" });

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { userId: user.user_id, role: user.role },
      process.env.SECRET_KEY || "secretkey",
      { expiresIn: "1h" }
    );
    res.json({ token, role: user.role });
  });
});

// Get All Users
app.get("/users", (req, res) => {
  db.query(
    "SELECT user_id, name, email, role, graduation_year, course, current_job, photo FROM users",
    (err, results) => {
      if (err) return res.status(500).json({ error: "Database error" });
      res.json(results);
    }
  );
});



app.put('/users/:id', upload.single('photo'), (req, res) => {
  const userId = req.params.id;
  const { name, graduation_year, course, current_job } = req.body;

  // If a new photo was uploaded, get its filename
  const newPhoto = req.file ? req.file.filename : null;

  // First, fetch the current photo filename from DB to preserve if no new photo is uploaded
  db.query('SELECT photo FROM users WHERE user_id = ?', [userId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: "User not found" });

    const currentPhoto = results[0].photo;

    // Decide which photo to save: new uploaded or existing
    const photoToSave = newPhoto || currentPhoto;

    const sql = `UPDATE users SET name = ?, graduation_year = ?, course = ?, current_job = ?, photo = ? WHERE user_id = ?`;
    const params = [name, graduation_year, course, current_job, photoToSave, userId];

    db.query(sql, params, (err2, result) => {
      if (err2) return res.status(500).json({ error: err2.message });

      // Fetch updated user and return it
      db.query('SELECT * FROM users WHERE user_id = ?', [userId], (err3, users) => {
        if (err3) return res.status(500).json({ error: err3.message });
        res.json(users[0]);
      });
    });
  });
});




// Delete User
app.delete("/users/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM users WHERE user_id = ?", [id], (err) => {
    if (err) return res.status(500).json({ error: "Failed to delete user" });
    res.json({ message: "User deleted successfully!" });
  });
});

/*************************************** jobs  **********************************/

// Get all jobs
app.get("/jobs", (req, res) => {
  db.query("SELECT * FROM jobs", (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

// Add a job
app.post("/jobs", (req, res) => {
  const { company_id, title, description, location, salary } = req.body;
  db.query(
    "INSERT INTO jobs (company_id, title, description, location, salary) VALUES (?, ?, ?, ?, ?)",
    [company_id, title, description, location, salary],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Job added successfully!" });
    }
  );
});

// Delete a job
app.delete("/jobs/:id", (req, res) => {
  const job_id = req.params.id;
  db.query("DELETE FROM jobs WHERE job_id = ?", [job_id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Job deleted successfully!" });
  });
});

// UPDATE job by id
app.put("/jobs/:id", (req, res) => {
  const jobId = req.params.id;
  const { title, location, salary } = req.body;

  if (!title || !location || salary == null) {
    return res.status(400).json({ error: "Please provide title, location and salary" });
  }

  const sql = "UPDATE jobs SET title = ?, location = ?, salary = ? WHERE job_id = ?";
  db.query(sql, [title, location, salary, jobId], (err, result) => {
    if (err) return res.status(500).send(err);
    res.json({ message: "Job updated" });
  });
});
/*********************************** company ******************************************/

// Get all companies
app.get("/companies", (req, res) => {
  db.query("SELECT * FROM companies", (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

// Add a new company
app.post("/companies", (req, res) => {
  const { name, location, industry } = req.body;
  if (!name) return res.status(400).json({ error: "Company name is required" });

  const sql = "INSERT INTO companies (name, location, industry) VALUES (?, ?, ?)";
  db.query(sql, [name, location, industry], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Company added successfully!", company_id: result.insertId });
  });
});

// Update a company
app.put("/companies/:id", (req, res) => {
  const { name, location, industry } = req.body;
  db.query(
    "UPDATE companies SET name=?, location=?, industry=? WHERE company_id=?",
    [name, location, industry, req.params.id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Company updated successfully!" });
    }
  );
});

// Delete a company
app.delete("/companies/:id", (req, res) => {
  const companyId = req.params.id;
  const deleteJobs = "DELETE FROM jobs WHERE company_id = ?";
  db.query(deleteJobs, [companyId], (err) => {
    if (err) return res.status(500).json({ error: err.message });

    const deleteCompany = "DELETE FROM companies WHERE company_id = ?";
    db.query(deleteCompany, [companyId], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Company deleted successfully!" });
    });
  });
});

/*********************************** events ******************************************/

// Get all events (include image_url)
app.get("/events", (req, res) => {
  const sql = `
    SELECT events.*, users.name AS creator_name
    FROM events
    LEFT JOIN users ON events.created_by = users.user_id
    ORDER BY event_date DESC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Add an event (with image_url)
app.post("/events", (req, res) => {
  const { title, description, event_date, location, image_url, created_by } = req.body;
  if (!title || !event_date) {
    return res.status(400).json({ error: "Title and event date are required" });
  }
  const sql = `
    INSERT INTO events (title, description, event_date, location, image_url, created_by)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  db.query(sql, [title, description, event_date, location, image_url, created_by], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Event created successfully!", event_id: result.insertId });
  });
});

// Delete an event
app.delete("/events/:id", (req, res) => {
  db.query("DELETE FROM events WHERE event_id = ?", [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Event deleted successfully!" });
  });
});

/*********************************** alumni ******************************************/

app.get("/alumni", (req, res) => {
  const sql = `
    SELECT 
      a.alumni_id,
      u.name,
      a.graduation_year,
      a.course,
      a.current_job,
      a.company_id,
      c.name AS company_name
    FROM alumni a
    LEFT JOIN users u ON a.user_id = u.user_id
    LEFT JOIN companies c ON a.company_id = c.company_id
    ORDER BY a.alumni_id DESC
  `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching alumni:", err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// POST /alumni to add alumni info linked to existing user by user_id
app.post("/alumni", (req, res) => {
  const { user_id, graduation_year, course, current_job, company_id } = req.body;

  if (!user_id || !graduation_year) {
    return res.status(400).json({ error: "User ID and Graduation Year are required" });
  }

  // Optionally, check if user_id exists in users table before insert

  // Insert alumni info linked to user_id
  const sql = `
    INSERT INTO alumni (user_id, graduation_year, course, current_job, company_id)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [user_id, graduation_year, course || null, current_job || null, company_id || null],
    (err, result) => {
      if (err) {
        console.error("Error adding alumni:", err);
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: "Alumni info added successfully!" });
    }
  );
});
app.put("/alumni/:id", (req, res) => {
  const { id } = req.params;
  const { name, graduation_year, course, current_job, company_id } = req.body;

  // First update alumni table (without name)
  const updateAlumniSql = `
    UPDATE alumni
    SET graduation_year = ?, course = ?, current_job = ?, company_id = ?
    WHERE alumni_id = ?
  `;

  // Get user_id from alumni to update the name in users
  const getUserIdSql = `SELECT user_id FROM alumni WHERE alumni_id = ?`;

  db.query(getUserIdSql, [id], (err, results) => {
    if (err) {
      console.error("Error finding alumnus:", err);
      return res.status(500).json({ error: "Failed to find alumnus" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Alumnus not found" });
    }

    const user_id = results[0].user_id;

    // Update alumni table
    db.query(
      updateAlumniSql,
      [graduation_year, course, current_job, company_id, id],
      (err, result) => {
        if (err) {
          console.error("Error updating alumni:", err);
          return res.status(500).json({ error: "Failed to update alumni" });
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({ error: "Alumnus not found" });
        }

        // Update users table name if provided
        if (name) {
          const updateUserSql = `UPDATE users SET name = ? WHERE user_id = ?`;
          db.query(updateUserSql, [name, user_id], (err2, result2) => {
            if (err2) {
              console.error("Error updating user name:", err2);
              return res.status(500).json({ error: "Failed to update user name" });
            }

            res.json({ message: "Alumnus and user updated successfully" });
          });
        } else {
          res.json({ message: "Alumnus updated successfully" });
        }
      }
    );
  });
});


// DELETE /alumni/:id - Delete alumnus by id
app.delete("/alumni/:id", (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM alumni WHERE alumni_id = ?", [id], (err, result) => {
    if (err) {
      console.error("Error deleting alumnus:", err);
      return res.status(500).json({ error: "Failed to delete alumnus" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Alumnus not found" });
    }
    res.json({ message: "Alumnus deleted successfully" });
  });
});



// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// ...end of file...