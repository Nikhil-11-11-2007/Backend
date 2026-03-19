import express from "express";
import cors from "cors";
import downloadRoutes from "./routes/download.route.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static("./public"))

app.use("/api", downloadRoutes);

export default app