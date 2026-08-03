const express=require('express');
const router=express.Router();

const {localFileUpload,imageUpload,videoUpload ,imageSizeReducer }=require('../controllers/fileUpload');

router.post('/localfileupload',localFileUpload);
router.post('/imageupload',imageUpload);
router.post('/videoupload',videoUpload);
router.post('/imageSizeReducer',imageSizeReducer);


module.exports=router;
