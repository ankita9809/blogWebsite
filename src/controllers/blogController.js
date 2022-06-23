const blogModel = require("../models/blogModel");
const authorModel = require("../models/authorModel");
const { exists } = require("../models/blogModel");
const { query } = require("express");


// --------------------------------------- POST /blogs --------------------------------------

const createBlog = async function (req, res) {
    try {
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
    } catch (error) {
        res.status(500).send({ status: false, Error: error.message })
    }
}

// --------------------------------------- GET /blogs --------------------------------------

const getBlog = async function (req, res) {

    try {
        const data = req.query
        //Validating data is empty or not
        if (Object.keys(data).length == 0) {
            const blog = await blogModel.find({ isPublished: true, isDeleted: false })
            if (blog.length == 0)
                return res.status(404).send({ status: false, msg: "No such Blog Exist" })
            res.status(200).send({ status: true, msg: blog })
        }

        //get data by query param
        if (Object.keys(data).length != 0) {
            let getBlog = await blogModel.find(data).populate("authorId")


            //check get blogs is empty or not
            if (getBlog.length == 0) {
                return res.status(400).send({ status: false, msg: "No such blog exist" })
            } res.status(200).send({ status: true, data: getBlog })

        }
        // Authentication of Author
        let auth_id = req.params.userId
        let authorDetails = await authorModel.findById(auth_id);
        if (!authorDetails)
            return res.status(401).send({ status: false, Msg: "No such author exists" })
        res.status(200).send({ status: true, msg: authorDetails })

    } catch (error) {
        res.status(500).send({ status: false, Error: error.message })
    }
}

// --------------------------------------- PUT /blogs/:blogId --------------------------------------

const updateBlog = async function (req, res) {
    try {

        const blogId = req.params.blogId;

        let blog = await blogModel.findById(blogId);
        //Return an error if no user with the given id exists in the db
        if (blog) {
            if (blog.isDeleted === false && blog.ispublished === false) {
                const updatedDate = await blogModel.findOneAndUpdate({ _id: blogId }, { $set: { ispublished: true, publishedAt: Date.now() } })
            }

            const blogData = req.body

            const updatedBlog = await blogModel.findOneAndUpdate({ _id: blogId }, blogData, { new: true })
            return res.status(200).send({ status: true, data: updatedBlog })
        } else {
            res.status(404).send({ status: false, msg: "Blog doesnt exist" })
        }

        return res.status(404).send({ status: false, msg: "Blog doesnt exists" })

        // Authentication for Author

    } catch (error) {
        console.log(error)
        res.status(500).send({ status: false, Error: error.message })
    }

}

// --------------------------------------- DELETE /blogs/:blogId --------------------------------------

const deleteBlog = async function (req, res) {
    try {
        let blogId = req.params.blogId
        let blog = await blogModel.findById(blogId)
        if (blog.isDeleted === true) {
            return res.status(400).send({ status: false, message: "No such blogId exists" })
        }
        //.send({status: true, msg: deletedBlog})
        let deletedBlog = await blogModel.findOneAndUpdate({ _id: blogId }, { isDeleted: true }, { new: true })
        res.status(201).send()
    } catch (error) {
        res.status(500).send({ status: false, Error: error.message })
    }
}

// --------------------------------------- DELETE /blogs?QueryParam -----------------------------------

const deleteQueryParams = async function (req, res) {
    try {
        const data = req.query
        if (Object.keys(data).length == 0) {
            return res.status(404).send({ status: false, msg: "No such Blog Exist" })
        }
        const deletedBlogs = await blogModel.find({ isDeleted: false }).updateMany(data, { isDeleted: true, deletedAt: new Date() }, { new: true })
        if (deletedBlogs.matchedCount == 0) {
            return res.status(404).send({ status: true, error: "blog not found" })
        }
        return res.status(201).send({ status: true, data: deletedBlogs })

    }
    catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
}

//-------------------------------- exporting Modules --------------------------------------------- 

module.exports.createBlog = createBlog;
module.exports.getBlog = getBlog
module.exports.updateBlog = updateBlog
module.exports.deleteBlog = deleteBlog
module.exports.deleteQueryParams = deleteQueryParams 