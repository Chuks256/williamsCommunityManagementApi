// define modules
const expressModule = require("express");
const app=expressModule();
const port = 3304 ;
const corsModule = require("cors")
const bodyParser = require('body-parser');


app.use(expressModule.json())
app.use(expressModule.urlencoded({extended:true}))
app.use(corsModule())
app.use(bodyParser.json())



app.listen(port,()=>{
    console.log('Server is coming running 😅')
})


