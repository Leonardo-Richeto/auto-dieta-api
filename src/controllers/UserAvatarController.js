const knex = require('../database/knex')
const DiskStorage = require('../providers/DiskStorage')

class UserAvatarController{
    async update(request, response){
        const user_id = request.user.id
        const avatarFilename = request.file.filename

        const diskStorage = new DiskStorage()

        const user = await knex("users").where({ id: user_id }).first()

        if(!user) return response.status(401).json({ message: "Faça o login para atualizar sua foto." })

        if(user.avatar){
            try {
                await diskStorage.deleteFile(user.avatar)
            } catch (error) {
                console.error(error)
            }
        }

        const fileName = await diskStorage.saveFile(avatarFilename)
        user.avatar = fileName

        await knex("users").update(user).where({ id: user_id })

        return response.json(user)
    }
}

module.exports = UserAvatarController