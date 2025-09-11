const transporter=require("../services/nodemailer.service");

const sendEmail=async (email, otp) =>
{
    const info=await transporter.sendMail({
        from: '"hello from this side" <navneett546@gmail.email>',
        to: email,
        subject: "otp for verification",
        text: otp, // plain‑text body
        html: `<b>Hello world? ${otp}</b>`, // HTML body
    });

    console.log("Message sent:", info.messageId);
}
module.exports={sendEmail};