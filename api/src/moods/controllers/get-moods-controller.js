import { logger } from "../../../logger.js";
import { getGlobalState } from "../repositories/moods-repository.js";
import getMoodsStatistics from "../services/get-moods-statistics.js";

async function getMoodsController(req, res, next) {
  try {
    const actualDate = new Date().toISOString().split("T")[0];
    const moods = await getGlobalState(actualDate);
    return res.status(200).json({
      data: getMoodsStatistics(moods),
    });
  } catch (error) {
    logger.error(`Error when fetching data, ${error}`);
    next(error);
  }
}

export { getMoodsController };
