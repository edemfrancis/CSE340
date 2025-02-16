/* *****************************
 *   Register new account
 * *************************** */
const pool = require("../database/");

async function registerAccount(
  account_firstname,
  account_lastname,
  account_email,
  account_password
) {
  try {
    const sql =
      "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *";
    return await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_password,
    ]);
  } catch (error) {
    return error.message;
  }
}

async function checkExistingEmail(account_email) {
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1";
    const email = await pool.query(sql, [account_email]);
    return email.rowCount;
  } catch (error) {
    return error.message;
  }
}

// ACTIVTIY WEEK 4
/* *********************************************
  ********************************************
  WEEK 4 Assignment 
  ******************************************** */
// adding class to classification name
async function addClassificationName(classification_name) {
  try {
    const sql =
      "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *";
    const result = await pool.query(sql, [classification_name]);
    return result;
  } catch (error) {
    return error.message;
  }
}

// checking to see if classification name existed
async function ifClasificationNameExists(classification_name) {
  try {
    const sql =
      "SELECT * FROM classification WHERE classification_name = $1 LIMIT 1";
    const classificationName = await pool.query(sql, [classification_name]);
    return classificationName.rows.length;
  } catch (error) {
    return error.message;
  }
}

/* ***************************
 *  Add new vehicle
 * ************************** */
async function addVehicle(
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
) {
  try {
    const sql =
      "INSERT INTO public.inventory (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *";
    return await pool.query(sql, [
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
    ]);
  } catch (error) {
    return error.message;
  }
}

// Week 5 activity
// Returning account data using email
async function getAccountByEmail(account_email) {
  try {
    const result = await pool.query(
      "SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1",
      [account_email]
    );
    return result.rowa[0];
  } catch (error) {
    return new Error("No matching email found");
  }
}

module.exports = {
  registerAccount,
  checkExistingEmail,
  addClassificationName,
  ifClasificationNameExists,
  addVehicle,
  getAccountByEmail,
};
