import express from "express";
import cors from "cors";
const app = express();
import initServer from "./config/db.js";
import "dotenv/config";
import farmerAuthRoute from "./routes/farmerAuthRoute.js";
import officialfAuthRoute from "./routes/officialAuthRoute.js";
import formRoutes from "./routes/formRoutes.js";
import communityRoutes from "./routes/communityRoutes.js";
import transactionRoutes from "./routes/transactionRoute.js";
import panchayatRoutes from "./routes/panchayatAuthRoutes.js";
import Response from "./entities/Response.js";
import adminRoutes from "./routes/adminRoutes.js";

app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: "*",
    optionsSuccessStatus: 200,
  })
);

app.use((err, req, res, next) => {
  console.log(err);
  const status = err.status || 500;
  const message = err.message || "SERVER_ERR";
  const data = err.data || null;

  new Response(status, message, data).error(res);
});

app.get("/", (req, res) => {
  new Response(
    200,
    "Hey There VGFA here up and running",
    "Hi there world"
  ).success(res);
});

// Routes
app.use("/api/auth/farmer", farmerAuthRoute);
app.use("/api/auth/official", officialfAuthRoute);
app.use("/api/auth/panchayat", panchayatRoutes);
app.use("/api/forms", formRoutes);
app.use("/api/community", communityRoutes);
app.use("/api/transaction", transactionRoutes);
app.use("/api/auth/admin", adminRoutes);

initServer(app);
