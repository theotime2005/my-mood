const TABLE_NAME = "moods";

/**
 * @param { import("knex").Knex } knex - The Knex instance
 * @returns { Promise<void> }
 */
async function up(knex) {
  await knex.schema.createTable(TABLE_NAME, (table) => {
    table.increments("id").primary();
    table.integer("userId").notNullable().references("id").inTable("users").onDelete("CASCADE");
    table.string("emotionalState").notNullable().comment("The user emotional state, e.g., happy, sad, anxious");
    table.integer("motivation").notNullable().comment("The user motivation");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex - The Knex instance
 * @returns { Promise<void> }
 */
async function down(knex) {
  await knex.schema.dropTable(TABLE_NAME);
};

export { down, up };
