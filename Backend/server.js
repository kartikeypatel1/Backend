
//server instantiated
const express = require('express');
const app = express();
const port = 5000;

//use to parse req.body in express -> PUT or POST request
const bodyParser = require('body-parser');

//middleware to parse JSON bodies
app.use(bodyParser.json());




//activate the server on the 3000 port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});



//Routes
app.get('/', (request, response) => {
  response.send('Hello World! , This is a simple Express server.');
});


app.post('/api/cars',(req,res)=>{
    const {name,brand}=req.body;
    console.log(name,brand);
    res.send('Car added successfully');
});
 
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/Car')
.then(() => {console.log("Connected to MongoDB!")})
.catch(err => {console.error("MongoDB connection error:", err)});
