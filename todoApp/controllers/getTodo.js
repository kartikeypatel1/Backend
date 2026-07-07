const Todo=require("../models/todo");
exports.getTodo=async(req,res)=>{
    try{
        const todos=await Todo.find({});
        // response
        res.status(200)
        .json({
            success:true,
            data:true,
            message:"entire todo data fetched"
        });
    }catch(err){
        console.error(err);
        res.status(500)
        .json({
            success:false,
            error:err.message,
            message:"server error ho gyi"
        });
    }
}

exports.getTodoById=async(req,res)=>{
    try{
        const id=req.params.id;
        const todo=await Todo.find({_id: id});
        // response
        if(!todo){
            return res.status(404).json({
                success:false,
                message:"No data found with given id"
            });
        }
        res.status(200)
        .json({
            success:true,
            data:true,
            message:`Todo ${id} data successfully fetched`
        });
    }catch(err){
        console.error(err);
        res.status(500)
        .json({
            success:false,
            error:err.message,
            message:"server error ho gyi"
        });
    }
}