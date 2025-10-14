import { logger } from "../../../logger.js";
import { decodedToken } from "../services/token-service.js";

async function checkUserAccess(req, res, next) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const data = decodedToken(token);
    req.auth = data;
    next();
  } catch (error) {
    logger.error(`Error with user access: ${error}`);
    res.status(401).json({ message: "Unauthorized" });
  }
}

export { checkUserAccess };
