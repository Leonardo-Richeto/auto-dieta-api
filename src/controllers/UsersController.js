const { hash, compare } = require('bcryptjs')
const sqliteConnection = require('../database/sqlite')

class UsersController {
    async create(request, response){
        const { name, email, password } = request.body

        const database = await sqliteConnection()
        const checkUserExists = await database.get("SELECT * FROM users WHERE email = (?)", [email])

        if(checkUserExists) return response.status(401).json({ message: "Este e-mail já está em uso!" })

        const hashedPassword = await hash(password, 8)

        try {
            await database.run(
                "INSERT INTO users (name, email, password) VALUES(?, ?, ?)",
                [ name, email, hashedPassword ]
            )

            return response.status(201).json()
        } catch (error) {
            console.log(error)            
            return response.status(500).json({ message: "Algo deu errado, entre em contato com o suporte!" })
        }


    }

    async update(request, response){
        const { name, email, password, old_password } = request.body
        const user_id = request.user.id

        const database = await sqliteConnection()

        const user = await database.get("SELECT * FROM users WHERE id = (?)", [user_id])
        if(!user) return response.status(401).json({ message:"Usuário não encontrado." })

        const userWithUpdatedEmail = await database.get("SELECT * FROM users WHERE email = (?)", [email])
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

        try {
            await database.run(`
            UPDATE users SET
            name = ?,
            email = ?,
            password = ?,
            updated_at = DATETIME('now')
            WHERE id = ?`,
            [user.name, user.email, user.password, user_id]
        )

        return response.status(200).json()
        } catch (error) {
            console.log(error)
            return response.status(500).json({ message: "Algo deu errado, não foi possivel atualizar."})
        }

        
    }
}

module.exports = UsersController