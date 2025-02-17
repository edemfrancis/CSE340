const invModel = require("../models/inventory-model");
const Util = {};
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications();
  let list = '<ul class="ul-list">';
  list += '<li class="home-page"><a href="/" title="Home page">Home</a></li>';
  data.rows.forEach((row) => {
    list += "<li>";
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>";
    list += "</li>";
  });
  list += "</ul>";
  return list;
};

/* **************************************
 * Build the classification view HTML
 * ************************************ */
Util.buildClassificationGrid = async function (data) {
  let grid;
  if (Array.isArray(data) && data.length > 0) {
    grid = '<ul id="inv-display">';
    data.forEach((vehicle) => {
      grid += '<li class="class-view single-view">';
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        'details"><img src="' +
        vehicle.inv_thumbnail +
        '" alt="Image of ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' on CSE Motors" /></a>';
      grid += '<div class="namePrice">';
      grid += "<hr />";
      grid += "<h3>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' detai ls">' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        "</a>";
      grid += "</h3>";
      grid +=
        "<span>$" +
        new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
        "</span>";
      grid += "</div>";
      grid += "</li>";
    });
    grid += "</ul>";
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};

Util.buildSpecificViewById = async function (data) {
  let detalView;
  if (Array.isArray(data) && data.length > 0) {
    detalView = '<section id="one_view"> ';
    data.forEach((element) => {
      detalView +=
        '<img src="' +
        element.inv_thumbnail +
        '" alt="Image of ' +
        element.inv_make +
        " " +
        element.inv_model +
        ' on CSE Motors" />';
      detalView += '<div class="detail"> ';
      detalView += "<h3>";
      detalView += element.inv_make + " " + element.inv_model;
      detalView += "</h3>";
      detalView += '<ul>';
      detalView +=
        '<li>' + "<b> Price $" + 
        new Intl.NumberFormat("en-US").format(element.inv_price) +
        "</b>" + '</li>';
      detalView += '<li> ' + '<b> Description:'  + '</b>' + element.inv_description + ' </li>';
      detalView += '<li>' + "<b> Color:" + "</b>" + " " + element.inv_color + '</li>';
      detalView += '<li>' + "<b> Miles:" + "</b>" +  " " + element.inv_miles + '</li>';
      detalView += '</ul>';
      detalView += "</div>";
      detalView += "</section>";
    });
  } else {
    detalView +=
      '<p class="notice">Sorry, no matching for vehicle data found.</p>';
  }
  return detalView;
};

/**************************************************************
 * *************************************************************
 * Week 4 Assisgnment  */
Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList =
    '<select name="classification_id" id="classificationList" required>'
  classificationList += "<option value=''>Choose a Classification</option>"
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"'
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected "
    }
    classificationList += ">" + row.classification_name + "</option>"
  })
  classificationList += "</select>"
  return classificationList
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      req.flash("Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
     }
     res.locals.accountData = accountData
     res.locals.loggedin = 1
     next()
    })
  } else {
   next()
  }
 }

 /* ****************************************
 *  Check Login
 * ************************************ */
 Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }

// Week 5 assignmnet
/* ****************************************
 *  Check user authorization, block unauthorized users
 * ************************************ */
Util.isAuthorized = async (req, res, next) => {
  let auth = 0;  
  if (res.locals.loggedin) {
    const account = res.locals.accountData;
    account.account_type == "Admin" || account.account_type == "Employee"
      ? (auth = 1)
      : (auth = 0);
  }
  if (!auth) {
    req.flash("notice", "Please log in")
    res.redirect("/account/login")
    return;
  } else {
    next();
  }
};
 
module.exports = Util;
