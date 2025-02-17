const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController");
const invCont = require("../controllers/invController");
const regValidate = require("../utilities/account-validation");
const invValidate = require("../utilities/inventory-validation")

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
router.get("/add-vehicle", utilities.isAuthorized, invCont.buildDropDownList)
router.post(
  "/add-vehicle",
  regValidate.vehicleRules(),
  regValidate.checkVehicleData,
  utilities.handleErrors(invController.addVehicle)
)

// WEEK 5 ASSIGNMNENT, creating aa route for displaying table in management view
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))
router.get("/delete/:inv_id", utilities.isAuthorized, utilities.handleErrors(invController.deleteView))
router.post("/delete", utilities.handleErrors(invController.deleteItem))

router.get("/edit/:inv_id", utilities.isAuthorized, utilities.handleErrors(invController.buildVehicleEdit))
.post(
  "/update",
  utilities.isAuthorized,
  regValidate.vehicleRules(),
  invValidate.checkVehicleUpdateData,
  utilities.handleErrors(invController.updateVehicle))

module.exports = router;