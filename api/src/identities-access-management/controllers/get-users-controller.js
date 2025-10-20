import { logger } from "../../../logger.js";
import { getAllUsers } from "../repositories/users-repository.js";

async function getUsersController(req, res, next) {
  try {
    const users = await getAllUsers();
    return res.status(200).json({
      data: users,
    });
  } catch (error) {
    logger.error(`Error fetching users, ${error}`);
    return next(error);
  }
}

export { getUsersController };
