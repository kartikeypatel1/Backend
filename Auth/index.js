const express=require('express');
const app=express();
require('dotenv').config();
const PORT= process.env.PORT||4000;
app.use(express.json());


require("./config/database").connect();


//importing the routes and mounting them
const user=require('./routes/user');
app.use("/api/v1",user);

app.get('/',(req,res)=>{
    res.send('<h1>hallo kartikey</h1>');
})

app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
})