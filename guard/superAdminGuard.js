// define modules
require('dotenv').config();
const {User}=require("../model/user.model");
const jwt=require("jsonwebtoken");

const superAdminRoute=async(req,res,next)=>{
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

module.exports={superAdminRoute}