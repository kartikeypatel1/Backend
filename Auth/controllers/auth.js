const bcrypt=require('bcrypt');
const user=require('../models/user');
//signup controller
exports.signup=async(req,res)=>{
    try{
        const {name,email,password,role}=req.body;
        //check if user already exists
        const existingUser=await user.findOne({email});
        if(existingUser){
            return res.status(400).json({message:"User already exists"});
        }
        //hash the password
        const hashedPassword=await bcrypt.hash(password,10);
        //create a new user
        const newUser=await user.create({
            name,
            email,
            password:hashedPassword,
            role
        });
        res.status(201).json({message:"User created successfully",user:newUser});
    }
    catch(error){
        console.error(error);
        res.status(500).json({message:"Internal server error"});

    }
}

//login controller
exports.login=async(req,res)=>{
    try{
        const {email,password}=req.body;
        //check if user exists
        const existingUser=await user.findOne({email});
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
        console.error(error);
        res.status(500).json({message:"Internal server error"});
    }

}