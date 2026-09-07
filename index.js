require("dotenv").config()
const express=require("express")
const cors=require("cors")
const routes=require("./Router/allRoutes")
const MetroKeyServer=express()
require("./config/DBConnection")
MetroKeyServer.use(cors())
MetroKeyServer.use(express.json())
MetroKeyServer.use(routes)
MetroKeyServer.use("/uploads",express.static("./uploads"))
const PORT=process.env.PORT
MetroKeyServer.listen(PORT,()=>{
    console.log(`server started at port number: ${PORT}`);
    
})
MetroKeyServer.use((err,req,res,next)=>{
    res.status(500).json(err.message)
})

MetroKeyServer.get("/",(req,res)=>{
    res.status(201).send(`server is started and waiting for client request`)
})
MetroKeyServer.post("/",(req,res)=>{
    res.status(200).send(`server is started`)
})
