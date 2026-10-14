const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend")));

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  registerNo: { type: String, required: true, trim: true, unique: true },
  department: { type: String, required: true, trim: true },
  course: { type: String, required: true, trim: true },
  year: { type: Number, required: true, min: 1, max: 4 }
}, { timestamps: true });

const Student = mongoose.model("Student", studentSchema);

app.get("/api/students", async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: 1 });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch students." });
  }
});

app.post("/api/students", async (req, res) => {
  try {
    const { name, registerNo, department, course, year } = req.body;
    if (!name || !registerNo || !department || !course || !year) {
      return res.status(400).json({ message: "All required fields must be filled." });
    }
    const student = await Student.create({ name, registerNo, department, course, year });
    res.status(201).json(student);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "That register number already exists." });
    }
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: "Please enter valid student details." });
    }
    res.status(500).json({ message: "Failed to register student." });
  }
});

app.put("/api/students/:id", async (req, res) => {
  try {
    const { name, registerNo, department, course, year } = req.body;
    if (!name || !registerNo || !department || !course || !year) {
      return res.status(400).json({ message: "All required fields must be filled." });
    }
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { name, registerNo, department, course, year },
      { new: true, runValidators: true }
    );
    if (!student) return res.status(404).json({ message: "Student not found." });
    res.json(student);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "That register number already exists." });
    }
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({ message: "Invalid student details or record ID." });
    }
    res.status(500).json({ message: "Failed to update student." });
  }
});

app.delete("/api/students/:id", async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found." });
    res.json({ message: "Student deleted successfully." });
  } catch (error) {
    res.status(400).json({ message: "Invalid student record ID." });
  }
});

async function start() {
  if (!MONGODB_URI) {
    console.error("Missing MONGODB_URI. Create a .env file using .env.example.");
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB connected successfully.");
    app.listen(PORT, () => {
      console.log(`CourseHub running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
}
start();