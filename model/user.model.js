// define module 
require("dotenv").config();
const {mongooseModule}= require("../config/db_config");

const userModel= new mongooseModule.Schema({
name:{
    first_name:{
        type:String
    },
    last_name:{
        type:String
    }
},
date_of_birth:{
    type:Number
},
profession:{
    type:String
},
phone_no:{
    type:Number
},
profile_pics:{
    type:String
},
home_address:{
    type:String
},
home_no:{
    type:Number,
    default:0
},
email:{
    type:String
},
landlord_name:{
    type:String
},
status:{
    type:String,
    default:'invalid'
}
})

const User = mongooseModule.model(userModel,'User');


module.exports={User}