const mongoose=require("mongoose")
const DBConnectionString=process.env.MongoDBConnectionString
mongoose.connect(DBConnectionString).then(res=>{
    console.log(`mongose db connected successfully`);
    
}).catch(err=>{
    console.log(`db connection failed`);
    console.log(err);
    
    
})