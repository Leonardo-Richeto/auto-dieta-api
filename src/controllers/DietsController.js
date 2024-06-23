const knex = require('../database/knex')

class DietsController{
    async create(request, response){
        const { diet } = request.body
        const user_id = request.user.id

        const dietName = diet.dietName

        try {
            await knex.transaction( async trx => {
                const diet_id = await trx("diets").insert({
                    dietName: dietName,
                    user_id
                })
                
                for(const meal of diet.meals){
                    const mealName = meal.mealName
                    const meal_id =  await trx("meals").insert({
                        mealName: mealName,
                        diet_id: diet_id
                    })
                    
                    for(const food of meal.foods){
                        const foodsJson = JSON.stringify(food)
                        await trx("foods").insert({
                            foods: foodsJson,
                            meal_id: meal_id
                        })
                    }
                }
            })

            response.status(200).json()   
        } catch (error) {
            console.log(error)
            response.status(500).json({ message: "Algo deu errado, entre em contato com o suporte!" })
        }
    }

    async update(request, response){
        const { diet } = request.body
        const user_id = request.user.id

        const { diet_id, dietName } = diet

        try{
            await knex.transaction(async trx => {
                await trx("diets")
                .where({ diet_id , user_id })
                .update({
                    dietName,
                    updated_at: trx.fn.now()
                })

            const mealIds = await trx("meals")
                .where({ diet_id })
                .pluck("meal_id")

                await trx("foods")
                .whereIn("meal_id", mealIds)
                .del()

                await trx("meals")
                .where({ diet_id })
                .del()

            for(const meal of diet.meals){
                const { mealName, foods } = meal

                const newMealId = (await trx("meals")
                .insert({
                    mealName,
                    diet_id
                    })
                )

                for(const food of foods){
                    const foodsJson = JSON.stringify(food)

                    await trx("foods")
                    .insert({
                        foods: foodsJson,
                        meal_id: newMealId
                    })
            }
        }
    })
        response.status(200).json()
    }catch(error){
        response.status(500).json({ message: "Algo deu errado, entre em contato com o suporte!"})
    }
}

    async delete(request, response){
        const { diet_id } = request.params
        const user_id = request.user.id

        try {
            await knex("diets").where({ diet_id, user_id }).delete()
            return response.json()
        } catch (error) {
            return response.status(500).json({ message: "Erro ao deletar a dieta." })
        }
    }

    async index(request, response){
        const user_id = request.user.id

        try {
            const diets = await knex("diets")
            .select("diet_id", "dietName", "created_at", "updated_at")
            .where("user_id", "=", user_id)
    
            for(const diet of diets){
                const meals = await knex("meals")
                .select("meal_id", "mealName")
                .where("diet_id", "=", diet.diet_id)
    
                for(const meal of meals){
                    const foods = await knex("foods")
                    .select("foods")
                    .where("meal_id", "=", meal.meal_id)

                    meal.foods = foods.map(food => food.foods)
                }
                diet.meals = meals
            }
        
            return response.json(diets)
        } catch (error) {
            console.log(error)
            return response.status(500).json({ message: "Erro ao buscar suas dietas."})
        }
    }
}

module.exports = DietsController