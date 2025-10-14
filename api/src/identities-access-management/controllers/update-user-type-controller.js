import { celebrate, Joi } from "celebrate";

import { logger } from "../../../logger.js";
import { USER_TYPE } from "../../shared/constants.js";
import { updateUserTypeByUserId } from "../repositories/users-repository.js";
const updateUserTypeSchema = celebrate({
  params: Joi.object({
    userId: Joi.string().required(),
  }),
  body: Joi.object({
    userType: Joi.string().required().valid(...Object.values(USER_TYPE)),
  }),
});

async function updateUserTypeController(req, res, next) {
  try {
    const { userId } = req.params;
    const { userType } = req.body;
    await updateUserTypeByUserId({ userId, userType });
    res.status(200).send({ message: "User type updated successfully" });
  } catch (error) {
    logger.error(`Error updating user type: ${error}`);
    next(error);
  }
}
export { updateUserTypeController, updateUserTypeSchema };
