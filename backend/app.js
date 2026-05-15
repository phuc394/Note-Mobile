import dotenv from "dotenv";
import express from "express";
import AuthRoute from "./routes/AuthRoute.js";
import DeletedRoute from "./routes/DeletedRoute.js";
import searchRoute from "./routes/SearchRoute.js";
dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use routes
app.use("/api/v1/auth", AuthRoute);
app.use("/api/v1/notes", NoteRoute);
app.use("/api/v1/deleted", DeletedRoute);
app.use("/search", searchRoute);
export default app;
