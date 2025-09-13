// sos.js (Express route)
const express=require("express");
const twilio=require("twilio");
const dotenv=require("dotenv");
const authMiddleware=require("../middlewares/auth.middleware");
const customerModel=require("../models/auth/user.auth");
const saheliModel=require("../models/auth/saheli.auth");

dotenv.config();
const router=express.Router();

const client=twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

router.post("/sos", async (req, res) =>
{
    const {lat, lng, userId}=req.body;
    const recipient="whatsapp:+919201059607"; // Emergency contact WhatsApp
    const phoneRecipient="+919201059607";     // Emergency contact phone number

    try
    {
        const mapsLink=`https://www.google.com/maps?q=${lat},${lng}`;

        // 1️⃣ Send WhatsApp message with location
        const waMsg=await client.messages.create({
            body: `🚨 SOS Alert!\nUser: ${userId} is in danger \nLocation: ${mapsLink}`,
            from: "whatsapp:+14155238886", // Twilio WhatsApp sandbox
            to: recipient
        });

        // 2️⃣ Make a call to alert
        const call=await client.calls.create({
            twiml: `<Response>
                <Say voice="alice">🚨 SOS Alert! User ${userId} is in danger.</Say>
                <Pause length="1"/>
                <Say voice="alice">Check WhatsApp for exact location details.</Say>
              </Response>`,
            from: process.env.TWILIO_PHONE, // Your Twilio number
            to: phoneRecipient
        });

        res.json({
            success: true,
            whatsappSid: waMsg.sid,
            callSid: call.sid
        });

    } catch (err)
    {
        res.status(500).json({error: err.message});
    }
});

module.exports=router;