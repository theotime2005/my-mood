import { beforeEach, describe, expect, it, vi } from "vitest";

import controller from "../../../../src/shared/health/controller.js";

describe("Unit | Shared | Health | Controller", () => {
  let res;
  beforeEach(() => {
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnValue(),
      send: vi.fn().mockReturnValue(),
      text: vi.fn().mockReturnValue(),
    };
  });
  it("should call res.status and res.send", async () => {
    // given
    const req = {};

    // when
    await controller(req, res);

    // then
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith("api is ok!");
  });
});
