const mongoose=require("mongoose")
const propertySchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
     location:{
        type:String,
        required:true
    },
     price:{
        type:Number,
        required:true
    },
    propertyDescription:{
        type:String,
        required:true
    },
    amenities:{
        type:[String],
        required:true
    },
    type:{
        type:String,
        required:true
    },
    listingType:{
        type:String,
        required:true
    }, 
    bhk:{
        type:Number,
        required:true
    },
     area:{
        type:Number,
        required:true
    },
    propertyImages:{
        type:[String],
        required:true
    },
    agentEmail:{
        type:String,
        default:""
    },
    status:{
        type:String,
        default:"pending"
    }
    


})
const properties=mongoose.model("properties",propertySchema)
module.exports=properties