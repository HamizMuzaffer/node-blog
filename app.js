require('dotenv').config()
const express = require("express")
const path = require("path")
const userRoute = require("./routes/userRoute")
const blogRoute = require("./routes/blog")
const cookieParser = require("cookie-parser")
const Blog = require("./models/blog")
const PORT = process.env.PORT || 3000;
const app = express();
const mongoose = require("mongoose");
const { checkForAuthenticationCookie } = require("./middlewares/authentication");

mongoose.connect(process.env.MONGO_URL)

// Middlewares
app.set("view engine" , "ejs");
app.set("views" , path.resolve("./views"))

app.use(cookieParser());
app.use(express.urlencoded({extended : false}))
app.use(checkForAuthenticationCookie("token"))
app.use(express.static(path.resolve("./public")))

// Routes
app.use("/user", userRoute)
app.use("/blog", blogRoute)

app.get("/" , async(req,res)=>{
    const allBlogs = await Blog.find({})
    res.render("home",{
        user : req.user,
        blogs : allBlogs
    })
})



app.listen(PORT,(req,res)=>{
 console.log(`Server Running at Port ${PORT}`)
})