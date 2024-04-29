import express from 'express';
import cors from 'cors';
const app = express()
import initServer from './config/db.js';
import 'dotenv/config'
import farmerAuthRoute from './routes/farmerAuthRoute.js'

app.use(express.json());
app.use(
    cors({
        credentials: true,
        origin: '*',
        optionsSuccessStatus: 200,
    })
);

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
        data: "Hi there world",
    });
});



// Routes
app.use("/api/auth/farmer", farmerAuthRoute);
app.use("/api/auth/official", offic);



initServer(app);

