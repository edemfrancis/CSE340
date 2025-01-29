const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController");
const invCont = require("../controllers/invController");
const { route } = require("./static");

// Route to build inventory by classification view
router.get("/type/:classification_id", invCont.buildByClassificationId)
router.get("/detail/:classification_id", invController.buildByDetail)


module.exports = router;