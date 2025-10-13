import { errors } from "celebrate";
import cors from "cors";
import express from "express";

import { logger } from "./logger.js";
import health from "./src/shared/health/routes.js";

const server = express();

server.use(cors());
server.use(express.json());

// log requests
server.use((req, res, next) => {
  res.on("finish", () => {
    logger.info(`${req.method} ${req.url} ${res.statusCode}`);
  });
  next();
});

// Define routes here
server.use(health);
// Catch error here
server.use(errors);

export default server;
