const mongoose = require('mongoose')
const { Schema } = mongoose;

const notesSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    date: { type: Date, default: Date.now},
    ticker: { 
        type: String, 
        required: true
    },
    body: String,
    pnl: { 
        type: Number,
        default: 0
    }
});


module.exports = mongoose.model('notes', notesSchema)