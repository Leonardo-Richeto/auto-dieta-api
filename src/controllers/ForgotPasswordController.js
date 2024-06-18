const knex = require('../database/knex')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const authConfig = require('../configs/auth')

const transporter = require('../configs/transporter')
require('dotenv').config()

class ForgotPasswordController{
    async createToken(request, response){
        const { email } = request.body

        const user = await knex("users").where({ email }).first()

        if(!user) return response.status(401).json({ message: "Este e-mail não está cadastrado"})

        const { secret } = authConfig.jwt
        const token = jwt.sign(
            { user_id: user.id },
            secret,
            { expiresIn: '1h' }
            )

            const resetUrl = `http://localhost:5173/forgot-password/reset-password/${token}`

            const mailOptions = {
                to: user.email,
                from: 'leonardo-richeto@hotmail.com',
                subject: 'Redefinição de senha',
                text: `Você está recebendo isto porque você (ou alguém) solicitou a redefinição da senha da sua conta.\n\n
                Por favor, clique no seguinte link ou cole no seu navegador para completar o processo:\n\n
                ${resetUrl}\n\n
                Se você não solicitou isto, por favor ignore este e-mail e sua senha permanecerá inalterada.\n`
            }

            try {
                await transporter.sendMail(mailOptions)
                return response.status(200).json({ message: `Um e-mail de redefinição de senha foi enviado para ${user.email}`})
            } catch (error) {
                return response.status(500).json({ message: 'Erro ao enviar e-mail..'})
            }

    }

    async resetPassword(request, response){
        const { token, newPassword } = request.body

        try {
            const { secret } = authConfig.jwt
            const decoded = jwt.verify(token, secret)

            const user = await knex("users").where({ id: decoded.user_id }).first()

            if(!user) return response.status(401).json({ message: "Usuário não encontrado" })

            const hashedPassword = await bcrypt.hash(newPassword, 8)

            await knex("users")
            .update({ password: hashedPassword })
            .where({ id: user.id })

            return response.status(200).json({ message: "Senha redefinida com sucesso" })

        } catch (error) {
            console.error(error)
            return response.status(400).json({ message: "Token inválido ou expirado." })
        }
    }
}

module.exports = ForgotPasswordController