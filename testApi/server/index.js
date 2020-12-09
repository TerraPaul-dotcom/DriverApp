//if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
  //}
  
const express = require('express')
const bodyParser = require('body-parser')
const cors = require("cors")
const tourRouter = require('../routes/tour.routes')
const tourenAbgeschlossenRouter = require('../routes/tourenAbgeschlossen.routes')


const app = express()



//Middleware

const corsOptions = {
    origin: "http://localhost:8080"
}

app.use(cors(corsOptions))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.send('hi')
})

//Datenbank MongoDB

const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true   })
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))

const port = process.env.PORT || 4000

//Routes
app.use('/api/tour', tourRouter)
app.use('/api/tourenAbgeschlossen', tourenAbgeschlossenRouter)


app.listen(port, () => console.log(`Server started on port ${port}`)) 

