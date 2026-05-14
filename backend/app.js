import dotenv from "dotenv";
import express from "express";
import AuthRoute from "./routes/AuthRoute.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));




// Use routes
app.use('/auth', AuthRoute);

export default app;