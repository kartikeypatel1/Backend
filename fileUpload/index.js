const express=require('express');
// const router=express.Router();
// const multer=require('multer');
// const path=require('path');
// const fs=require('fs');
const app=express();


require("dotenv").config();


const PORT=process.env.PORT||4000;
app.use(express.json());

const fileupload=require("express-fileupload");
app.use(fileupload(
    {
    useTempFiles:true,
    tempFileDir:'/tmp/'
}));


require("./config/database").connect();
// cloudinary se connect krna hai ab 

require('./config/cloudinary');

//api mount krna hai ab 

const Upload=require('./routes/fileUpload');
app.use('/api/v1/upload',Upload);

app.listen(PORT,()=>{
    console.log(`server is running on http://localhost:${PORT}`);
})