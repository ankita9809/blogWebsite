const jwt = require("jsonwebtoken");
const blogModel = require("../models/blogModel");


//--------------------------------- AUTHENTICATION MIDDLEWARE ------------------------------------------------------------------------

const authentication = function (req, res, next) {
  try {
    let token = req.headers["x-api-key"];         //Getting token from header
    if (!token) token = req.headers["X-api-key"];     //checking token with Uppercase
    if (!token) return res.status(401).send({ status: false, msg: "token must be present" });    //If neither condition satisfies & no token is present in the request header return error

  console.log(token);
  
    let decodedToken = jwt.verify(token, "BloggingWebsite", function(error, decodedToken){
      if(error)
      return res.status(401).send({ status: false, msg: "token is invalid" });
      req.loggedInAuthorId = decodedToken._id

    });  
    next()            //if token is present next() will call the respective API            

  } catch (error) {
    return res.status(500).send({ status: false, Error: error.message })
  }



};

//--------------------------------- AUTHORISATION MIDDLEWARE ----------------------------------------------------------------------------------

const authorisation = async function (req, res, next) {

  try {
     //let token = req.headers["x-api-key"];
     //let authordata = jwt.verify(token, "BloggingWebsite");

    let userToBeModified = req.params.blogId
    console.log(userToBeModified)

    let blog = await blogModel.findById({ _id: userToBeModified })    //id in blogModel is same as getting from req.params or not
    //let userLoggedIn = decodedToken._id
    console.log(blog)
    console.log(req.loggedInAuthorId)
    if (blog.authorId != req.loggedInAuthorId) {    //We have stored decoded token into req.loggedInAuthorId and comparing it with blog.authorId
      return res.status(403).send({ status: false, msg: 'Author logged is not allowed to modify the requested data' })
    }
    next()
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message })
  }


}


module.exports.authentication = authentication
module.exports.authorisation = authorisation