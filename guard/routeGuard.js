// define modules
require('dotenv').config();
const {User}=require("../model/user.model");
const jwt=require("jsonwebtoken");

// check user role 
 const isUserAdmin= async (req,res,next)=>{
    const [Authorization]=req.headers;
    const validateSessionToken = jwt.verify(process.env.API_SECRET,Authorization);
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
    const [Authorization]=req.headers;
    const validateSessionToken = jwt.verify(process.env.API_SECRET,Authorization);
    const checkUserValidity = await User.findOne({id_no:validateSessionToken.idNo});
    if(checkUserValidity.status === "invalid"){
        res.status(403).json({errMsg:"id invalid , check the hub to validate your id"})
    }
    else
    if(checkUserValidity.role ==="validated"){
        await next();
    }

    // function to check user role : super_admin 
    const isUserSuperAdmin=async(req,res,next)=>{
        const [Authorization]=req.headers;
    const validateSessionToken = jwt.verify(process.env.API_SECRET,Authorization);
    const checkUserRole = await User.findOne({id_no:validateSessionToken.idNo});
    if(checkUserRole.role === "admin"){
        res.status(403).json({errMsg:"access denied : you are not allowed to access this route,contact super admin"})
    }
    else
    if(checkUserRole.role ==="super_admin"){
        await next();
    }
    }
}

module.exports={isUserAdmin,isUserSuperAdmin,isUserVerified}