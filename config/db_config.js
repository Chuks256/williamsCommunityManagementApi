
// define modules 
require('dotenv').config();
const mongooseModule=require("mongoose");

mongooseModule.connect(process.env.MONGODB_REMOTE_URL).then((data)=>{
    console.log(`🎃 connected to database cluster `)
})
.catch((err)=>{
    console.log(err)
})

module.exports={mongooseModule};