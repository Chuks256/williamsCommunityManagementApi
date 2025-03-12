// define modules
require("./config/db_config")
const expressModule = require("express");
const app=expressModule();
const port = 3304 ;
const corsModule = require("cors")
const bodyParser = require('body-parser');
const {isUserAdmin,isUserVerified}=require("./guard/routeGuard")
const {superAdminRoute} =require("./guard/superAdminGuard")
const {routeHelper} = require("./routeHelper/route_module")

app.use(expressModule.json())
app.use(expressModule.urlencoded({extended:true}))
app.use(corsModule())
app.use(bodyParser.json())
app.disable('x-powered-by');


// define route class 
const routeObj= new routeHelper();

// define routes 

// user route 
app.get('/api/get_user_specific_data',isUserVerified,routeObj.get_user_specific_data);
app.get('/api/is_user_validated',routeObj.is_user_validated);
app.post('/api/sign_in_user',routeObj.sign_in_user); //workonthis later 
app.post('/api/sign_up_user',routeObj.sign_up_user);

// admin route 
app.get('/api/admin/get_all_user_data',isUserAdmin,routeObj.get_all_user_data);
app.post('/api/admin/update_user',isUserAdmin,routeObj.update_user_data)
app.post('/api/admin/make_admin',isUserAdmin,superAdminRoute,routeObj.make_admin_route);
app.post('/api/admin/remove_admin',isUserAdmin,superAdminRoute,routeObj.remove_admin);
app.post('/api/admin/invalidate_user',isUserAdmin,routeObj.invalidate_user);
app.post('/api/admin/generate_id_card',isUserAdmin,routeObj.generate_user_id_card);
app.post('/api/admin/validate_user',isUserAdmin,routeObj.validate_user);



app.listen(port,()=>{
    console.log('Server is coming running 😅')
})


