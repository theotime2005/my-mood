import { afterAll, afterEach, beforeEach, vi } from "vitest";

import { knex } from "../db/knex-database-connection.js";


beforeEach(async () => {
  await knex.raw("TRUNCATE TABLE " +
        (await knex("pg_tables")
          .select("tablename")
          .where("schemaname", "public")
          .pluck("tablename"))
          .map((t) => `"${t}"`)
          .join(", ") +
        " RESTART IDENTITY CASCADE",
  );
});


afterEach(function() {
  vi.restoreAllMocks();
});

afterAll(async () => {
  await knex.destroy();
});
