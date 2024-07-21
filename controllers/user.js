const User =  require("../models/user");

async function getUserSignUp (req,res){
 return res.render("signup")
}

async function getUserSignIn(req,res){
 return res.render("signin")
}

 async function  handleUserSignUp (req,res){
    const {fullName,email,password} = req.body;
    await User.create({
      fullName,
      email,
      password
    });
    
    res.redirect("signin")
}

async function handleUserSignIn(req,res){
  const {email,password} = req.body;

  try {
    const token = await User.matchPasswordAndGenerateToken(email,password)
    res.cookie("token",token).redirect("/")

  } catch (error) {
    res.render('signin',{
      error : "Incorrect Email and Passoword"
    })
  }

  
}

async function userLogout(req,res){
  
  res.clearCookie('token').redirect('/')
}

module.exports = {
    handleUserSignIn,
    handleUserSignUp,
    getUserSignIn,
    getUserSignUp,
    userLogout
}