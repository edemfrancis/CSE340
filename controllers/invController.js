const invModel = require("../models/inventory-model");
const utilities = require("../utilities");
const accountModel = require("../models/account-model")

const invCont = {};

/* *****************
 * BUild inventory by classification view
 * ************** */


invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classification_id;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0].classification_name;
  res.render("./inventory/classification", {
    title: className + "vehicles",
    nav,
    grid,
  });
};

invCont.buildByDetail = async function (req, res, next) {
  try {
    const get_details_by_class_id = req.params.classification_id;
  const data = await invModel.getInventoryByInvId(
    get_details_by_class_id
  ); 
  const detalView = await utilities.buildSpecificViewById(data);
  let nav = await utilities.getNav();
  const year = data[0].inv_year;
  const inv_make = data[0].inv_make;
  const inv_model = data[0].inv_model;
  
  res.render("./inventory/oneView", {
    title: year + " " + inv_make + " " + inv_model,
    nav,
    detalView,
  });
  } catch (typeError){
    // this will report back error message to the user
    return "Error! Vehicle not available" 
  }
  
};

// ACTIVTIY WEEK 4
/* *********************************************
  ********************************************
  WEEK 4 Assignment 
  ******************************************** */
invCont.buildDropDownList = async function (req, res, next) {
  const classSelect = await utilities.buildClassificationList();
  let nav = await utilities.getNav();
  res.render("./inventory/add-vehicle", {
    title: "Add to Vehicle",
    nav,
    errors: null,
    classSelect
  });
}

/* ***************************
 *  Deliver addvehicle view
 * ************************** */
// invCont.buildAddvehicle = async function (req, res, next) {
//   let nav = await utilities.getNav();
//   let classSelect = await utilities.buildClassificationList();
//   res.render("./inventory/add-vehicle", {
//     title: "Add Vehicle",
//     nav,
//     errors: null,
//     classSelect,
//   });
// };

/* ****************************************
 *  Process vehicle info
 * *************************************** */
invCont.addVehicle = async function (req, res, next) {
  let nav = await utilities.getNav();
  let classSelect = await utilities.buildClassificationList();
  const {
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
  } = req.body;

  const regResult = await accountModel.addVehicle(
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color
  );

  if (regResult) {
    req.flash("success", "Vehicle added");
    res.status(201).render("./inventory/management", {
      title: "Vehicle Management",
      nav,
    });
  } else {
    req.flash("error", "Vehicle addition failed");
    res.status(501).render("./inventory/add-vehicle", {
      title: "Add Vehicle",
      nav,
      classSelect,
    });
  }
};

module.exports = invCont;