const express = require('express');
const router = express.Router();
const author = require("../controllers/authorController");
const blog = require("../controllers/blogController");



router.post("/authors" , author.createAuthor)
router.post("/blogs" , blog.createBlog)

router.get("/authors",author.getAuthor)
router.get("/blogs",blog.getBlog)

router.put("/blogs/:blogId", blog.updateBlog)

router.delete("/blogs/:blogId", blog.deleteBlog)
router.delete("/blogs", blog.deleteQueryParams)

module.exports = router;