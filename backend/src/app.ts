import express from "express";
import cors from "cors";
import dataRoutes from "./routes/data.routes";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/data", dataRoutes);

export default app;
