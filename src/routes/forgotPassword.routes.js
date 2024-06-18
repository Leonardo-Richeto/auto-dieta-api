const { Router } = require("express")
const forgotPasswordRoutes = Router()

const ForgotPasswordController = require('../controllers/ForgotPasswordController')
const forgotPasswordController = new ForgotPasswordController()

forgotPasswordRoutes.post("/create-token", forgotPasswordController.createToken)
forgotPasswordRoutes.post("/reset-password/:token", forgotPasswordController.resetPassword)

module.exports = forgotPasswordRoutes