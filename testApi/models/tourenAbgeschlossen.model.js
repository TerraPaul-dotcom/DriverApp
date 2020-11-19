const mongoose = require('mongoose')

const tourenAbgeschlossenSchema = new mongoose.Schema({
    tourFahrerInput: {
    }
    
}, { strict: false })

module.exports = mongoose.model('tourenAbgeschlossen', tourenAbgeschlossenSchema)
