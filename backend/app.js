import dotenv from "dotenv";
import express from "express";
import AuthRoute from "./routes/AuthRoute.js";
import DeletedRoute from "./routes/DeletedRoute.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));




// Use routes
app.use('/auth', AuthRoute);

app.use('/deleted', DeletedRoute);


export default app;