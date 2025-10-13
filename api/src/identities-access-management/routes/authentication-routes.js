import express from "express";

import { loginController, loginSchema } from "../controllers/login-controller.js";

const authenticationRoutes = express.Router();

authenticationRoutes.post("/api/authentication/login", loginSchema, loginController);

export default authenticationRoutes;
