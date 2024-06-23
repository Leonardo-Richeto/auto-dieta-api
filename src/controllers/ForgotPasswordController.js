const knex = require('../database/knex/index')
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

            const htmlMail = `
            <html>
                <style>
                    *{
                        text-align: center;
                        color: inherit;
                        font-family: Inter, sans-serif;
                        font-size: 16px;
                    }
            
                    body{
                        background: inherit;
                    }
            
                    div{
                        max-width: 425px;
                        align-items: center;
                        margin: auto;
                        display: block;
                    }
            
                    a{
                        font-size: 1.1rem;
                        border-radius: 15px;
                        border: 1px solid darkgray;
                        color: #FFFFFF;
                        background: #2E8B57;
                        padding: 10 22px;
                        height: 2.2rem;
                        box-shadow: 1px 1px 2px 0 gray;
                        text-decoration: none;
                    }
            
                    .warning{
                        opacity: 0.5;
                        font-size: .8rem;
                    }
                </style>
            
                <head>
                <title>Auto Dieta</title>
                </head>
                <body>
                    <div>
                        <h1>Olá, ${user.name}!</h1>
                        <p>Vamos te ajudar a recuperar o acesso ao seu planejamento</p>
                        <p>assim você terá seus resultados</p>
                        <a href="${resetUrl}">Recuperar acesso a dieta!</a>
                        <p>Atenciosamente,</p>
                        <p>Equipe AutoDieta</p>
                        <p class="warning">Caso você não tenha solicitado este email, apenas ignore!</p>
                    </div>
                </body>
            </html>
            `

            const mailOptions = {
                to: user.email,
                from: 'suporte@autodieta.com.br',
                subject: 'Redefinição de senha',
                html: htmlMail
            }

            try {
                await transporter.sendMail(mailOptions)
                return response.status(200).json({ message: `Um e-mail de redefinição de senha foi enviado para ${user.email}`})
            } catch (error) {
                console.log(error)
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