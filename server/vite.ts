import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export async function setupVite(app: Express, server: any) {
  const { createServer: createViteServer } = await import("vite");
  const { fileURLToPath } = await import("url");
  
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa" as const,
    configFile: path.resolve(__dirname, "../vite.config.ts"),
  });

  app.use(vite.middlewares);

  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(__dirname, "../index.html");
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(template);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath = path.resolve(process.cwd(), "dist");

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }

  app.use(express.static(distPath));

  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
