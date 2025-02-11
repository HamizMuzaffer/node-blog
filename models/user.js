const { Schema, model } = require("mongoose");
const {createHmac, randomBytes} = require("crypto")
const {createTokenForUser} = require("../services/authentication")
 const userSchema = new Schema({
    fullName:{
        type : String,
        required : true
    },
    email:{
        type : String,
        required : true,
        unique : true
    },
     password : {
        type : String,
        required : true
     },

     profileImageURL : {
        type : String, 
        default  : "/images/profileImage.png"
     }, 

     salt : {
        type : String,      
     }

},{
    timestamps : true
})

userSchema.pre("save", function(next){
    const user = this;
    if(!user.isModified) return
    const salt = randomBytes(16).toString();
    const createHashedPassoword = createHmac("sha256",salt).update(user.password).digest("hex");
    this.salt = salt;
    this.password = createHashedPassoword;
    next()

})

userSchema.static("matchPasswordAndGenerateToken", async function (email,password) {
    const user = await this.findOne({email})
    if(!user) throw new Error("User Not Found")

        const salt = user.salt;
        const hashedPassword = user.password;

        const userProvidedPassword = createHmac("sha256",salt).update(password).digest("hex");

        if(userProvidedPassword !== hashedPassword) throw new Error("Incorrect Password");

        const token = createTokenForUser(user);
        return token
})

const User = model("user",userSchema)

module.exports = User;