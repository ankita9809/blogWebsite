const express = require('express');
const router = express.Router();
const author = require("../controllers/authorController");
const blog = require("../controllers/blogController");
const MW = require("../Middleware/auth")


//---------------------- CREATE and GET Author ------------------------------------------
router.post("/authors" , author.createAuthor)
router.get("/authors",author.getAuthor)

//---------------------- Author LOGIN ---------------------------------------------------

router.post("/login", author.authorLogin)

//---------------------- CREATE and GET Blog using JWT ----------------------------------

router.post("/blogs" ,MW.authentication, blog.createBlog)
router.get("/blogs",MW.authentication, blog.getBlog)

//---------------------- UPDATE Blog using JWT ------------------------------------------

router.put("/blogs/:blogId",MW.authentication,MW.authorisation,  blog.updateBlog)

//---------------------- Delete blog using JWT ------------------------------------------

router.delete("/blogs/:blogId",MW.authentication, MW.authorisation, blog.deleteBlog)
router.delete("/blogs",MW.authentication, MW.authorisation, blog.deleteQueryParams)



module.exports = router;