import { Router } from "express";
import { applicationData } from "../utils/import-data";

const router = Router();

router.get("/raw", (_req, res) => {
  res.status(200).json(applicationData);
});

export default router;
