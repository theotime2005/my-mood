import { describe, expect, it } from "vitest";

import databaseBuilder from "../../../../db/database-builder/index.js";
import { knex } from "../../../../db/knex-database-connection.js";
import * as userRepository from "../../../../src/identities-access-management/repositories/users-repository.js";
import { USER_TYPE } from "../../../../src/shared/constants.js";

describe("Integration | Identities Access Management | Repositories | User repository", () => {
  describe("#findUserByEmail", () => {
    it("should return user information", async () => {
      // given
      const createdUser = await databaseBuilder.factory.buildUser();

      // when
      const result = await userRepository.findUserByEmail(createdUser.email);

      // then
      expect(result).toBeDefined();
      expect(result.id).toBe(createdUser.id);
      expect(result.email).toBe(createdUser.email);
    });

    it("should return null if user not found", async () => {
      // when
      const result = await userRepository.findUserByEmail("toto@example.net");

      // then
      expect(result).toBeNull();
    });
  });

  describe("#updateLastLoggedAtByUserId", () => {
    it("should update successful last logged date of user", async () => {
      // given
      const createdUser = await databaseBuilder.factory.buildUser({
        lastLoggedAt: new Date("2020-01-01T00:00:00Z"),
      });

      // when
      const result = await userRepository.updateLastLoggedAtByUserId(createdUser.id);

      // then
      expect(result).toEqual(1);
      const updatedUser = await knex("users").where({ id: createdUser.id }).first();
      expect(updatedUser.lastLoggedAt).toBeDefined();
      expect(new Date(updatedUser.lastLoggedAt).getTime()).toBeGreaterThan(new Date("2020-01-01T00:00:00Z").getTime());
    });

    it("should return 0 if user id not found", async () => {
      // when
      const result = await userRepository.updateLastLoggedAtByUserId(9999);

      // then
      expect(result).toEqual(0);
    });
  });

  describe("#updateUserTypeByUserId", () => {
    it("should update the user type successfully", async () => {
      // given
      const createdUser = await databaseBuilder.factory.buildUser({ userType: USER_TYPE.MANAGER });

      // when
      const result = await userRepository.updateUserTypeByUserId({ userId: createdUser.id, userType: USER_TYPE.EMPLOYER });

      // then
      expect(result).toEqual(1);
      const updatedUser = await knex("users").where({ id: createdUser.id }).first();
      expect(updatedUser.userType).toBe(USER_TYPE.EMPLOYER);
    });
  });

  describe("#findUserByUserId", () => {
    it("should return user information", async () => {
      // given
      const createdUser = await databaseBuilder.factory.buildUser();

      // when
      const result = await userRepository.findUserByUserId(createdUser.id);

      // then
      expect(result).toBeDefined();
      expect(result.id).toBe(createdUser.id);
      expect(result.email).toBe(createdUser.email);
    });

    it("should return null if user not found", async () => {
      // given
      const nonExistentUserId = 9999;

      // when
      const result = await userRepository.findUserByUserId(nonExistentUserId);

      // then
      expect(result).toBeNull();
    });
  });
});
