import express from "express";
import path from "path";
import { access } from "node:fs/promises";
import { createServer as createViteServer } from "vite";
import { calculateCapacity } from "./src/lib/calculator";

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // English has one canonical route shape; localized URLs retain their prefix.
  app.get(/^\/en(?:\/.*)?$/, (req, res) => {
    const target = req.originalUrl.slice(3);
    res.redirect(308, target.startsWith('/') ? target : '/' + target);
  });

  // API Route: Calculate Capacity
  app.post("/api/v1/capacity-evaluation", (req, res) => {
    const result = calculateCapacity(req.body);
    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath, { redirect: false }));
    app.get('*', async (req, res) => {
      const page = path.resolve(distPath, '.' + req.path, 'index.html');
      if (page.startsWith(distPath + path.sep)) {
        try {
          await access(page);
          res.sendFile(page);
          return;
        } catch { /* Unknown routes use the SPA fallback. */ }
      }
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
