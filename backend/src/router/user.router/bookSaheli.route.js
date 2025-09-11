const express=require('express');
const saheliModel=require('../../models/auth/saheli.auth');
const router=express.Router();
router.post('/:id/bookSaheli/:serviceId', async (req, res) =>
{
    const {id, serviceId}=req.params; // Saheli ID
    const {customerId, customerName, notes}=req.body; // Booking details

    if (!customerId||!customerName||!serviceId)
    {
        return res.status(400).json({error: "customerId, customerName, and serviceId are required"});
    }
    try
    {
        const saheli=await saheliModel.findById(id);
        if (!saheli) return res.status(404).json({error: "Saheli not found"});

        // Find the service being booked
        const service=saheli.servicesOffered.id(serviceId);
        if (!service) return res.status(404).json({error: "Service not found"});
        saheli.bookings=saheli.bookings||[];
        saheli.bookings.push({
            customerId,
            customerName,
            serviceId: service._id,
            serviceTitle: service.title,
            notes,
            status: "pending",
            bookingDate: new Date()
        });

        await saheli.save();

        res.status(200).json({message: "Booking request sent successfully", bookings: saheli.bookings});
    } catch (err)
    {
        console.error(err);
        res.status(500).json({error: "Server error"});
    }
});

module.exports=router;