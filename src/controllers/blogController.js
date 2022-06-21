const blogModel = require("../models/blogModel");
const createBlog = async function(req, res){
    let blog = req.body 
    let blogCreated = await blogModel.create(blog)
    res.send({data: blogCreated})
}
module.exports.createBlog = createBlog;