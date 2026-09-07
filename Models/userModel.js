const mongoose=require("mongoose")
const userSchema=new mongoose.Schema({
    fullname:{
        type:String,
        required:true
    },
     email:{
        type:String,
        required:true
    },
     password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        default:"user"
    },
    bio:{
        type:String,
        default:""
    },
    profileImage:{
        type:String,
        default:""
    },
    city:{
        type:String,
        default:""
    },
    phone:{
       type:Number,
        default:""
    },
    designation:{
       type:String,
        default:""
    },
    subscriptionStatus:{
        type:String,
        default:"Inactive"
    }

})
const users=mongoose.model("users",userSchema)
module.exports=users