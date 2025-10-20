import { EMOTIONAL_STATES } from "../constants.js";

/**
 * This function returns an object with name and percentage
 * For example
 * {HAPPY: 60%, SAD: 40%}
 * Based on EMOTIONAL_STATES
 * @param {Array} data - Array of mood entries
 * @returns {object} - Object with mood statistics
 */
export default function getMoodsStatistics(data = []) {
  if (!Array.isArray(data)) {
    throw new TypeError("data must be an array");
  }

  // Préparer structure initiale à partir des clefs de EMOTIONAL_STATES
  const keys = Object.keys(EMOTIONAL_STATES); // ['HAPPY', 'SAD', ...]
  const stats = {};
  keys.forEach((key) => {
    stats[key] = {
      count: 0,
      motivationSum: 0,
      motivationCount: 0,
    };
  });

  // Compter les occurrences et sommer les motivations valides
  let totalCount = 0;
  data.forEach((entry) => {
    if (!entry || typeof entry !== "object") return;
    const { emotionalState, motivation } = entry;
    // Trouver la clé correspondant à la valeur string, ex 'happy' -> 'HAPPY'
    const matchingKey = keys.find(
      (k) => EMOTIONAL_STATES[k] === emotionalState,
    );
    if (!matchingKey) return; // état non reconnu -> on ignore

    stats[matchingKey].count += 1;
    totalCount += 1;

    const m = Number(motivation);
    if (!Number.isNaN(m) && m >= 1 && m <= 10) {
      stats[matchingKey].motivationSum += m;
      stats[matchingKey].motivationCount += 1;
    }
  });

  // Construire le résultat final : pourcentage et moyenne de motivation
  const result = {};
  keys.forEach((key) => {
    const { count, motivationSum, motivationCount } = stats[key];
    const percentage = totalCount === 0 ? 0 : (count / totalCount) * 100;
    const averageMotivation =
      motivationCount === 0 ? null : motivationSum / motivationCount;

    result[key] = {
      percentage: Math.round(percentage * 10) / 10, // 1 décimale
      averageMotivation:
        averageMotivation === null
          ? null
          : Math.round(averageMotivation * 100) / 100, // 2 décimales
    };
  });

  return result;
}
