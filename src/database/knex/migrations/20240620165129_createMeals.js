exports.up = knex => knex.schema.createTable("meals", table => {
    table.increments("meal_id").unsigned().primary()
    table.text("mealName", 255)
    table.integer("diet_id").unsigned().references("diet_id").inTable("diets").onDelete("CASCADE")
})

exports.down = knex => knex.schema.dropTable("meals")