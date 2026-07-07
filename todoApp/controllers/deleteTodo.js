const Todo=require('../models/todo');
exports.deleteTodo=async(req,res)=>{
    try{
        const {id}=req.params;
        const {title,description}=req.body;
        await Todo.findByIdAndDelete(id);
        res.status(200).json({
            success:true,
            message:"Deleted successfully"
        })
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