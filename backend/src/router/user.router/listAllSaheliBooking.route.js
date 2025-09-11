const express=require('express');
const saheliModel=require('../../models/auth/saheli.auth');
const customerModel=require('../../models/auth/user.auth');
const router=express.Router();

router.get('/:id/listAllSaheliBooking', async (req, res) =>
{
    try
    {
        const {id}=req.params;
        const customer=await customerModel.findById(id);

        if (!customer)
        {
            return res.status(404).json({error: "customer not found"});
        }

        // send bookings as JSON
        res.json({bookings: customer.bookings});
    } catch (err)
    {
        console.error("Error fetching bookings:", err);
        res.status(500).json({error: "Server error"});
    }
});

module.exports=router;
