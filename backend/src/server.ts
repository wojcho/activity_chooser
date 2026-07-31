import app from "./app";

import express from "express";
import path from "path";

const PORT = process.env.PORT || 3000;

// Serve Vite build files
app.use(express.static(path.join(__dirname, "../../frontend/dist")));

// SPA fallback (React Router)
app.get("/{*splat}", (req, res) => {
  res.sendFile(
    path.join(__dirname, "../../frontend/dist/index.html")
  );
});

// Listen application
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
