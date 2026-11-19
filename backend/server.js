import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL?.split(",").map(url => url.trim()),
  methods: ["GET", "POST", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json({ limit: "20kb" }));

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { message: "Too many messages. Please try again later." }
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { message: "Too many login attempts. Try again later." }
});

// DATABASE MODELS
const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true }
}, { timestamps: true });

const messageSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 80 },
  email: { type: String, required: true, lowercase: true, trim: true, maxlength: 120 },
  subject: { type: String, required: true, trim: true, maxlength: 150 },
  message: { type: String, required: true, trim: true, maxlength: 3000 },
  status: { type: String, enum: ["unread", "read"], default: "unread" }
}, { timestamps: true });

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 100 },
  description: { type: String, required: true, maxlength: 1500 },
  techStack: [{ type: String, trim: true }],
  githubUrl: { type: String, default: "" },
  liveUrl: { type: String, default: "" },
  featured: { type: Boolean, default: false }
}, { timestamps: true });

const Admin = mongoose.model("Admin", adminSchema);
const Message = mongoose.model("Message", messageSchema);
const Project = mongoose.model("Project", projectSchema);

// AUTHENTICATION
function authenticateAdmin(req, res, next) {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authentication required." });
  }

  try {
    const token = header.split(" ")[1];
    req.admin = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired session." });
  }
}

// HEALTH CHECK
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Portfolio API is running." });
});

// ADMIN LOGIN
app.post("/api/auth/login", loginLimiter, async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const admin = await Admin.findOne({ email });

    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = jwt.sign(
      { id: admin._id.toString(), email: admin.email, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.json({
      message: "Login successful.",
      token,
      admin: { email: admin.email }
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: "Login failed." });
  }
});

// PUBLIC CONTACT FORM
app.post("/api/contact", contactLimiter, async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (![name, email, subject, message].every(value =>
      typeof value === "string" && value.trim()
    )) {
      return res.status(400).json({ message: "Please complete all fields." });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return res.status(400).json({ message: "Please enter a valid email." });
    }

    const savedMessage = await Message.create({
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim(),
      message: message.trim()
    });

    res.status(201).json({
      message: "Your message has been sent successfully.",
      id: savedMessage._id
    });
  } catch (error) {
    console.error("Contact error:", error.message);
    res.status(500).json({ message: "Could not send your message." });
  }
});

// PUBLIC PROJECT LIST
app.get("/api/projects", async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 }).lean();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: "Could not load projects." });
  }
});

// ADMIN DASHBOARD SUMMARY
app.get("/api/admin/stats", authenticateAdmin, async (req, res) => {
  try {
    const [totalMessages, unreadMessages, totalProjects] = await Promise.all([
      Message.countDocuments(),
      Message.countDocuments({ status: "unread" }),
      Project.countDocuments()
    ]);

    res.json({ totalMessages, unreadMessages, totalProjects });
  } catch {
    res.status(500).json({ message: "Could not load dashboard stats." });
  }
});

// ADMIN: LIST MESSAGES
app.get("/api/admin/messages", authenticateAdmin, async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 }).lean();
    res.json(messages);
  } catch {
    res.status(500).json({ message: "Could not load messages." });
  }
});

// ADMIN: UPDATE MESSAGE STATUS
app.patch("/api/admin/messages/:id", authenticateAdmin, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid message ID." });
    }

    const { status } = req.body;
    if (!["read", "unread"].includes(status)) {
      return res.status(400).json({ message: "Invalid message status." });
    }

    const message = await Message.findByIdAndUpdate(
      req.params.id, { status }, { new: true }
    );

    if (!message) return res.status(404).json({ message: "Message not found." });
    res.json(message);
  } catch {
    res.status(500).json({ message: "Could not update message." });
  }
});

// ADMIN: DELETE MESSAGE
app.delete("/api/admin/messages/:id", authenticateAdmin, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid message ID." });
    }

    const deleted = await Message.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Message not found." });

    res.json({ message: "Message deleted." });
  } catch {
    res.status(500).json({ message: "Could not delete message." });
  }
});

// ADMIN: ADD PROJECT
app.post("/api/admin/projects", authenticateAdmin, async (req, res) => {
  try {
    const { title, description, techStack, githubUrl, liveUrl, featured } = req.body;

    if (!title?.trim() || !description?.trim()) {
      return res.status(400).json({ message: "Title and description are required." });
    }

    const project = await Project.create({
      title: title.trim(),
      description: description.trim(),
      techStack: Array.isArray(techStack) ? techStack : [],
      githubUrl: githubUrl || "",
      liveUrl: liveUrl || "",
      featured: Boolean(featured)
    });

    res.status(201).json(project);
  } catch (error) {
    console.error("Project error:", error.message);
    res.status(500).json({ message: "Could not create project." });
  }
});

// ADMIN: DELETE PROJECT
app.delete("/api/admin/projects/:id", authenticateAdmin, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid project ID." });
    }

    const deleted = await Project.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Project not found." });

    res.json({ message: "Project deleted." });
  } catch {
    res.status(500).json({ message: "Could not delete project." });
  }
});

// START SERVER
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    if (!process.env.MONGO_URI || !process.env.JWT_SECRET ||
        !process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
      throw new Error("Missing required environment variables in .env");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Atlas connected.");

    const email = process.env.ADMIN_EMAIL.toLowerCase().trim();
    const existingAdmin = await Admin.findOne({ email });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);
      await Admin.create({ email, password: hashedPassword });
      console.log("Initial admin account created.");
    } else {
      console.log("Admin account already exists.");
    }

    app.listen(PORT, () => {
      console.log(`Portfolio API running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
}

startServer();
