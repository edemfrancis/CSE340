const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function(req, res){
  const nav = await utilities.getNav()
  // req.flash("notice", "This is a flash message.") this was testing but i will leave it commented out, incase i need to test it again
  res.render("index", {title: "Home", nav})
}

module.exports = baseController