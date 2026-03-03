// const mongoose=require('mongoose');
// require('dotenv').config();
// const connectDB=()=>{
//     mongoose.connect(process.env.DATABASE_URL,{
//         useNewUrlParser:true,
//         useUnifiedTopology:true
//     }).then(()=>{
//         console.log('Connected to MongoDB');
//     }).catch((err)=>{
//         console.error('Error connecting to MongoDB:',err);
//         process.exit(1);
//     });
// }
// module.exports=connectDB;

const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL);
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('Error connecting to MongoDB:', err.message);
        process.exit(1);
    }
};

module.exports = connectDB;