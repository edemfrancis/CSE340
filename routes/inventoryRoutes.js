const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController");
const invCont = require("../controllers/invController");

// Route to build inventory by classification view
router.get("/type/:classification_id", invCont.buildByClassificationId)

module.exports = router;