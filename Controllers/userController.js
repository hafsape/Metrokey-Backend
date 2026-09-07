const users = require("../Models/userModel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)
const properties=require("../Models/propertyModel")

exports.registerController = async (req, res) => {
    console.log(req.body)
    const { fullname, email, password, role } = req.body

    const existingUser = await users.findOne({ email: email })
    console.log(existingUser);
    if (existingUser) {


        res.status(409).json(`user already exist..please login!!!`)

    } else {

        const encryptedPassword = await bcrypt.hash(password, 10)
        console.log(encryptedPassword);
        const newUser = await users.create({ fullname, email, password: encryptedPassword, role })
        console.log(newUser)
        res.status(201).json(newUser)
    }
}
exports.loginController = async (req, res) => {
    console.log("inside login controller")
    console.log(req.body);
    const { email, password } = req.body
    const existingUser = await users.findOne({ email })

    if (existingUser) {
        const isPswdMatch = await bcrypt.compare(password, existingUser.password)
        console.log(isPswdMatch);
        if (isPswdMatch) {

            const token = jwt.sign({ email, role: existingUser.role }, process.env.secretKey)
            console.log(token);
            res.status(200).json({ existingUser, token })
            console.log(existingUser.role)
        } else {

            res.status(409).json(`invalid credentials`)
        }
    } else {
        res.status(400).json(`account does not exist..please Register!!!!!`)
    }
}
//update user controller
exports.updateUserController = async (req, res) => {
    try {
        console.log("inside update user controller")
        const { id } = req.params;
        console.log(id)
        console.log(req.body)
        const { fullname, password, bio, profileImage, email, phone, designation, city } = req.body
        // const { email } = req.payload;
        const uploadImage = req.file ? req.file.filename : profileImage;
        const updateData = { fullname, email, bio, phone, designation, city, profileImage: uploadImage }
        if (password) {
            updateData.password = await bcrypt.hash(password, 10)

        }
        const updateUser = await users.findByIdAndUpdate(id, updateData, { new: true })
        console.log("correct")
        console.log(updateUser)

        res.status(200).json(updateUser)

    } catch (error) {
      console.log("UPDATE ERROR:", error)
    res.status(500).json({
        message: "update error",
        error: error.message
    })
    }
}
//get all agents in userside-only active agents

exports.getAllAgentsController = async (req, res) => {
    try {
        console.log("inside get agents controller")
        const getAgents = await users.find({ role: "agent" ,subscriptionStatus:"Active"})
        res.status(200).json(getAgents)
    } catch (error) {
        res.status(500).json(error)
    }
}
//get all agents at admin side
exports.getAllAgentsAdminController = async (req, res) => {
    try {
        console.log("inside get agents controller")
        const getAgents = await users.find({ role: "agent" })
        const count=await users.countDocuments({role:"agent"})
        res.status(200).json({Agents:getAgents,count})
    } catch (error) {
        res.status(500).json(error)
    }
}
//view purticular agent
exports.viewAgentController = async (req, res) => {
    const { id } = req.params
    try {
        const viewAgent = await users.findById({ _id: id })
        res.status(200).json(viewAgent)
    } catch (error) {
        res.status(500).json(error)
    }
}
//get all users at Admin side
exports.getAllUsersController = async (req, res) => {
    try {
        console.log("inside get all users Controller")
        const getAllUsers = await users.find({ role: { $ne: 'admin' } })
        const count=await users.countDocuments()
        res.status(200).json({users:getAllUsers,count})
    } catch (error) {
        res.status(500).json(error)
    }
}
exports.deleteUserController = async (req, res) => {
    const { id } = req.params
    try {
        console.log("inside delete user controller")
        const deleteUser = await users.findByIdAndDelete(id)
        res.status(200).json(deleteUser)
    } catch (error) {
        res.status(500).json(error)
    }
}
//subscription payment controller
exports.subscriptionPaymentController = async (req, res) => {
    try {
        console.log("inside payment controller")
        const email = req.payload
        
        const Agent =await users.findOne({ email })
        console.log(Agent)
        Agent.subscriptionStatus = "Active"
        const line_items = [{
            price_data: {
                currency: "usd",

                product_data: {
                    name: "MetroKey Agent Subscription"
                },

                unit_amount: 2000
            },
            quantity: 1
        }]
        const session = await stripe.checkout.sessions.create({
            success_url: "http://localhost:5173/paymentsuccess",
            cancel_url: "http://localhost:5173/paymenterror",
            line_items,
            metadata: {
                agentEmail: email,
                userId: Agent._id.toString()
            },
            mode: "payment",
            payment_method_types: ["card"]
        })
        // console.log(session)
        session.url&&await Agent.save()
       res.status(200).json({
            checkoutURL: session.url
        })
    } catch (error) {
        res.status(500).json(error)
    }
}
//google login
exports.googleAuthController=async(req,res)=>{
    try {
        console.log("inside google login controoller")
        const{email,fullname,profileImage}=req.body
        const existingUser=await users.findOne({email})
        if(existingUser){
             const token = jwt.sign({ email:existingUser.email, role: existingUser.role }, process.env.secretKey)
            console.log(token);
            res.status(200).json({ existingUser, token })
            console.log(existingUser.role)
        }else{
            const newUser=await users.create({fullname,email,profileImage,password:"googlePassword"})
            const token = jwt.sign({ email:newUser.email, role: newUser.role }, process.env.secretKey)
            res.status(200).json({existingUser:newUser,token})
        }
    } catch (error) {
        res.status(500).json(error)
    }
}
exports.getCountController=async(req,res)=>{
    try {
        console.log("inside get count controller")
        const userCount=await users.countDocuments({
            role: { $ne: "admin" }
        })
        console.log(userCount)
        const agentCount=await users.countDocuments({role:"agent"})
        const propertiesCount=await properties.countDocuments()
        res.status(200).json({userCount,agentCount,propertiesCount})
    } catch (error) {
    res.status(500).json(error)
    }
}
