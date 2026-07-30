import { Router } from "express";
import { rawApplicationData } from "../utils/import-data";

const router = Router();

router.get("/raw", (_req, res) => {
  res.status(200).json(rawApplicationData);
});

export default router;
