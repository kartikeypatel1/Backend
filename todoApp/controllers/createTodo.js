

//import the model
const { data } = require('framer-motion/client');
const Todo=require('../models/todo');

//define route handler for creating a new todo
exports.createTodo=async(req,res)=>{
    try{
        //extract title and description from request body
        const {title,description}=req.body;
        //create a new todo obj and insert in DB
        const response=await Todo.create({title,description});
        //send success response to client
        res.status(200).json({
            success:true,
            data:response,
            message:'Todo created successfully'
        });
    }   
    catch(err){
        console.error('Error creating todo:',err);
        res.status(500).json({
            success:false,
            data:'internal server error',
            message:'Internal server error'
        });
    }
}
