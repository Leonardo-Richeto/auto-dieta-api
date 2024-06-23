const { hash, compare } = require('bcryptjs')
const knex = require('../database/knex/index')
class UsersController {
    async create(request, response){
        const { name, email, password } = request.body

        try {
            const checkUserExists = await knex("users").where({ email }).first()

            if(checkUserExists) return response.status(401).json({ message: "Este e-mail já está em uso!" })

            const hashedPassword = await hash(password, 8)

            await knex("users").insert({
                name,
                email,
                password: hashedPassword
            })
            
            return response.status(201).json()
        } catch (error) {
            console.log(error)            
            return response.status(500).json({ message: "Algo deu errado, entre em contato com o suporte!" })
        }
    }

    async update(request, response){
        const { name, email, password, old_password } = request.body
        const user_id = request.user.id

        try {
            const user = await knex('users').where({ id: user_id }).first()
            if(!user) return response.status(401).json({ message:"Usuário não encontrado." })

            const userWithUpdatedEmail = await knex("users").where({ email }).first()
            if(userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) return response.status(401).json({ message: "Este e-mail já está em uso." })

            user.name = name ?? user.name
            user.email = email ?? user.email

            if(password && !old_password) return response.status(401).json({ message: "A senha antiga precisa ser informada!" })

            if(password && old_password){
                const checkOldPassword = await compare(old_password, user.password)
                if(!checkOldPassword) return response.status(401).json({ message: "A senha antiga nao confere." })

                const checkNewPassword = await compare(password, user.password)
                if(checkNewPassword) return response.status(401).json({ message:"A nova senha precisa ser diferente da atual." })

                user.password = await hash(password, 8)
            }

            await knex("users")
            .where({ id: user_id })
            .update({
                name: user.name,
                email: user.email,
                password: user.password,
                updated_at: knex.fn.now()
            })

        return response.status(200).json()
        } catch (error) {
            console.log(error)
            return response.status(500).json({ message: "Algo deu errado, não foi possivel atualizar."})
        }
    }
}

module.exports = UsersController