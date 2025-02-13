const express = require("express");
const router = new express.Router();
const account = require("../controllers/accountControllers");
const utilities = require("../utilities");
const regValidate = require("../utilities/account-validation");
const invCont = require("../controllers/invController");

router.get("/login", utilities.handleErrors(account.buildLogin));
router.get("/register", utilities.handleErrors(account.buildRegister));
// router.post('/register', utilities.handleErrors(account.registerAccount))
// Process the registration data
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(account.registerAccount)
)

module.exports = router; 