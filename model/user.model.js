// define module 
require("dotenv").config();
const {mongooseModule}= require("../config/db_config");

const userModel= new mongooseModule.Schema({
    first_name:{
        type:String
    },
    last_name:{
        type:String
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

no_people_staying:{
    type:Number,
    default:0
},

id_no:{
    type:String
},
status:{
    type:String,
    default:'invalid'
},
role:{
    type:String,
    default:'user'
}
})

const User = mongooseModule.model('User',userModel);


module.exports={User}