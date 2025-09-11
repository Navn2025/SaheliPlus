// src/models/otp.model.js
const mongoose=require("mongoose");

const otpSchema=new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
        },
        otp: {
            type: String, // hashed OTP
            required: true,
        },
        otpExpires: {
            type: Date,
            required: true,
        },
    },
    {timestamps: true}
);

// Automatically remove expired OTP docs
otpSchema.index({otpExpires: 1}, {expireAfterSeconds: 0});

module.exports=mongoose.model("Otp", otpSchema);
