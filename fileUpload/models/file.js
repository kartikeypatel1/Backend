const mongoose=require('mongoose');
const nodemailer=require('nodemailer');
const fileSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    imageUrl:{
        type:String,
    },
    tags:{
        type:String,
    },
    email:{
        type:String,
    }
});


//post middleware for file upload
fileSchema.post('save',async function(doc){
    try{
        // Send email notification
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        }); 
            

        let info = await transporter.sendMail({
            from: process.env.MAIL_USER,
            to: doc.email,
            subject: 'File Upload Successful',
            text: `Hello ${doc.name},\n\nYour file has been successfully uploaded. You can access it here: ${doc.imageUrl}\n\nThank you!`,
        });
    }
    catch(err){
        console.error('Error occurred while saving file:', err);
    }
});

const File=mongoose.model("File",fileSchema);
module.exports=File;