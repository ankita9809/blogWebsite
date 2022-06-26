const blogModel = require("../models/blogModel");
const authorModel = require("../models/authorModel");

// --------------------------------------- POST /blogs --------------------------------------

const createBlog = async function (req, res) {
    try {
        let blog = req.body

        // getting the author with their Id and checking for validation
        let authorId = await authorModel.find().select({ _id: 1 })
        authorIdArr = authorId.map((obj) => { return obj._id.toString() })

        // Validating blogData 
        if (!blog.body) {
            return res.status(400).send({ status: false, msg: "body is required" })
        }

        if (!blog.title) {
            return res.status(400).send({ status: false, msg: "Title is required" })
        }
        if (!blog.body) {
            return res.status(400).send({ status: false, msg: "Body is required" })
        }
        if (!blog.category) {
            return res.status(400).send({ status: false, msg: "Category is required" })
        }
        if (!blog.authorId) {
            return res.status(400).send({ status: false, msg: "AuthorId is required" })
        }

        // if validation is true , create a blog
        if (blog.authorId != undefined) {
            if (authorIdArr.includes(blog.authorId)) {
                let blogCreated = await blogModel.create(blog)
                return res.status(201).send({ data: blogCreated })
            }
            res.status(400).send({ status: false, msg: "Author doesn't exist" })
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
            const blog = await blogModel.find({ ispublished: true, isDeleted: false })
            if (blog.length == 0) {
                return res.status(404).send({ status: false, msg: "Blog doesn't Exists" })
            }
            res.status(200).send({ status: true, msg: blog })

        }

        //get data by query param

        if (Object.keys(data).length != 0) {
            // data.ispublished = true
            //data.isDeleted = false
            console.log(data)
            let getBlog = await blogModel.find(data).populate("authorId")
            if (getBlog.length == 0) {
                return res.status(404).send({ status: false, msg: "No such blog exist" })
            }
            res.status(200).send({ status: true, data: getBlog })
        }


    } catch (error) {
        res.status(500).send({ status: false, Error: error.message })
    }
}

// --------------------------------------- PUT /blogs/:blogId --------------------------------------

const updateBlog = async function (req, res) {
    try {

        const blogId = req.params.blogId;
        const blogData = req.body

        if (Object.keys(blogData).length == 0)
            return res.status(404).send({ status: false, msg: "Body is required" });

        console.log("Here")
        let blog = await blogModel.findOneAndUpdate({ _id: blogId, isDeleted: false },
            {
                $set: { ispublished: true, body: blogData.body, title: blogData.title, publishedAt: new Date() },
                $push: { tags: blogData.tags, subcategory: blogData.subcategory }
            },
            { new: true });

        res.status(200).send({ status: true, msg: blog });
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
            return res.status(404).send({ status: false, message: "No such blogId exists" })
        }
        //.send({status: true, msg: deletedBlog})
        let deletedBlog = await blogModel.findOneAndUpdate({ _id: blogId }, { isDeleted: true, deletedAt: new Date() }, { new: true })
       res.status(201).send({status: true, msg: deletedBlog})
    } catch (error) {
        res.status(500).send({ status: false, Error: error.message })
    }
}

// --------------------------------------- DELETE /blogs?QueryParam -----------------------------------

const deleteQueryParams = async function (req, res) {
    try {
        const data = req.query
        console.log(data)
        
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