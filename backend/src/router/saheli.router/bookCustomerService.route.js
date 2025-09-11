const express=require('express');
const saheliModel=require('../../models/auth/saheli.auth');
const customerModel=require('../../models/auth/user.auth');
const router=express.Router();
router.post('/:id/bookCustomerService/:serviceId', async (req, res) =>
{
    const {id, serviceId}=req.params; // Saheli ID
    console.log(id);
    const {saheliId, saheliName, notes}=req.body; // Booking details

    if (!saheliId||!saheliName)
    {
        return res.status(400).json({error: "saheliId, saheliName, and serviceId are required"});
    }
    try
    {
        const customer=await customerModel.findById(id);
        if (!customer) return res.status(404).json({error: "Customer not found"});

        // Find the service being booked
        const service=customer.servicesRequired.id(serviceId);
        if (!service) return res.status(404).json({error: "Service not found"});
        customer.bookings=customer.bookings||[];
        customer.bookings.push({
            saheliId,
            saheliName,
            serviceId: service._id,
            serviceTitle: service.title,
            notes,
            status: "pending",
            bookingDate: new Date()
        });

        await customer.save();

        res.status(200).json({message: "Booking request sent successfully", bookings: customer.bookings});
    } catch (err)
    {
        console.error(err);
        res.status(500).json({error: "Server error"});
    }
});

module.exports=router;