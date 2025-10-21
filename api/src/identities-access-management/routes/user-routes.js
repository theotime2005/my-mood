import express from "express";

import { getUserInfoController } from "../controllers/get-user-info-controller.js";
import { checkUserAccess } from "../middlewares/check-user-access.js";

const userRoutes = express.Router();
userRoutes.get("/api/user", checkUserAccess, getUserInfoController);

export default userRoutes;
