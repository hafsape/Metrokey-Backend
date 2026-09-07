const express=require("express")
const { registerController, loginController, updateUserController, getAllAgentsController, viewAgentController, getAllUsersController, deleteUserController, subscriptionPaymentController, getAllAgentsAdminController, googleAuthController, getCountController } = require("../Controllers/userController")
const jwtAuthMiddleware = require("../MiddleWares/jwtAuthMiddleware")
const multerMiddleware = require("../MiddleWares/multerMiddleware")
const { addPropertyController, getAllPropertiesController, viewPropertyController, getAgentPropertiesController, getHomePropertiesController, getLatestPropertiesController, deleteAgentPropertyController, getAllPropertiesAdminController, approvePropertyController, generateAiController, latestPropertiesAdminController } = require("../Controllers/propertyController")
const router=new express.Router()

//register
router.post("/register",registerController)
//login
router.post("/login",loginController)
//google login
router.post("/google/login",googleAuthController)
//update user
router.put("/update/:id/user",jwtAuthMiddleware,multerMiddleware.single("profileImage"),updateUserController)
//add property
router.post("/addproperty",jwtAuthMiddleware,multerMiddleware.array("propertyImages",3),addPropertyController)
//get all properties
router.get("/allproperties",jwtAuthMiddleware,getAllPropertiesController)
//view property
router.get("/view/:id/property",jwtAuthMiddleware,viewPropertyController)
//agent properties
router.get("/agentProperties",jwtAuthMiddleware,getAgentPropertiesController)
//agent properties with limit 3
router.get("/latestPropertiesagent",jwtAuthMiddleware,getLatestPropertiesController)
//agent properties at userside
router.get("/agentProperties/:email",jwtAuthMiddleware,getAgentPropertiesController)
//get latest properties by limit 4
router.get("/homeproperties",getHomePropertiesController)
//get agents user
router.get("/getallagents",jwtAuthMiddleware,getAllAgentsController)
//getAll agents at admin
router.get("/getallagents/admin",jwtAuthMiddleware,getAllAgentsAdminController)
//get agent details
router.get("/view/:id/agent",jwtAuthMiddleware,viewAgentController)
//get delete added properties by agent
router.delete("/delete/:id/property",jwtAuthMiddleware,deleteAgentPropertyController)
//get all users Admin side
router.get("/allusers",jwtAuthMiddleware,getAllUsersController)
//get all properties
router.get("/allpropertiesadmin",jwtAuthMiddleware,getAllPropertiesAdminController)
//Approve Property
router.put("/approve/property/:id",jwtAuthMiddleware,approvePropertyController)
//delete users by admin
router.delete("/delete/:id/user",jwtAuthMiddleware,deleteUserController)
//handlesubscriptionpayment
router.put("/payment/subscription",jwtAuthMiddleware,subscriptionPaymentController)
//gen -AI 
router.post("/description/ai",jwtAuthMiddleware,generateAiController)
//get count of all controller
router.get("/count/all",jwtAuthMiddleware,getCountController)
//latest Properties Admin Controller
router.get("/latestproperties/admin",jwtAuthMiddleware,latestPropertiesAdminController)
module.exports=router