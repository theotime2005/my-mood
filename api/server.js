import { errors } from "celebrate";
import cors from "cors";
import express from "express";
import path from "path";

import { logger } from "./logger.js";
import authenticationRoutes from "./src/identities-access-management/routes/authentication-routes.js";
import userRoutes from "./src/identities-access-management/routes/user-routes.js";
import usersManagementRoutes from "./src/identities-access-management/routes/users-management-routes.js";
import moodRoutes from "./src/moods/routes.js";
import { AVAILABLE_SOURCES } from "./src/shared/constants.js";
import health from "./src/shared/health/routes.js";

const server = express();

server.use(cors());
server.use(express.json());

// serve front
server.use(express.static(path.join(process.cwd(), "dist")));

// log requests
server.use((req, res, next) => {
  res.on("finish", () => {
    logger.info(`${req.method} ${req.url} ${res.statusCode}`);
  });
  next();
});

// route to check api functionment
server.use(health);

// set source from request
server.use((req, res, next) => {
  // Check if req.headers.from is in the available sources
  if (req.headers.from && Object.values(AVAILABLE_SOURCES).includes(req.headers.from)) {
    req.source = req.headers.from;
    next();
  } else {
    return res.status(400).json({ error: "Invalid or missing 'from' header" });
  }
});

// Define routes here
server.use(authenticationRoutes);
server.use(usersManagementRoutes);
server.use(moodRoutes);
server.use(userRoutes);
// Catch error here
server.use(errors);

export default server;
