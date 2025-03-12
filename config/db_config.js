
// define modules 
require('dotenv').config();
const mongooseModule=require("mongoose");


try{
    mongooseModule.connect(process.env.MONGODB_REMOTE_URL).then((data)=>{
        console.log(`🎃 connected to database cluster  successfuly`)
    })
    .catch((err)=>{
        console.log('Something went wrong ! 😥 connecting to database cluster ')
    })    
}
catch(err){
    throw new Error("Internal error in data storage module")   
}


module.exports={mongooseModule};