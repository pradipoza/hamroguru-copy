import { Express } from "express";
import authRoutes from "./api/routes/auth.routes";
import studentRoutes from "./api/routes/student.routes";
import subjectRoutes from "./api/routes/subject.routes";
import teacherRoutes from "./api/routes/teacher.routes";

export function registerRoutes(app: Express) {
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "MeroGuru Backend is running!" });
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/student", studentRoutes);
  app.use("/api/subjects", subjectRoutes);
  app.use("/api/teacher", teacherRoutes);
}
