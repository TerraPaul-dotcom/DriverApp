const mongoose = require('mongoose')

const tourenAbgeschlossenSchema = new mongoose.Schema({
    tourFahrerInput: {
        
    },
    tourID: {
        type: Number
    },
    fahrerId: {
        type: Number
    },
    tourStart: {
        type: Date
    },
    tourStartGps: {
    },
    tourAbschnitte: {
        type: Array
    },
    tourStop: {
        type: Date
    },
    tourStopGps: {
    },
    
})

module.exports = mongoose.model('tourenAbgeschlossen', tourenAbgeschlossenSchema)
