const controller = require('../controllers/tour.controller.js')


// ----------------------------- //
const express = require('express')
const router = express.Router() 

//Create new item
router.post('/', controller.create)

//Retrieve all
router.get('/', controller.findAll)

//update one
router.put("/:id", controller.update)

//delete one
router.delete("/:id", controller.delete)

//Find by Id
router.get("/ID/:id", controller.findById)

//Retrieve newest Item
router.get('/newest/', controller.findNewest)



module.exports = router