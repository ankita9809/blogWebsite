const authorModel = require("../models/authorModel")
const jwt=require("jsonwebtoken");

// ----------------------------------------- CREATE AUTHOR ---------------------------------------------------------

const createAuthor = async function(req, res){
    try{
      let author = req.body     
        let authorCreated = await authorModel.create(author)
        res.status(201).send({status: true, msg: authorCreated})
      } catch(error){
      res.status(500).send({status: false, Error: "Author already exists" })
    }
}

// ----------------------------------------- GET AUTHOR ------------------------------------------------------------

const getAuthor = async function(req,res){
    let alldata = await authorModel.find()
    res.status(200).send({status: true, msg: alldata})
}

// --------------------------------------- AUTHOR LOGIN ------------------------------------------------------------

const authorLogin = async function (req, res) {
    let userName = req.body.emailId;
    let password = req.body.password;
  
    let user = await authorModel.findOne({ emailId: userName, password: password });
    if (!user)
      return res.send({
        status: false,
        msg: "username or the password is not corerct",
      });
      let payload = {_id : user._id}                      //Setting the payload
      let token = jwt.sign(payload, "BloggingWebsite");
      res.setHeader("x-api-key", token);
      res.send({ status: true, token: token });
    };



module.exports.createAuthor = createAuthor; 
module.exports.getAuthor = getAuthor 
module.exports.authorLogin=authorLogin