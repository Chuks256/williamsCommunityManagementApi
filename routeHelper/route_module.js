
//  define module 
require('dotenv').config();
const {User}=require("../model/user.model");
const jwtmodule = require("jsonwebtoken")
const cryptoModule =require("crypto");
const {cloudinary} =require("../cloud_config/cloudinary_config");

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

    async is_server_active(req,res){
        res.status(200).json({msg:"Server is fully active 😎"})
    }

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

  
    //  specially for qrcode :: function to  verify if user is validated or not 
    async is_user_validated(req,res){
        const [user_id_no]=req.body;
        const get_user_data=await User.findOne({id_no:user_id_no});
        if(get_user_data.status==="invalid"){
            res.status(404).json({msg:false})
        }
        else
        if(get_user_data.status==='valid'){
            res.status(200).json({msg:true})
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
            const generate_user_id_no=cryptoModule.randomBytes(3).toString('hex')
            const create_user_acct=await new User({
                first_name:first_name,
                last_name:last_name,
                date_of_birth:date_of_birth,
                profession:profession,
                phone_no:phone_no,
                home_address:home_address,
                email:email,
                landlord_name:landlord_name,
                id_no:generate_user_id_no
            })
            try{
                await create_user_acct.save();
                const payload={idNo:generate_user_id_no}
                const create_session_token = jwtmodule.sign(payload,process.env.API_SECRET);
                res.status(200).json({msg:"signup_successful_go_to_the_hub_for_verification",id_no:payload.idNo.toUpperCase(),session_id: create_session_token});    
            }
            catch(err){
                console.log(err)
                res.status(404).json({errmsg:"Something went wrong"})
            }
        }
        else{
            res.status(200).json({msg:"account already exist"})
        }
    }


    // function to upload profile pics 
    async upload_profile_pics(req,res){
        const {Authorization}=req.header;
        const decodeSessionToken = jwtmodule.verify(Authorization,this.api_secret_key);
           const getUserData = await User.findOne({id_no:decodeSessionToken.idNo});
           try{
            cloudinary.uploader.upload(req.file.path, async(error, result) => {
                if (error) {
                  console.error(error);
                  return res.status(500).send('Error uploading Image  to Image Cloud bucket 😥');
                }
                if(result){
                    getUserData.profile_pics=result.secure_url;
                    await getUserData.save();
                    res.status(200).json({msg:"Profile pics sucessfully uploaded to the cloud"})
                }
            })
        }
        catch(err){
            res.status(403).json({errMsg:"Something went wrong"})
        }
    }

    
    // # Admin route 
    async make_admin_route(req,res){// admin route to make other user admin ! route must only be access by super admin 
        const [user_db_id]=req.body;
        const getUserToBeMadeAdmin = await User.findOne({_id:user_db_id});
            getUserToBeMadeAdmin.role='admin';
            await getUserToBeMadeAdmin.save();
            res.status(200).json({msg:`${getUserToBeMadeAdmin.first_name}_${getUserToBeMadeAdmin.last_name} is successfully made an admin`});
    }

    // function is only accessed by super admin 
    async remove_admin(req,res){
        const [user_db_id]=req.body;
        const getUserToBeMadeAdmin = await User.findOne({_id:user_db_id});
        getUserToBeMadeAdmin.role='user';
        await getUserToBeMadeAdmin.save();
        res.status(200).json({msg:`😎 ${getUserToBeMadeAdmin.first_name}_${getUserToBeMadeAdmin.last_name} is successfully removed from being an admin`});
    }

    // function to be added later :: future addition 
    async remove_user(req,res){}
    
    //  function to update user data 
    async update_user_data(req,res){
        const [first_name,last_name,dob,profession,phone_no,home_address,home_no,email,landlord_name,no_of_people_staying]=req.body;
        const {Authorization}=req.headers;
        const decodeSessionToken = jwtmodule.verify(Authorization,this.api_secret_key);
        const getUserData=User.findOne({id_no:decodeSessionToken.idNo});
        getUserData.first_name=first_name
        getUserData.last_name=last_name
        getUserData.date_of_birth=dob;
        getUserData.profession = profession
        getUserData.phone_no=phone_no
        getUserData.home_address=home_address;
        getUserData.home_no = home_no;
        getUserData.email=email;
        getUserData.landlord_name=landlord_name;
        getUserData.no_of_people_staying=no_of_people_staying
        await getUserData.save();
        res.status(200).json({msg:'user account successfully updated'})
    }
    

    // function toinvalidate user 
    async invalidate_user(req,res){
        const [user_id_no]=req.body;
        const validateUserAcct = await User.findOne({id_no:user_id_no});
        validateUserAcct.status="invalid";
        await validateUserAcct.save(); 
        res.status(200).json({msg:`${validateUserAcct.first_name} ${validateUserAcct.last_name} account is successfully invalid`})
    }

    // function to get all user data
    async get_all_user_data(req,res){
        const getAllUserData= await User.find({});
        res.status(200).json(getAllUserData);
    }
    
    //  function for generating user id crd 
    async generate_user_id_card(req,res){
        const [user_id_no]=req.body;
        const getUserData = await User.findOne({id_no:user_id_no});
        
        // parse user data gotten from db 
        const parse_user_data={
            Names:{
                first_name:getUserData.first_name,
                last_name:getUserData.last_name
            },
            profile_pics:getUserData.profile_pics,
            dob:getUserData.date_of_birth,
            home_addr:getUserData.home_address,
            id_no:getUserData.id_no
        }
        res.status(200).json(parse_user_data);
    }
    
    
    // function to validate user 
    async validate_user(req,res){
        const [user_id_no]=req.body;
        const validateUserAcct = await User.findOne({id_no:user_id_no});
        validateUserAcct.status="valid";
        await validateUserAcct.save(); 
        res.status(200).json({msg:`${validateUserAcct.first_name} ${validateUserAcct.last_name} account is successfully validated`})
    }


}


// export route helper module to index file 
module.exports={routeHelper}