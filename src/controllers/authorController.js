const authorModel = require("../models/authorModel");
const createAuthor = async function(req, res){
    let author = req.body 
    let authorCreated = await authorModel.create(author)
    res.send({data: authorCreated})
}
module.exports.createAuthor = createAuthor;