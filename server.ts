import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { calculateCapacity } from "./src/lib/calculator";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

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
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
