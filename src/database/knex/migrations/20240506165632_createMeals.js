exports.up = knex => knex.schema.createTable("meals", table => {
    table.increments("meal_id")
    table.text("mealName")
    table.integer("diet_id").references("diet_id").inTable("diets").onDelete("CASCADE")
})

exports.down = knex => knex.schema.dropTable("meals")