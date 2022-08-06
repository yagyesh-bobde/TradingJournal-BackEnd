const express= require('express')
const db_connect = require('./db')
var cors = require('cors')
require('dotenv').config()
// Connect to database
db_connect();
// Initiate express server
var app = express()

app.use(cors())
const port = process.env.PORT || 5000 ;

// Middleware to send json requests
app.use(express.json())


// Create routes
app.use('/api/auth' , require('./routes/auth'))
app.use('/api/journal', require('./routes/journal'))

//* FRONTEND FOR PRODUCTION BUILD
if (process.env.NODE_ENV === 'production') {
    // Exprees will serve up production assets
    app.use(express.static('client/build'));

    // // Express serve up index.html file if it doesn't recognize route
    const path = require('path');
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}
// Listen on port
app.listen( port , () => {
    console.log(`Example app listening is listening on ${port}`)
})