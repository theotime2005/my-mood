import express from "express";

import { checkUserAccess } from "../identities-access-management/middlewares/check-user-access.js";
import { addMoodController, addMoodSchema } from "./controllers/add-mood-controller.js";

const moodRoutes = express.Router();
moodRoutes.post("/api/moods", checkUserAccess, addMoodSchema, addMoodController);

export default moodRoutes;
