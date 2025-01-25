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

// View ENgines and templates
app.set("view engine", "ejs")
app.use(expresslayouts)
app.set("layout", "./layouts/layout")

/* ***********************
 * Routes
 ************************ */

app.use("/inv", inventoryRoute)
app.use(static)
app.get("/", baseController.buildHome)
// app.get("/", (req, res) => {
//   res.render("index", {title:"Home"})
// })

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/ 

const port = process.env.PORT
const host = process.env.HOST


/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
