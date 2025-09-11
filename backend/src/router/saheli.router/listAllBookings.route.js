const express=require('express');
const saheliModel=require('../../models/auth/saheli.auth');
const router=express.Router();

router.get('/:id/listAllBookings', async (req, res) =>
{
    try
    {
        const {id}=req.params;
        const saheli=await saheliModel.findById(id);

        if (!saheli)
        {
            return res.status(404).json({error: "Saheli not found"});
        }

        // send bookings as JSON
        res.json({bookings: saheli.bookings});
    } catch (err)
    {
        console.error("Error fetching bookings:", err);
        res.status(500).json({error: "Server error"});
    }
});

module.exports=router;
