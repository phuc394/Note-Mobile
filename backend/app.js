import dotenv from "dotenv";
import express from "express";
import NoteRoute from "./routes/NoteRoute.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/notes', NoteRoute);

export default app;