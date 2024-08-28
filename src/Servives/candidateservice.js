const otpGenerator = require('otp-generator')
const nodemailer = require("nodemailer");
require('dotenv').config();

function generateOTP(){
    const otp = otpGenerator.generate(4, { upperCaseAlphabets: false, specialChars: false,lowerCaseAlphabets:false });
    return otp;
}
async function sendOTP(email,message)
{
  console.log(process.env.EMAIL,process.env.PASSWORD)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });
   
    const otp = generateOTP()

    const mailOptions = {
      from: {
        name: "CSG Team",
        address: process.env.EMAIL,
      },
      to: email,
      subject: "Verification OTP",
      text: "Dear user,\n\nWe've received a request for your OTP",
      html: `<p>${message} ${otp} </p><p>Thank you,<br>CSG Team</p>`,
    };
    await transporter.sendMail(mailOptions);
    return otp
}
module.exports = {sendOTP};



