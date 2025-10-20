import { describe, expect, it } from "vitest";

import { EMOTIONAL_STATES } from "../../../../src/moods/constants.js";
import getMoodsStatistics from "../../../../src/moods/services/get-moods-statistics.js";

describe("Unit | Moods | Services | Get moods statistics", () => {
  describe("#getMoodsStatistics", () => {
    it("returns zeros and nulls for empty data", () => {
      // given
      const data = [];

      // when
      const res = getMoodsStatistics(data);

      // then
      const keys = Object.keys(EMOTIONAL_STATES);
      keys.forEach((k) => {
        expect(res).toHaveProperty(k);
        expect(res[k].percentage).toBe(0);
        expect(res[k].averageMotivation).toBeNull();
      });
    });

    it("calculates percentages and averages correctly", () => {
      // given
      const data = [
        { emotionalState: EMOTIONAL_STATES.HAPPY, motivation: 8 },
        { emotionalState: EMOTIONAL_STATES.HAPPY, motivation: 6 },
        { emotionalState: EMOTIONAL_STATES.SAD, motivation: 3 },
        { emotionalState: EMOTIONAL_STATES.RELAXED, motivation: "5" },
        { emotionalState: "unknown", motivation: 10 }, // ignored
      ];

      // when
      const res = getMoodsStatistics(data);

      // then
      // totalCount = 4 valid entries (unknown ignored)
      expect(res.HAPPY.percentage).toBe(50); // 2/4
      expect(res.SAD.percentage).toBe(25); // 1/4
      expect(res.RELAXED.percentage).toBe(25);

      // average motivations
      expect(res.HAPPY.averageMotivation).toBe(7); // (8+6)/2
      expect(res.SAD.averageMotivation).toBe(3);
      expect(res.RELAXED.averageMotivation).toBe(5);
      // emotions without entries remain null
      expect(res.ANGRY.averageMotivation).toBeNull();
    });

    it("ignores invalid motivations", () => {
      // given
      const data = [
        { emotionalState: EMOTIONAL_STATES.EXCITED, motivation: 11 }, // out of range
        { emotionalState: EMOTIONAL_STATES.EXCITED, motivation: "NaN" },
        { emotionalState: EMOTIONAL_STATES.EXCITED },
      ];

      // when
      const res = getMoodsStatistics(data);

      // then
      expect(res.EXCITED.percentage).toBe(100);
      expect(res.EXCITED.averageMotivation).toBeNull();
    });
  });
});
