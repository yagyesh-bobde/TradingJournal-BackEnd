const mongoose = require('mongoose')
require('dotenv').config()
const db_uri = process.env.DB_URI || 'mongodb://localhost:27017/tradingjournal'

const db_connect =  () => (
    mongoose.connect(db_uri, () => (
        console.log('Connected the the database')
    ))
)

module.exports = db_connect;