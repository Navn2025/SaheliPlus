// routes/user.js
const express=require("express");
const UserModel=require("../models/auth/user.auth");
const SaheliModel=require("../models/auth/saheli.auth");
const authenticateToken=require("../middlewares/role.middleware");

const router=express.Router();

// GET /api/me
router.get("/me", authenticateToken, async (req, res) =>
{
    try
    {
        let user;
        if (req.user.role==="user")
        {
            user=await UserModel.findById(req.user.id).select("-password");
        } else if (req.user.role==="saheli")
        {
            user=await SaheliModel.findById(req.user.id).select("-password");
        }

        if (!user) return res.status(404).json({message: "User not found"});

        res.json({user, role: req.user.role});
    } catch (err)
    {
        console.error("Error fetching user:", err);
        res.status(500).json({message: "Server error"});
    }
});

module.exports=router;
