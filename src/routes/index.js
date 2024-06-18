const { Router } = require('express')

const usersRoutes = require('./users.routes')
const dietsRoutes = require('./diets.routes')
const sessionsRoutes = require('./sessions.routes')
const forgotPasswordRoutes = require('./forgotPassword.routes')

const routes = Router()

routes.use("/users", usersRoutes)
routes.use("/sessions", sessionsRoutes)
routes.use("/diets", dietsRoutes)
routes.use("/forgot-password", forgotPasswordRoutes)

module.exports = routes