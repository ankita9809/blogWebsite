const authorModel = require("../models/authorModel")
const jwt = require("jsonwebtoken");

// ----------------------------------------- CREATE AUTHOR ---------------------------------------------------------

const createAuthor = async function (req, res) {
  try {
    let author_data = req.body

    //--------------------------  Getting data from body  -------------------------------------
    if (!author_data) {
      return res.status(400).send({ status: false, msg: "Invalid request ,Please provide author details" })
    }
    // -------------------------- Checking for all the firelds --------------------------------
    if (!author_data.fname) {
      return res.status(400).send({ status: false, msg: "fname is required" })
    }
    if (!author_data.lname) {
      return res.status(400).send({ status: false, msg: "lname is required" })
    }
    if (!author_data.title) {
      return res.status(400).send({ status: false, msg: "title is required" })
    }
    if (!author_data.email) {
      return res.status(400).send({ status: false, msg: "email is required" })
    }
    if (!author_data.password) {
      return res.status(400).send({ status: false, msg: "password is required" })
    }

    let authorCreated = await authorModel.create(author_data)
    res.status(201).send({ status: true, msg: "New author created successfully", author_data: authorCreated })
  } catch (error) {
    res.status(500).send({ status: false, Error: "Author already exists" })
  }
}

// ----------------------------------------- GET AUTHOR ------------------------------------------------------------

const getAuthor = async function (req, res) {
  let alldata = await authorModel.find()
  res.status(200).send({ status: true, msg: alldata }) 
}

// --------------------------------------- AUTHOR LOGIN ------------------------------------------------------------

const authorLogin = async function (req, res) {
  try{
  let userName = req.body.emailId;
  let password = req.body.password;

  let user = await authorModel.findOne({ emailId: userName, password: password });
  if(!userName && !password){
    return res.status(400).send({status: false, msg: "Data is required"})
  }
  if(!user){
    return res.status(401).send({status: false, msg: "INVALID CREDENTIALS"});
  }

  let payload = { _id: user._id }                      //Setting the payload
  let token = jwt.sign(payload, "BloggingWebsite");
  res.setHeader("x-api-key", token);
  res.send({ status: true, token: token });
 } catch(error){
  res.status(500).send({staus: false, msg: error.message})
 }
};

module.exports.createAuthor = createAuthor;
module.exports.getAuthor = getAuthor
module.exports.authorLogin = authorLogin