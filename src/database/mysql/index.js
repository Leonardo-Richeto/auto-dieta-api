const knex = require('knex');
require('dotenv').config()
const mysql = require('mysql2/promise');
const config = require('../../../knexfile')

const knexConfig = knex(config.production)

async function mysqlConnection() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });

    return connection
}

module.exports = { mysqlConnection, knexConfig }