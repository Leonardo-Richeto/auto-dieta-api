exports.up = knex => knex.schema.createTable("diets", table => {
    table.increments("diet_id")
    table.text("dietName")
    table.integer("user_id").references("id").inTable("users")

    table.timestamp("created_at").default(knex.fn.now())
    table.timestamp("updated_at").default(knex.fn.now())
})

exports.down = knex => knex.schema.dropTable("diets")
