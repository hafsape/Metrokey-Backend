const jwt=require("jsonwebtoken")
const jwtAuthMiddleware=(req,res,next)=>{
    console.log("inside jwtAuthMiddleware");
  console.log(req.headers)
    const token=req.headers["authorization"].split(" ")[1]
    console.log(token)
  if(token){
    try{
       const jwtResponse=jwt.verify(token,process.env.secretKey)
       console.log(jwtResponse);
       req.payload=jwtResponse.email
       
      next()
  }catch(err){
    res.status(401).json(`authorisation failed,token missing`)
  }
    
}
}
module.exports=jwtAuthMiddleware