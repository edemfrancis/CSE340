/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 ************************ */
const baseController = require("./controllers/baseController")
const express = require("express")
const expresslayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const inventoryRoute = require("./routes/inventoryRoutes")
const utilities = require("./utilities/")

// View ENgines and templates
app.set("view engine", "ejs")
app.use(expresslayouts)
app.set("layout", "./layouts/layout")

/* ***********************
 * Routes
 ************************ */

app.use("/inv", inventoryRoute) // Inventory route
// detail in one view route
app.use(static)
app.get("/", baseController.buildHome)
// app.get("/", (req, res) => {
//   res.render("index", {title:"Home"})
// })
app.get("/", utilities.handleErrors(baseController.buildHome))

// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({status: 404, message: 'Sorry, we appear to have lost that page.'})
})

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 ************************ */ 

const port = process.env.PORT
const host = process.env.HOST


/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})



/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  if(err.status == 404){ message = err.message} else {message = 'Oh no! There was a crash. Maybe try a different route?'}
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav
  })
})