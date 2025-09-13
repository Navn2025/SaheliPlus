// src/controllers/otp.controller.js
const bcrypt=require("bcryptjs");
const OtpModel=require("../models/otp.model");
const {sendEmail}=require("../components/email.comp");
const saheliModel=require("../models/auth/saheli.auth");
const customerModel=require("../models/auth/user.auth");

// 📩 Send OTP
async function sendOtpHandler(req, res)
{
    const {email}=req.body;
    if (!email) return res.status(400).json({message: "Email is required"});

    try
    {
        // Generate 6-digit OTP
        const otp=Math.floor(100000+Math.random()*900000).toString();

        // Save or update OTP record
        await OtpModel.findOneAndUpdate(
            {email},
            {
                otp: await bcrypt.hash(otp, 10),
                otpExpires: Date.now()+10*60*1000, // 10 minutes expiry
            },
            {upsert: true, new: true}
        );

        // Send OTP to user email
        await sendEmail(email, otp);

        res.status(200).json({message: "OTP sent successfully"});
    } catch (err)
    {
        console.error(err);
        res.status(500).json({message: "Error sending OTP", error: err.message});
    }
}

// ✅ Verify OTP
async function verifyOtpHandler(req, res)
{
    const {email, otp}=req.body;
    if (!email||!otp)
    {
        return res.status(400).json({message: "Email and OTP are required"});
    }

    try
    {
        const record=await OtpModel.findOne({email});
        const user=await saheliModel.findOne({email})||await customerModel.findOne({email})
        if (user) return res.status(400).json({message: "User Already Registered"});
        if (!record) return res.status(400).json({message: "No OTP found"});

        if (Date.now()>record.otpExpires)
        {
            return res.status(400).json({message: "OTP expired"});
        }

        const isMatch=await bcrypt.compare(otp, record.otp);
        if (!isMatch) return res.status(400).json({message: "Invalid OTP"});

        // ✅ OTP verified successfully
        console.log("OTP verified for", email);

        res.status(200).json({message: "OTP verified successfully"});
    } catch (err)
    {
        console.error(err);
        res.status(500).json({message: "Error verifying OTP", error: err.message});
    }
}

module.exports={sendOtpHandler, verifyOtpHandler};
