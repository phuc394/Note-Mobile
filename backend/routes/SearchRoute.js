import express from "express";
import authMiddleware from "../middleware/AuthMiddleware.js";
import * as SearchController from "../controllers/SearchController.js";

const router = express.Router();

router.get("/", authMiddleware, (req, res) =>
  SearchController.searchNotes(req, res),
);

export default router;
