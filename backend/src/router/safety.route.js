const express=require('express');
const router=express.Router();
const safetyModel=require('../models/safety.model');
router.post('/postlocation', async (req, res) =>
{
    const {lng, lat, rating, comment}=req.body;
    const location=await safetyModel.create({
        lat, lng, rating, comment
    })
    res.json(location)
})
router.get('/getlocation', async (req, res) =>
{
    const location=await safetyModel.find()
    res.json(location)
})

module.exports=router;
