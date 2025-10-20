import { logger } from "../../../logger.js";
import { findUserByUserId } from "../repositories/users-repository.js";

async function checkUserType(req, res, next, acceptedUserType) {
  try {
    const foundUser = await findUserByUserId(req.auth.userId);
    if (foundUser.userType !== acceptedUserType) {
      return res.status(403).send();
    }
    next();
  } catch (error) {
    logger.error(`Error in checkUserType middleware: ${error}`);
    return res.status(500).send();
  }
}

export { checkUserType };
