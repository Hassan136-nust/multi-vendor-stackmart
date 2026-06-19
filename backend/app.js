const express = require ("express");
const ErrorHandler = require("./utils/ErrorHandler");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const app = express();
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:true}));

app.use(fileUpload({useTempFiles:true}));

app.use(express.json());

if(process.env.NODE_ENV!="production"){
    require("dotenv").config({
        path:"backend/config/.env"
    });
    
}
app.use(ErrorHandler)
module.exports=app;
