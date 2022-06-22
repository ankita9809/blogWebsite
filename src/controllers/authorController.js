const authorModel = require("../models/authorModel")

// ----------------------------------------- CREATE AUTHOR ---------------------------------------------------------

const createAuthor = async function(req, res){
    let author = req.body 
    let authorCreated = await authorModel.create(author)
    res.status(201).send({data: authorCreated})
}

// ----------------------------------------- GET AUTHOR ------------------------------------------------------------

const getAuthor = async function(req,res){
    let alldata = await authorModel.find()
    res.status(200).send({status: true, msg: alldata})
}

module.exports.createAuthor = createAuthor; 
module.exports.getAuthor = getAuthor 