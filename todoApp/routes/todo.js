const express=require('express');
const router=express.Router();
//import the controller function for creating a new todo
const { createTodo }=require('../controllers/createTodo');
//define route for creating a new todo
router.post('/createTodo',createTodo);
module.exports=router;