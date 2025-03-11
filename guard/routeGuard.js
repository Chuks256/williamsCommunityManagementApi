// define modules
require('dotenv').config();
const {User}=require("../model/user.model");
const jwt=require("jsonwebtoken");

const routeGuard=(req,res,next)=>{
}

module.exports={routeGuard}