// define modules
require('dotenv').config();
const {User}=require("../model/user.model");
const jwt=require("jsonwebtoken");

// check user role 
 const isUserAdmin= async (req,res,next)=>{
    const {authorization}=req.headers;
    const validateSessionToken = jwt.verify(authorization,process.env.API_SECRET);
    const checkUserRole = await User.findOne({id_no:validateSessionToken.idNo});
    if(checkUserRole.role === "user"){
        res.status(403).json({errMsg:"access denied : you are not allowed to access this route"})
    }
    else
    if(checkUserRole.role ==="admin"){
        await next();
    }
}

//  function to check if user accountis valid 
 const isUserVerified=async(req,res,next)=>{
    const {authorization}=req.headers;
    const validateSessionToken = jwt.verify(authorization,process.env.API_SECRET);
    const checkUserValidity = await User.findOne({id_no:validateSessionToken.idNo});
    if(checkUserValidity.status === "invalid"){
        res.status(403).json({errMsg:"id invalid , check the hub to validate your id"})
    }

    if(checkUserValidity.status ==="validated"){
        await next();
    }
}

module.exports={isUserAdmin,isUserVerified}