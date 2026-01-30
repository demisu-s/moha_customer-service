import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import plantRoutes from "./routes/plantRoutes";
import { errorHandler } from "./midllewares/errorMiddleware"
import depatmentRoutes from "./routes/departmentRoutes";
import deviceRoutes from "./routes/deviceRoutes";
import serviceRequesstRoutes from "./routes/serviceRequestRoutes";
import cors from "cors";

dotenv.config();

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(cors());

const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/plant", plantRoutes);
app.use("/api/department", depatmentRoutes);
app.use("/api/device", deviceRoutes);
app.use("/api/request",serviceRequesstRoutes);


app.use(errorHandler);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI || "", {})
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
