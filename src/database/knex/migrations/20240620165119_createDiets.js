exports.up = knex => knex.schema.createTable("diets", table => {
    table.increments("diet_id").unsigned().primary()
    table.text("dietName", 255)
    table.integer("user_id").unsigned().references("id").inTable("users").onDelete("CASCADE")

    table.timestamp("created_at").default(knex.fn.now())
    table.timestamp("updated_at").default(knex.fn.now())
})

exports.down = knex => knex.schema.dropTable("diets")
