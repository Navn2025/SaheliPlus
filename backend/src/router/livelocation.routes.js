// sos.js (Express route)
const express=require("express");
const twilio=require("twilio");
const dotenv=require("dotenv");

dotenv.config();
const router=express.Router();

const client=twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

router.post("/live-location", async (req, res) =>
{
    const {lat, lng, userId}=req.body;
    const recipient="whatsapp:+919201059607"; // Emergency contact WhatsApp

    try
    {
        const mapsLink=`https://www.google.com/maps?q=${lat},${lng}`;

        const waMsg=await client.messages.create({
            body: `🚨 Live Location: ${mapsLink}`,
            from: "whatsapp:+14155238886", // Twilio WhatsApp sandbox
            to: recipient
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