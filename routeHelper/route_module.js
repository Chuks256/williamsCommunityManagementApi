//  define module 
require('dotenv').config();
const {User}=require("../model/user.model");
const jwtmodule = require("jsonwebtoken")
const cryptoModule =require("crypto");

// define route class 
class routeHelper{
    constructor(){
        this.api_version='1.0.0';
        this.api_secret_key=process.env.API_SECRET;
    }

    // helper function 
    async generate_id_number(num_length=0){
        return cryptoModule.randomBytes(num_length).toString('hex');
    }

    // # User route 

    // function to sign in user 
    async sign_in_user(req,res){
        const {last_name,id_no}=req.body;
        const checkUserExist = await User.find({
            last_name:last_name,
            id_no:id_no
        });
        if(!checkUserExist){
            res.status(404).json({errMsg:"Wrong Credentials provided"});
        }
        else{
            const payload={idNo:id_no}
            const create_session_token = jwtmodule.sign(payload,this.api_secret_key);
            res.status(200).json({msg:"Signin_successful", session_id: create_session_token});
        }
    }

    // function for user to get specific data 
    async get_user_specific_data(req,res){
        const {Authorization}=req.header;
        const decodeSessionToken = jwtmodule.verify(Authorization,this.api_secret_key);
        const getData = await User.findOne({id_no:decodeSessionToken.idNo});
        res.status(200).json(getData) 
    }

    //  function to signup user 
    async sign_up_user(req,res){
        const {first_name,date_of_birth,last_name,profession,phone_no,email,home_address,landlord_name,house_no,no_people_staying}=req.body;
        const check_user_exist = await User.findOne({phone_no:phone_no,email:email});
        if(!check_user_exist){
            const create_user_acct=await new User({
                first_name:first_name,
                last_name:last_name,
                date_of_birth:date_of_birth,
                profession:profession,
                phone_no:phone_no,
                home_address:home_address,
                email:email,
                landload_name:landlord_name,
                id_no:this.generate_id_number(5),
            })
            try{
                create_user_acct.save();
                const payload={idNo:id_no}
                const create_session_token = jwtmodule.sign(payload,this.api_secret_key);
                res.status(200).json({msg:"signup_successful_go_to_the_hub_for_verification",id_no:payload.idNo,session_id: create_session_token});    
            }
            catch(err){
                res.status(404).json({errmsg:"Something went wrong"})
            }
        }
        else{
            res.status(200).json({msg:"account already exist"})
        }
    }


    // function to upload profile pics 
    async upload_profile_pics(req,res){}

    // # Admin route 
    async make_admin_route(req,res){}
    async remove_admin(req,res){}
    async remove_user(req,res){}
    async update_user_data(req,res){}
    async invalidate_user(req,res){}
    async get_all_user_data(req,res){}
    async generate_user_id_card(req,res){}
    async validate_user(req,res){}

}


// export route helper module to index file 
module.exports={routeHelper}