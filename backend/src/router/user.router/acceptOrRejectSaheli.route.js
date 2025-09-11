const express=require('express');
const saheliModel=require('../../models/auth/saheli.auth');
const customerModel=require('../../models/auth/user.auth');
const router=express.Router();

// PATCH /api/saheli/:saheliId/bookings/:bookingId
router.patch('/:customerId/bookings/:bookingId', async (req, res) =>
{
    const {customerId, bookingId}=req.params;
    const {status}=req.body; // "accepted" or "rejected"

    if (!["accepted", "rejected"].includes(status))
    {
        return res.status(400).json({error: "Invalid status. Must be 'accepted' or 'rejected'."});
    }

    try
    {
        const customer=await customerModel.findById(customerId);
        if (!customer) return res.status(404).json({error: "Customer not found"});

        // Find the booking
        const booking=customer.bookings.id(bookingId);
        if (!booking) return res.status(404).json({error: "Booking not found"});

        // Update status
        booking.status=status;
        await customer.save();

        res.status(200).json({message: `Booking ${status} successfully`, booking});
    } catch (err)
    {
        console.error(err);
        res.status(500).json({error: "Server error"});
    }
});

module.exports=router;
