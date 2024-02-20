import express from 'express';
import cors from 'cors';
const app = express()
import initServer from './config/db.js';
import 'dotenv/config'
// const { API_ENDPOINT_NOT_FOUND_ERR, SERVER_ERR } = require("./errors");
import authRoutes from './routes/authRoute.js'

app.use(express.json());
app.use(
    cors({
        credentials: true,
        origin: '*',
        optionsSuccessStatus: 200,
    })
);

// Global error handler
app.use((err, req, res, next) => {
    console.log(err);
    const status = err.status || 500;
    const message = err.message || "SERVER_ERR";
    const data = err.data || null;
    res.status(status).json({
        type: "error",
        message,
        data,
    });
});

app.get("/", (req, res) => {
    res.status(200).json({
        type: "success",
        message: "Hey There VGFA here up and running",
        data: null,
    });
});

// Routes
app.use("/api/auth", authRoutes);


initServer(app);

