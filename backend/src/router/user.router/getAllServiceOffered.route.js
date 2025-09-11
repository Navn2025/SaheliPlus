// routes/saheliService.js
const express=require("express");
const router=express.Router();
const saheliModel=require("../../models/auth/saheli.auth");

// GET /api/saheli/services
router.get("/saheliOfferedService", async (req, res) =>
{
    try
    {
        const sahelis=await saheliModel.find().select("name servicesOffered");

        const allServices=sahelis.flatMap(saheli =>
            saheli.servicesOffered.map(service => ({
                _id: service._id,
                title: service.title,
                description: service.description,
                price: service.price,
                duration: service.duration,
                saheliId: saheli._id,
                saheliName: saheli.name,
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
