const blogModel = require("../models/blogModel");
const authorModel = require("../models/authorModel");
const { exists } = require("../models/blogModel");

const createBlog = async function (req, res) {
    try{
    let blog = req.body
        // getting the author with their Id and checking for validation
    let authorId = await authorModel.find().select({ _id: 1 })
    authorIdArr = authorId.map((obj) => { return obj._id.toString() })

        // if validation is true , create a blog
    if (blog.authorId != undefined) {
        if (authorIdArr.includes(blog.authorId)) {
            let blogCreated = await blogModel.create(blog)
            return res.status(201).send({ data: blogCreated })
        }
        res.status(400).send("Author doesn't exist")
    }
    } catch (error){
        res.status(500).send({status: false, Error: error.message})
    }
}

const getBlog = async function(req, res){
    
    try{
        const data = req.query
        //Validating data is empty or not
        if (Object.keys(data).length == 0){
            const blog = await blogModel.find({ isPublished: true, isDeleted: false})
            if(blog.length == 0)
            return res.status(404).send({status: false, msg: "No such Blog Exist"})
            res.status(200).send({ status: true, msg: blog })
        }

        //get data by query param
        if(Object.keys(data.length == 0)){
            let getBlog = await blogModel.find(data).populate("authorId")
        

        //check get blogs is empty or not
        if(getBlog.length == 0){
            return res.status(400).send({status: false, msg: "No such blog exist"})
        }res.status(200).send({status: true, data: getBlog})
      }

    } catch(error){
        res.status(500).send({ status: false, Error: error.message})
    }
    

     
}




module.exports.createBlog = createBlog;
module.exports.getBlog = getBlog