const jwt = require("jsonwebtoken");
const blogModel = require("../models/blogModel");


//--------------------------------- AUTHENTICATION MIDDLEWARE -------------------------------------------------------------------------------------------

const authentication = function (req, res, next) { 
  try {
    let token = req.headers["x-api-key"];         //Getting token from header
    if (!token) token = req.headers["X-api-key"];     //checking token with Uppercase
    if (!token) return res.send({ status: false, msg: "token must be present" });    //If neither condition satisfies & no token is present in the request header return error
  
    console.log(token);
  
    let decodedToken = jwt.verify(token, "BloggingWebsite");   // verifying token with secret key present in author login

    if (!decodedToken)                              
      return res.status(401).send({ status: false, msg: "token is invalid" });
    
   req.loggedInAuthorId = decodedToken._id       // stroing id present in decodedToken in req.loggedInAuthorId
   
   // next()            //if token is present next() will call the respective API            
    
  } catch (error) {
    res.status(500).send({ status: false, Error: error.message })
  }

  next() 

};

//--------------------------------- AUTHORISATION MIDDLEWARE -------------------------------------------------------------------------------------------

const authorisation = async function (req, res, next) {

  try {
    let token = req.headers["x-api-key"];
    let authordata = jwt.verify(token, "BloggingWebsite");

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

  // try{
  //   let userFromQuery = req.query.authorId
  //   console.log(userFromQuery)

  //   let blog1 = await blogModel.findById({authorId: userFromQuery})
  //   console.log(blog1)
  //   console.log(req.loggedInAuthorId)
  //   if(blog1 != req.loggedInAuthorId){
  //     res.send("Authorisation failed")
  //   }

  // }catch(error){
  //   return res.status(500).send({ status: false, msg: error.message })
  // }
 
}


module.exports.authentication = authentication
module.exports.authorisation = authorisation