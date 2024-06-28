require('dotenv/config')
require('express-async-errors')
require('dotenv').config()
const AppError = require('./utils/AppError')
const uploadConfig = require('./configs/upload')
const express = require('express')
const cors = require('cors')
const app = express()

const routes = require('./routes')

app.use(express.json())
app.use(cors())

app.use("/files", express.static(uploadConfig.UPLOADS_FOLDER))

app.use(routes)
app.use(( error, request, response, next) => {
    if(error instanceof AppError){
    return response.status(error.statusCode).json({
        status: "error",
        message: error.message
    })
    }
    console.error(error)
    return response.status(500).json({
        status: "error",
        message: "Internal server error"
    })
})

const PORT = process.env.PORT || 3000
const BASE_URL = process.env.BASE_URL || 'http://localhost'

app.listen(PORT, () => console.log(`Server is running on ${BASE_URL}:${PORT}`))