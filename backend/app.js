import dotenv from "dotenv";
import express from "express";
import AuthRoute from "./routes/AuthRoute.js";
import DeletedRoute from "./routes/DeletedRoute.js";
import NoteRoute from "./routes/NoteRoute.js";
dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use routes
app.use("/api/v1/auth", AuthRoute);
app.use("/api/v1/notes", NoteRoute);
app.use("/api/v1/deleted", DeletedRoute);

export default app;
