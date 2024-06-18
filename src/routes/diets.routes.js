const { Router } = require("express")
const dietsRoutes = Router()

const ensureAuthenticated = require('../middlewares/ensureAuthenticated')

const DietsController = require('../controllers/DietsController')
const dietsController = new DietsController()

dietsRoutes.use(ensureAuthenticated)

dietsRoutes.get("/", dietsController.index)
dietsRoutes.post("/", dietsController.create)
dietsRoutes.put("/", dietsController.update)
dietsRoutes.delete("/:diet_id", dietsController.delete)

module.exports = dietsRoutes