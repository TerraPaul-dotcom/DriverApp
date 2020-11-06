const mongoose = require('mongoose')

const tourSchema = new mongoose.Schema({
    test: {
        type: String
    }
})

module.exports = mongoose.model('tourKosten', tourSchema)

