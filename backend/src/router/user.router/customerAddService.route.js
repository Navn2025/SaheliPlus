const express=require('express');
const router=express.Router();
const customerModel=require('../../models/auth/user.auth');

router.post('/:id/customerService', async (req, res) =>
{
    const {id}=req.params;

    const {title, description, price, duration, location: {latitude, longitude}}=req.body;
    const customer=await customerModel.findById(id);
    if (!customer) return res.status(404).json({message: 'Customer not found'});
    customer.servicesRequired.push({title, description, price, duration, location: {latitude, longitude}});
    await customer.save();
    res.status(200).json({message: 'Service added successfully', services: customer.servicesOffered});
});
module.exports=router;