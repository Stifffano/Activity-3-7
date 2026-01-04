const express = require("express");
const mysql = require("mysql2");

const app = express();

// 👇 CHANGE PORT HERE
const PORT = 3000;

app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

// MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "user123",
  database: "school"
});

db.connect(err => {
  if (err) {
    console.error("DB connection failed:", err);
    return;
  }
  console.log("Connected to MySQL");
});

// Home page
app.get("/", (req, res) => {
  res.send("<h2>Student Enrollment System</h2><p>Try /students</p>");
});


// ===================== STUDENTS =====================

// View students
app.get("/students", (req, res) => {
  db.query("SELECT * FROM students", (err, results) => {
    if (err) return res.send("Error fetching students");
    res.json(results);
  });
});

// Add student
app.post("/students", (req, res) => {
  const { name, age, course } = req.body;

  if (!name || !age || !course) {
    return res.status(400).json({ message: "All fields required" });
  }

  const sql = "INSERT INTO students (name, age, course) VALUES (?, ?, ?)";
  db.query(sql, [name, age, course], (err, result) => {
    if (err) return res.send("Error adding student");
    res.json({ message: "Student added", id: result.insertId });
  });
});

// Update student
app.put("/students/:id", (req, res) => {
  const { name, age, course } = req.body;
  const { id } = req.params;

  const sql = "UPDATE students SET name=?, age=?, course=? WHERE student_id=?";
  db.query(sql, [name, age, course, id], err => {
    if (err) return res.send("Error updating student");
    res.json({ message: "Student updated" });
  });
});

// Delete student
app.delete("/students/:id", (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM students WHERE student_id=?", [id], err => {
    if (err) return res.send("Error deleting student");
    res.json({ message: "Student deleted" });
  });
});


// ===================== COURSES =====================

// View courses
app.get("/courses", (req, res) => {
  db.query("SELECT * FROM courses", (err, results) => {
    if (err) return res.send("Error fetching courses");
    res.json(results);
  });
});

// Add course
app.post("/courses", (req, res) => {
  const { course_name, units } = req.body;

  const sql = "INSERT INTO courses (course_name, units) VALUES (?, ?)";
  db.query(sql, [course_name, units], (err, result) => {
    if (err) return res.send("Error adding course");
    res.json({ message: "Course added", id: result.insertId });
  });
});

// Update course
app.put("/courses/:id", (req, res) => {
  const { course_name, units } = req.body;
  const { id } = req.params;

  const sql = "UPDATE courses SET course_name=?, units=? WHERE course_id=?";
  db.query(sql, [course_name, units, id], err => {
    if (err) return res.send("Error updating course");
    res.json({ message: "Course updated" });
  });
});

// Delete course
app.delete("/courses/:id", (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM courses WHERE course_id=?", [id], err => {
    if (err) return res.send("Error deleting course");
    res.json({ message: "Course deleted" });
  });
});


// ===================== ENROLLMENTS =====================

// View enrollments
app.get("/enrollments", (req, res) => {
  const sql = `
    SELECT e.enrollment_id,
           s.name AS student,
           s.age,
           c.course_name,
           c.units,
           e.enrollment_date
    FROM enrollments e
    JOIN students s ON e.student_id = s.student_id
    JOIN courses c ON e.course_id = c.course_id
  `;
  db.query(sql, (err, results) => {
    if (err) return res.send("Error fetching enrollments");
    res.json(results);
  });
});

// Add enrollment
app.post("/enrollments", (req, res) => {
  const { student_id, course_id, enrollment_date } = req.body;

  const sql = `
    INSERT INTO enrollments (student_id, course_id, enrollment_date)
    VALUES (?, ?, ?)
  `;
  db.query(sql, [student_id, course_id, enrollment_date], (err, result) => {
    if (err) return res.send("Error adding enrollment");
    res.json({ message: "Enrollment added", id: result.insertId });
  });
});

// Update enrollment
app.put("/enrollments/:id", (req, res) => {
  const { student_id, course_id, enrollment_date } = req.body;
  const { id } = req.params;

  const sql = `
    UPDATE enrollments
    SET student_id=?, course_id=?, enrollment_date=?
    WHERE enrollment_id=?
  `;
  db.query(sql, [student_id, course_id, enrollment_date, id], err => {
    if (err) return res.send("Error updating enrollment");
    res.json({ message: "Enrollment updated" });
  });
});

// Delete enrollment
app.delete("/enrollments/:id", (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM enrollments WHERE enrollment_id=?", [id], err => {
    if (err) return res.send("Error deleting enrollment");
    res.json({ message: "Enrollment deleted" });
  });
});
