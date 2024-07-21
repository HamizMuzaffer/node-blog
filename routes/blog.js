const express = require("express");
const router = express.Router();
const multer = require("multer");
const Blog = require("../models/blog");
const Comment = require("../models/comment")
const path = require("path");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve(`./public/`))
    },
    filename: function (req, file, cb) {
      const fileName =  `${Date.now()}-${file.originalname}`
      cb(null, fileName)
    }
  })
  
  const upload = multer({ storage: storage })


router.get("/add-new",(req,res)=>{
    return res.render('addBlog',{
        user : req.user
    })
})

router.get("/:id",async(req,res)=>{
const blogPost = await Blog.findById(req.params.id).populate("createdBy");
const comments = await Comment.find({blogId:req.params.id}).populate("createdBy")
try {
  res.render("blog",{
    blog : blogPost,
    user : req.user,
    comments
  })
} catch (error) {
  console.error(error)
}

})

router.post("/comment/:blogId",async(req,res)=>{
  try {
    await Comment.create({
        content: req.body.content,
        blogId: req.params.blogId,
        createdBy: req.user._id
    });
    res.redirect(`/blog/${req.params.blogId}`);
} catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
}
})

router.post("/",upload.single("coverImage"),async (req,res)=>{
    const {title,body} = req.body
   const blog = await  Blog.create({
      title,
      body,
      coverImageURL : `/uploads/${req.file.filename}`,
      createdBy : req.user._id

    })
    res.redirect(`/blog/${blog._id}`)
}
)

module.exports = router;