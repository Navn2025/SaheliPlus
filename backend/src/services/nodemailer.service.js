const nodemailer=require("nodemailer");

// Create a test account or replace with real credentials.
const transporter=nodemailer.createTransport({
    host: "smtp.gmail.com",   // ✅ correct host
    port: 465,                // secure port
    secure: true,
    auth: {
        user: "navneett546@gmail.com", // your Gmail
        pass: "tcvc ybwb ovpu lizf",
    },
});


module.exports=transporter;