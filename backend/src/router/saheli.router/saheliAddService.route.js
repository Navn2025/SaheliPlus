// routes/saheliService.js
const express=require("express");
const router=express.Router();
const Saheli=require("../../models/auth/saheli.auth"); // your Saheli model

// POST /api/saheli/:id/service
router.post("/:id/saheliService", async (req, res) =>
{
  const saheliId=req.params.id;
  const {title, description, price, duration}=req.body;

  // Basic validation
  if (!title||!price)
  {
    return res.status(400).json({error: "Title and price are required."});
  }

  try
  {

    const saheli=await Saheli.findById(saheliId);
    if (!saheli) return res.status(404).json({error: "Saheli not found"});

    // Add new service
    saheli.servicesOffered.push({title, description, price, duration});
    await saheli.save();

    res.status(200).json({message: "Service added successfully", services: saheli.servicesOffered});
  } catch (err)
  {
    console.error(err);
    res.status(500).json({error: "Server error"});
  }
});

module.exports=router;
