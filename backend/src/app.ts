import express from "express";
import healthRouter from "./routes/health";
import sessionsRouter from "./routes/sessions";
import rawRouter from "./routes/raw";

const app = express();

app.use(express.json());

app.use(healthRouter);
app.use(sessionsRouter);
app.use(rawRouter);

export default app;
