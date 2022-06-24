const jwt = require("jsonwebtoken");
const blogModel = require("../models/blogModel");
const authorModel = require("../models/authorModel");

//--------------------------------- AUTHENTICATION MIDDLEWARE -------------------------------------------------------------------------------------------

const authentication = function(req, res, next){
  try{
  let token = req.headers["x-api-key"];
  if (!token) token = req.headers["X-api-key"];
  if (!token) return res.send({ status: false, msg: "token must be present" });    //If no token is present in the request header return error
  console.log(token);
  
  let decodedToken = jwt.verify(token, "BloggingWebsite");   // If a token is present then decode the token with verify function
  if (!decodedToken)                                         // Input 1 is the token to be decoded and Input 2 was same as generated earlier
    return res.send({ status: false, msg: "token is invalid" });
    
  //req.body.tokenId = decodedToken._id
  } catch(error){
    res.status(500).send({ status: false, Error: error.message })
  }
  next()
};

//--------------------------------- AUTHORISATION MIDDLEWARE -------------------------------------------------------------------------------------------

const authorisation = async function (req, res, next) {

  try {
    let token = req.headers["x-api-key"];

    let decodedToken = jwt.verify(token, 'BloggingWebsite')
    
    let authorId =  req.query.authorId
    if(!authorId )
    return res.status(401).send({status: false, msg: "AuthorId is required"})

    let authorDetails = await blogModel.findById(authorId)
    if(!authorDetails)
    return res.status(401).send({status: false, msg: "No such author exist"})


    let userToBeModified = authorId
    let userLoggedIn = decodedToken.authorId
    if (userToBeModified != userLoggedIn)

      return res.status(403).send({ status: false, msg: 'Author logged is not allowed to modify the requested data' })
  } catch (err) {
    return res.status(500).send({status: false, msg: err.message})
  }
 
  next();
}


module.exports.authentication = authentication
module.exports.authorisation = authorisation