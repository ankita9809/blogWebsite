const express = require('express');
const router = express.Router();
// const authorModel = require("../models/authorModel");
// const blogModel = require("../models/blogModel");
const author = require("../controllers/authorController");
const blog = require("../controllers/blogController");

router.get("/test-me" , function(req, res){
    console.log("my first project")
    res.send("My First Project")
})

router.post("/authors" , author.createAuthor)
router.post("/blogs" , blog.createBlog)

module.exports = router;