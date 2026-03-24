import "dotenv/config";
import express from "express";
import cors from "cors";
import healthRouter from "./routes/health";
import fragrancesRouter from "./routes/fragrances";

const app = express();
const PORT = process.env.PORT ?? 3000;

// CORS — restrict to the deployed client URL in production;
// fall back to * for local dev when CLIENT_URL is not set.
app.use(
  cors({
    origin: process.env.CLIENT_URL ?? "*",
  })
);

app.use(express.json());

app.use("/api", healthRouter);
app.use("/api/fragrances", fragrancesRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
