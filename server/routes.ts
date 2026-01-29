import { Express } from "express";
import express from "express";
import path from "path";
import authRoutes from "./api/routes/auth.routes";
import studentRoutes from "./api/routes/student.routes";
import subjectRoutes from "./api/routes/subject.routes";
import teacherRoutes from "./api/routes/teacher.routes";
import uploadRoutes from "./api/routes/upload.routes";

export function registerRoutes(app: Express) {
  app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "HamroGuru Backend is running!" });
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/student", studentRoutes);
  app.use("/api/subjects", subjectRoutes);
  app.use("/api/teacher", teacherRoutes);
  app.use("/api/upload", uploadRoutes);
}
