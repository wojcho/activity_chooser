import express from "express";
import healthRouter from "./routes/health";
import sessionsRouter from "./routes/sessions";

const app = express();

app.use(express.json());

app.use(healthRouter);
app.use(sessionsRouter);

export default app;
