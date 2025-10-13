import { celebrate, Joi } from "celebrate";

import { AVAILABLE_SOURCES, USER_TYPE } from "../../shared/constants.js";
import { findUserByEmail } from "../repositories/users-repository.js";
import { checkPassword } from "../services/password-service.js";
import { encodedToken } from "../services/token-service.js";

const loginSchema = celebrate({
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

async function loginController(req, res, next) {
  try {
    const { email, password } = req.body;
    const foundUser = await findUserByEmail(email);
    if (!foundUser || !await checkPassword(password, foundUser.hashedPassword)) {
      return res.status(401).json({ message: "Invalid email or password" });
    } else if (req.source === AVAILABLE_SOURCES.MANAGEMENT && foundUser.userType !== USER_TYPE.ADMIN) {
      return res.status(403).json({ message: "Forbidden" });
    }
    const token = encodedToken({ userId: foundUser.id, userType: foundUser.userType });
    return res.status(200).json({ token });
  } catch (error) {
    next(error);
  }
}

export { loginController, loginSchema };
