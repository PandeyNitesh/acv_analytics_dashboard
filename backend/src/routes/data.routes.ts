import express from "express";
import { getACVByQuarter } from "../controllers/data.controller";

const router = express.Router();

// GET: ACV by Quarter and Customer Type (dynamically generated)
//@ts-ignore
router.get("/acv-by-quarter", getACVByQuarter);

export default router;
