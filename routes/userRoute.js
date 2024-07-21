const express = require("express");
const  {
    handleUserSignIn,
    handleUserSignUp,
    getUserSignIn,
    getUserSignUp,
    userLogout
} = require( "../controllers/user")

const router = express.Router();

router.get("/signin",getUserSignIn);
router.get("/signup",getUserSignUp);
router.get("/logout",userLogout);
router.post("/signin",handleUserSignIn);
router.post("/signup",handleUserSignUp);


module.exports = router;