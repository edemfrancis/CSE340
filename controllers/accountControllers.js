/* ****************************************
 *  Deliver login view
 * *************************************** */
const utilities = require("../utilities");
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
require("dotenv").config()

async function buildLogin(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/login", {
    title: "Login",
    nav,
  });
}

/* ****************************************
 *  Deliver registration view
 * ******************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  });
}

/* ****************************************
 *  Process Registration
 * *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav();
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body;

  // Hash the password before storing
  let hashpassword;
  try {
    // regular password and cost (salt is generated automatically)
    hashpassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash(
      "Notice",
      "Sorry, there was anerror processing the registration."
    );
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    });
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashpassword
  );

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    );
    res.status(201).render("account/login", {
      title: "Login",
      nav,
    });
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
    });
  }
}

// ACTIVTIY WEEK 4
/* *********************************************
  ********************************************
  WEEK 4 Assignment 
  ******************************************** */
async function managementView(req, res, next) {
  let nav = await utilities.getNav();
  const classificationSelect = await utilities.buildClassificationList()
  res.render("./inventory/management", {
    title: "PICK OR CLICKS",
    nav,
    errors: null,
    classificationSelect
  });
}

// Building classification view for adding classification name
async function addClassificationView(req, res, next) {
  let nav = await utilities.getNav();
  res.render("inventory/cclassification-view", {
    title: "Add Classification Name",
    nav,
    errors: null,
  });
}

// Sanitizing and validating add-classification-name
async function sanValClassification(req, res) {
  let nav = await utilities.getNav();
  const { classification_name } = req.body;

  const regResult = await accountModel.addClassificationName(
    classification_name
  );

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${classification_name}.`
    );
    res.status(201).render("inventory/management", {
      title: "Vehicle Management",
      nav,
    });
  } else {
    req.flash("notice", "Sorry, Classification Name registration failed.");
    res.status(501).render("inventory/cclassification-view", {
      title: "Add Classification Name",
      nav,
    });
  }
}

// week 5 weekly activity
/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}

async function accountMananagement(req, res){
  let nav = await utilities.getNav()
  res.render("manage/management", {
    title: "Account Management",
    nav,
    errors: null
  })
}


module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  addClassificationView,
  sanValClassification,
  managementView,
  accountLogin,
  accountMananagement
};
