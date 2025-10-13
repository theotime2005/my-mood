import express from "express";

import controller from "./controller.js";

const health = express.Router();

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Check the health of the API
 *     description: Returns "api is ok!" if the API is healthy
 *     responses:
 *       200:
 *         description: API is healthy
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: api is ok!
 */
health.get("/api/health", controller);

export default health;
