import { logger } from "../../../logger.js";
import { findUserByUserId } from "../repositories/users-repository.js";

async function getUserInfoController(req, res, next) {
  try {
    const foundUser = await findUserByUserId(req.auth.userId);
    if (foundUser) {
      return res.status(200).json({
        data: {
          firstname: foundUser.firstname,
          lastname: foundUser.lastname,
          email: foundUser.email,
          userType: foundUser.userType,
        },
      });
    }
    return res.status(404).send();
  } catch (error) {
    logger.error(`Error fetching user info: ${error}`);
    next(error);
  }
}

export { getUserInfoController };
