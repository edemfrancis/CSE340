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

// WEEK 5
/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

// Delete view function
invCont.deleteView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = utilities.getNav()
  const itemData = await invModel.getInventoryByInvId(inv_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/delete", {
    title: "Delete " + itemName,
    nav, errors: null, inv_id: itemData.inv_id, inv_make: itemData.inv_make, inv_model: itemData.inv_model, 
    inv_year: itemData.inv_year, inv_price: itemData.inv_price
  })
}

// edit view function
invCont.deleteItem = async function (req, res, next) {
  let nav = await utilities.getNav()
  const inv_id = parseInt(req.body.inv_id)
  const deleteResult = await invModel.deleteInventoryItem(inv_id)
  if (deleteResult){
    req.flash("notice", 'The deletion was successful')
    res.redirect('/inv/')
  } else {
    req.flash("notice", 'Sorry, the delete failed.')
    res.redirect("/inv/delete/inv_id")
  }
}

/* ***************************
 *  Edit Vehicle view having current vehicle data
 * ************************** */
invCont.buildVehicleEdit = async function (req, res, next) {
  console.log("Inside buildVehicleEd");
  let nav = await utilities.getNav();
  const inv_id = parseInt(req.params.inv_id);
  let invData = (await invModel.getInventoryByInvId(inv_id))[0];
  let classSelect = await utilities.buildClassificationList(
    invData.classification_id
  );
  let name = `${invData.inv_make} ${invData.inv_model}`;
  // view -- editvehicle.ejs
  res.render("./inventory/update", {
    title: "Edit " + name,
    nav,
    errors: null,
    classSelect: classSelect,
    inv_make: invData.inv_make,
    inv_model: invData.inv_model,
    inv_year: invData.inv_year,
    inv_description: invData.inv_description,
    inv_image: invData.inv_image,
    inv_thumbnail: invData.inv_thumbnail,
    inv_price: invData.inv_price,
    inv_miles: invData.inv_miles,
    inv_color: invData.inv_color,
    inv_id: invData.inv_id,
  });
};
/* ****************************************
 *  Process updated vehicle info
 * *************************************** */
invCont.updateVehicle = async function (req, res, next) {
  let nav = await utilities.getNav();
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
    inv_id,
  } = req.body;

  const updateResult = await invModel.updateVehicle(
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,
    inv_id
  );

  if (updateResult) {
    const itemName = `${updateResult.inv_make} ${updateResult.inv_model}`;
    const classSelect = await utilities.buildClassificationList(classification_id);

    req.flash("success", `${itemName} was successfully updated`);
    res.status(201).render("./inventory/management", {
      title: "Inventory Management",
      nav,
      errors: null,
      classSelect,
    });
  } else {
    const classSelect = await utilities.buildClassificationList(classification_id);
    const itemName = `${inv_make} ${inv_model}`;
    req.flash("error", "Sorry, failed to insert data.");
    res.status(501).render("./inventory/update", {
      title: "Edit " + itemName,
      nav,
      errors: null,
      classSelect: classSelect,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      inv_id,
    });
  }
};


module.exports = invCont;