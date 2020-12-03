const mongoose = require('mongoose')

const tourSchema = new mongoose.Schema({
    test: {
        type: String
    }
}, { strict: false })

module.exports = mongoose.model('tourKosten', tourSchema)

