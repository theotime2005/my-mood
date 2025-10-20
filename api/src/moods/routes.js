import express from "express";

import { checkUserAccess } from "../identities-access-management/middlewares/check-user-access.js";
import { checkUserType } from "../identities-access-management/middlewares/check-user-type.js";
import { USER_TYPE } from "../shared/constants.js";
import { addMoodController, addMoodSchema } from "./controllers/add-mood-controller.js";
import { getMoodsController } from "./controllers/get-moods-controller.js";

const moodRoutes = express.Router();
moodRoutes.post("/api/moods", checkUserAccess, addMoodSchema, addMoodController);
moodRoutes.get("/api/moods", checkUserAccess, ((req, res, next) => {
  return checkUserType(req, res, next, USER_TYPE.MANAGER);
}), getMoodsController);

export default moodRoutes;
