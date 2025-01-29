const invModel = require("../models/inventory-model");
const utilities = require("../utilities");

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

module.exports = invCont;