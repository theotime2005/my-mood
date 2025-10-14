import { USER_TYPE } from "../../shared/constants.js";
import { findUserByUserId } from "../repositories/users-repository.js";

async function checkUserIsAdmin(req, res, next) {
  const foundUser = await findUserByUserId(req.auth.userId);
  if (foundUser) {
    if (foundUser.userType === USER_TYPE.ADMIN) {
      return next();
    } else {
      return res.status(403).json({ message: "Forbidden" });
    }
  } else {
    return res.status(404).json({ message: "User not found" });
  }
}

export { checkUserIsAdmin };
