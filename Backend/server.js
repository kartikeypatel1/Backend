
//server instantiated
const express = require('express');
const app = express();
const port = 3000;

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

const mongoose=require('mongoose');
mongoose.connect('mongodb://localhost:27017/carsdb', { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Failed to connect to MongoDB', err);
});

const carSchema=new mongoose.Schema({
    name:String,
    brand:String
});