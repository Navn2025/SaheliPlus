// routes/saheliService.js
const express=require("express");
const router=express.Router();
const customerModel=require("../../models/auth/user.auth");

// GET /api/saheli/services
router.get("/customerOfferedService", async (req, res) =>
{
    try
    {
        const customers=await customerModel.find().select("name servicesRequired");

        const allServices=customers.flatMap(customer =>
            customer.servicesRequired.map(service => ({
                _id: service._id,
                title: service.title,
                description: service.description,
                price: service.price,
                duration: service.duration,
                customerId: customer._id,
                customerName: customer.name,
                location: {
                    longitude: customer.longitude,
                    latitude: customer.latitude
                }
            }))
        );

        res.status(200).json({total: allServices.length, services: allServices});
    } catch (err)
    {
        console.error(err);
        res.status(500).json({error: "Server error"});
    }
});

module.exports=router;
