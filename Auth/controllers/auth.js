const bcrypt=require('bcrypt');
const mongoose=require('mongoose');
const User=require('../models/user');

//signup controller

exports.signup=async(req,res)=>{
    try{
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({message:"Database unavailable. Please check your MongoDB connection."});
        }

        const {name,email,password,role}=req.body;
        
        if (!name || !email || !password || !role) {
            return res.status(400).json({message: "Please fill all the details carefully"});
        }

        //check if user already exists
        const existingUser=await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message:"User already exists"});
        }
        //hash the password
        const hashedPassword=await bcrypt.hash(password,10);
        //create a new user
        const newUser=await User.create({
            name,
            email,
            password:hashedPassword,
            role
        });
        res.status(201).json({message:"User created successfully",user:newUser});
    }
    catch(error){
    console.error("Signup Error:", error);

    res.status(500).json({
        success: false,
        message: error.message
    });
}
}

//login controller
exports.login=async(req,res)=>{
    try{
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({message:"Database unavailable. Please check your MongoDB connection."});
        }

        const {email,password}=req.body;
        
        if (!email || !password) {
            return res.status(400).json({message: "Please fill all the details carefully"});
        }

        //check if user exists
        const existingUser=await User.findOne({email});
        if(!existingUser){
            return res.status(400).json({message:"User does not exist"});
        }

        //compare the password
        const isPasswordValid=await bcrypt.compare(password,existingUser.password);
        if(!isPasswordValid){
            return res.status(400).json({message:"Invalid password"});
        }
        
        res.status(200).json({message:"Login successful",user:existingUser});
    }
    catch(error){
    console.error("Login Error:", error);

    res.status(500).json({
        success: false,
        message: error.message
    });
    }

}