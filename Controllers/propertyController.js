const { json } = require("express")
const properties = require("../Models/propertyModel")
const users=require("../Models/userModel")
const { GoogleGenerativeAI } = require("@google/generative-ai")
exports.addPropertyController = async (req, res) => {
    console.log("inside add property")
    try {
        console.log(req.body)
        const { title, location, price, propertyDescription, amenities, type, listingType, bhk, area } = req.body
        console.log(title, location, price, propertyDescription, amenities, type, listingType, bhk, area)
        console.log(req.files.map(item => item.filename))

        const propertyImages = req.files.map(item => item.filename)
        const email = req.payload
        console.log(email)
        const agentEmail = email
        console.log(agentEmail)

        const existingProperty = await properties.findOne({ title, location, email })
        if (existingProperty) {
            console.log("und")
            res.status(409).json("`property already exists!!!! operation failed")
        } else {
            console.log("illa")
            const newProperty = await properties.create({ title, location, price, propertyDescription, amenities, type, listingType, bhk, area, propertyImages, agentEmail })
            console.log(newProperty)
            res.status(200).json(newProperty)
        }
    } catch (error) {
        res.status(500).json(error)
    }
}
//home properties
exports.getHomePropertiesController=async(req,res)=>{
    try {
        console.log("inside home properties controller ")
        const homeProperties=await properties.find({status:"Active"}).sort({_id:-1}).limit(4)
        res.status(200).json(homeProperties)
        
    } catch (error) {
        res.status(500).json(error)
    }
}
//get all properties -user
exports.getAllPropertiesController = async (req, res) => {
    try {
        console.log("get all books controller")
        const getAllProperties = await properties.find({status:"Active"})
        res.status(200).json(getAllProperties)

    } catch (error) {
        res.status(500).json(error)
    }
}
//get All Properties Adimin
exports.getAllPropertiesAdminController = async (req, res) => {
    try {
        console.log("get all books controller")
        const getAllProperties = await properties.find()
        const count=await properties.countDocuments()
        res.status(200).json({property:getAllProperties,count})

    } catch (error) {
        res.status(500).json(error)
    }
}
//get agent properties
exports.getAgentPropertiesController=async(req,res)=>{
      const agentEmail = req.params.email || req.payload
      
    try {
        console.log("inside get agent properties ")
        const getAgentProperties=await properties.find({agentEmail,status:"Active"})
        res.status(200).json(getAgentProperties)
        
    } catch (error) {
        res.status(500).json(error)
    }
}
//get latest properties by agent
exports.getLatestPropertiesController=async(req,res)=>{
      const agentEmail = req.params.email || req.payload
      
    try {
        console.log("inside get  latest agent properties ")
        const getAgentProperties= await properties.find({agentEmail}).sort({_id:-1}).limit(3)
        const count=await properties.countDocuments({agentEmail})
        res.status(200).json({properties:getAgentProperties,count})
        
    } catch (error) {
        res.status(500).json(error)
    }
}
//
exports.viewPropertyController = async (req, res) => {

    const { id } = req.params

    console.log( id)

    try {

        console.log("Inside view property controller");
        const viewProperty = await properties.findById(id)

        console.log("View Property:", viewProperty)

        console.log("Agent Email:", viewProperty.agentEmail)
        const agentData = await users.findOne({
            email: viewProperty.agentEmail
        })
       console.log("Agent Data:", agentData)

        return res.status(200).json({
            viewProperty,
            agentData
        })

    } catch (error) {

        console.log("ERROR IN VIEW PROPERTY:", error)

        return res.status(500).json({
            message: "Server error",
            error: error.message
        })
    }
}
//Approve Property Controller
exports.approvePropertyController=async(req,res)=>{
    const{id}=req.params
    try {
        console.log("inside approve property controller")
        const property=await properties.findById({_id:id})
        property.status="Active"
        await property.save()
        res.status(200).json(property)

    } catch (error) {
        res.status(500).json(error)
    }
}
//get Delete property at agent side
exports.deleteAgentPropertyController=async(req,res)=>{
    const {id}=req.params
    try {
        const deleteAgentProperty=await properties.findByIdAndDelete({_id:id})
        res.status(200).json(deleteAgentProperty)
    } catch (error) {
        res.status(500).json(error)
    }
}
//generate property description controoler
exports.generateAiController=async(req,res)=>{
    try {
        console.log("inside gen ai controller")
       const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
        const {
            title,location,price,type,listingType,bhk,area,amenities
        } = req.body
        const model = genAI.getGenerativeModel({
            model: "gemini-3.6-flash"
        })
         const prompt = `
        You are a professional real estate broker.

        Generate an attractive and professional property description 
        for the following property:

        Title: ${title}
        Location: ${location}
        Price: ${price}
        Property Type: ${type}
        Listing Type: ${listingType}
        BHK: ${bhk}
        Area: ${area} sq.ft
        Amenities: ${amenities}

        Requirements:
        - Write around 50 words.
        - Make it suitable for a real estate website.`
        const result=await model.generateContent(prompt)
        console.log(result.response)
        const reply=result.response
        res.status(200).json({content:reply.candidates[0].content.parts[0].text})
        
    } catch (error) {
        res.status(500).json(error)
    }
}
//get all properties admin controller
exports.latestPropertiesAdminController=async(req,res)=>{
    try {
        console.log("inside latest properties admin controller")
        const latestProperties=await properties.find().sort({_id:-1}).limit(4)
        res.status(200).json(latestProperties)
    } catch (error) {
        res.status(500).json(error)
    }
}