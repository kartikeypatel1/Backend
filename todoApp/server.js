const express=require('express');
const app=express();
require('dotenv').config();
const PORT=process.env.PORT || 3000;
//middleware to parse JSON request bodies
app.use(express.json());
//import the todo routes
const todoRoutes=require('./routes/todo');
//mount the todo aspi routes 
app.use('/api/v1',todoRoutes);
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});

//import the function to connect to the database
const connectDB=require('./config/database');
//connect to the database
connectDB();

app.get('/',(req,res)=>{    
    res.send(`<h1>Welcome to the Todo</h1>`);
});