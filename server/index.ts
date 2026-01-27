import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import { createServer } from "http";
import { setupVite, serveStatic } from "./vite";

dotenv.config();

const app = express();
const server = createServer(app);

app.use(cors());
app.use(express.json());

import { registerRoutes } from "./routes";

registerRoutes(app);

const PORT = 5000;

(async () => {
  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    await setupVite(app, server);
  }

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
})();
