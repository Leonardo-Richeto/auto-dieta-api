exports.up = knex => knex.schema.createTable("foods", table => {
    table.increments("foods_id")
    table.integer("meal_id").references("meal_id").inTable("meals").onDelete("CASCADE")
    table.json("foods")
})

exports.down = knex => knex.schema.dropTable("foods")