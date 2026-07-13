const express=require('express');
const router=express.Router();
const{login ,signup}=require('../controllers/auth');
const {auth, isStudent, isAdmin}=require('../middlewares/auth');

router.post("/login",login);
router.post("/signup",signup);
//testing route
router.get('/test',auth,(req,res)=>{
     res.send({
        success:true,
        messages:"Welcome to the protected router for the student"
    })
})

//student router
router.get('/student',auth,isStudent,(req,res)=>{
    res.send({
        success:true,
        messages:"Welcome to the protected router for the student"
    })
})
//admin role route
router.get('/admin',auth,isAdmin,(req,res)=>{
    res.send({
        success:true,
        messages:"Welcome to the protected router for the Admin"
    });
})
module.exports=router;