import { celebrate, Joi } from "celebrate";

import { logger } from "../../../logger.js";
import { EMOTIONAL_STATES } from "../constants.js";
import { addMood } from "../repositories/moods-repository.js";

const addMoodSchema = celebrate({
  body: Joi.object({
    emotionalState: Joi.string().required().valid(...Object.values(EMOTIONAL_STATES)),
    motivation: Joi.number().required().min(1).max(10),
  }),
});

async function addMoodController(req, res, next) {
  try {
    const userId = req.auth.userId;
    const { emotionalState, motivation } = req.body;
    await addMood({ userId, emotionalState, motivation });
    res.status(201).send();
  } catch (error) {
    logger.error(`Error in addMoodController: ${error}`);
    next(error);
  }
}

export { addMoodController, addMoodSchema };
