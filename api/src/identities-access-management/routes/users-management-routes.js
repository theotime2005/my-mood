import express from "express";

import { updateUserTypeController, updateUserTypeSchema } from "../controllers/update-user-type-controller.js";

const usersManagementRoutes = express.Router();
usersManagementRoutes.put("/api/users/:userId/user-type", updateUserTypeSchema, updateUserTypeController);

export default usersManagementRoutes;
