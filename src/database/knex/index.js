const config = require('../../../knexfile')
const knex = require('knex')

const database = knex(config.development)

module.exports = database