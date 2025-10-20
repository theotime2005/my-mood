import express from "express";

import { updateUserTypeController, updateUserTypeSchema } from "../controllers/update-user-type-controller.js";
import { checkUserAccess } from "../middlewares/check-user-access.js";
import { checkUserIsAdmin } from "../middlewares/check-user-is-admin.js";

const usersManagementRoutes = express.Router();
usersManagementRoutes.put("/api/users/:userId/user-type", checkUserAccess, checkUserIsAdmin, updateUserTypeSchema, updateUserTypeController);

export default usersManagementRoutes;
