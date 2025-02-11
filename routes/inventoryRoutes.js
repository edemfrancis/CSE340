const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController");
const invCont = require("../controllers/invController");
const regValidate = require("../utilities/account-validation");

const utilities = require("../utilities")
const account = require("../controllers/accountControllers");


const { route } = require("./static");

// Route to build inventory by classification view
router.get("/type/:classification_id", invCont.buildByClassificationId)
router.get("/detail/:classification_id", invController.buildByDetail)


// add inventory routes
// ACTIVTIY WEEK 4
/* *********************************************
  ********************************************
  WEEK 4 Assignment 
  ******************************************** */
// adding add classification routes
router.get("/management", utilities.handleErrors(account.managementView));
router.get(
  "/cclassification-view",
  utilities.handleErrors(account.addClassificationView)
);
router.post(
  "/cclassification-view",
  regValidate.classification_name_rules(),
  regValidate.checkClasificationNameData,
  utilities.handleErrors(account.sanValClassification)
);

// add inventory routes
router.get("/add-vehicle", invCont.buildDropDownList)
router.post(
  "/add-vehicle",
  regValidate.vehicleRules(),
  regValidate.checkVehicleData,
  utilities.handleErrors(invController.addVehicle)
)

module.exports = router;