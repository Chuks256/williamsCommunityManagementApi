//  define module 
require('dotenv').config();
const {User}=require("../model/user.model");
const jwtmodule = require("jsonwebtoken")
const cryptoModule =require("crypto");


class routeHelper{
    constructor(){
        this.api_version='1.0.0'
    }

    // # User route 
    

    // # Admin route 
}


// export route helper module to index file 
module.exports={routeHelper}