exports.up = knex => knex.schema.createTable("foods", table => {
    table.increments("foods_id").unsigned().primary()
    table.integer("meal_id").unsigned().references("meal_id").inTable("meals").onDelete("CASCADE")
    table.json("foods")
})

exports.down = knex => knex.schema.dropTable("foods")