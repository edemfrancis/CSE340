const express = require("express");
const router = new express.Router();
const account = require("../controllers/accountControllers");
const utilities = require("../utilities");
const regValidate = require("../utilities/account-validation");
const invController = require("../controllers/invController")

router.get("/login", utilities.handleErrors(account.buildLogin));
router.get("/register", utilities.handleErrors(account.buildRegister));
// router.post('/register', utilities.handleErrors(account.registerAccount))
// Process the registration data
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(account.registerAccount)
);

// week 5 assessment
router.get("/", utilities.handleErrors(account.accountMananagement))

router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(account.accountLogin)
);

// WEEK 5 ASSIGNMNENT, creating aa route for displaying table in management view
router.get("/inv/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

module.exports = router;
