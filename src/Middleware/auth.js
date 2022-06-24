const jwt = require("jsonwebtoken");
const blogModel = require("../models/blogModel");
const authorModel = require("../models/authorModel");

//--------------------------------- AUTHENTICATION MIDDLEWARE -------------------------------------------------------------------------------------------

const authentication = function (req, res, next) {
  try {
    let token = req.headers["x-api-key"];
    if (!token) token = req.headers["X-api-key"];
    if (!token) return res.send({ status: false, msg: "token must be present" });    //If no token is present in the request header return error
    console.log(token);

    let decodedToken = jwt.verify(token, "BloggingWebsite");   // If a token is present then decode the token with verify function
    if (!decodedToken)                                         // Input 1 is the token to be decoded and Input 2 was same as generated earlier
      return res.send({ status: false, msg: "token is invalid" });

    req.loggedInAuthorId = decodedToken._id       // stroing decoded token id in req.loggedInAuthorId


  } catch (error) {
    res.status(500).send({ status: false, Error: error.message })
  }
  next()
};

//--------------------------------- AUTHORISATION MIDDLEWARE -------------------------------------------------------------------------------------------

const authorisation = async function (req, res, next) {

  try {

    let userToBeModified = req.params.blogId
    console.log(userToBeModified)

    let blog = await blogModel.findById({ _id: userToBeModified })    //id in blogModel is same as getting from req.params or not
    //let userLoggedIn = decodedToken._id
    console.log(blog)
    console.log(req.loggedInAuthorId)
    if (blog.authorId == req.loggedInAuthorId) {     //We have stored decoded token into req.loggedInAuthorId and comparing it with blog.authorId
      next()
    } else {
      res.status(403).send({ status: false, msg: 'Author logged is not allowed to modify the requested data' })
    }
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message })
  }

}


module.exports.authentication = authentication
module.exports.authorisation = authorisation