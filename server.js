/* ******************************************
 * This server.js file is the primary file of the
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 ************************ */
const baseController = require("./controllers/baseController");
const express = require("express");
const expresslayouts = require("express-ejs-layouts");
const env = require("dotenv").config();
const app = express();
const static = require("./routes/static");
const inventoryRoute = require("./routes/inventoryRoutes");
const utilities = require("./utilities/");
const session = require("express-session");
const pool = require("./database/");
const accRoute = require("./routes/accountRoutes")
const bodyparser = require("body-parser");


// View ENgines and templates
app.set("view engine", "ejs");
app.use(expresslayouts);
app.set("layout", "./layouts/layout");


/* ***********************
 * Middleware
 * ************************/
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))

// Express Messages Middleware
app.use(require('connect-flash')())
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
})
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extend: true})) // for parsing application/x-www-form-urlencoded

/* ***********************
 * Routes
 ************************ */
app.use(static)
app.use("/inv", inventoryRoute); // Inventory route
// Account Controller routes
app.use("/account", accRoute)
// WEEK 4 assignment
app.use("/inventory", inventoryRoute)

app.get("/", utilities.handleErrors(baseController.buildHome));
// app.get("/", (req, res) => {
//   res.render("index", {title:"Home"})
// })

// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({ status: 404, message: "Sorry, we appear to have lost that page." });
});



/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 ************************ */

const port = process.env.PORT;
const host = process.env.HOST;

/* ***********************
 * Log statement to confirm server operation
 ************************ */
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`);
});

/* ***********************
 * Express Error Handler
 * Place after all other middleware
 *************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav();
  
  if (err.status == 404) {
    // console.error(`Error at: "${req.originalUrl}": ${err.message}`);
    message = err.message;
  } else {
    message = "Oh no! There was a crash. Maybe try a different route?";
  }
  res.render("errors/error", {
    title: err.status || "Server Error",
    message,
    nav,
  });
});
