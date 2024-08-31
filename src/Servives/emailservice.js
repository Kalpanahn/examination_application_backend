const nodemailer = require("nodemailer");
require('dotenv').config()
const {DeptAdmin}=require("../Modules/adminModule")


async function sendSlotBookingEmail( candidateEmail, date, time, district,  candidateName) {
    console.log(process.env.EMAIL, process.env.PASSWORD);
    let adminEmail;
    try{
 
    const admin = await DeptAdmin.findOne();
    if (admin) {
        adminEmail = admin.email;
    } else {
        throw new Error('Admin email not found');
    }
    } catch (error) {
        console.error('Error fetching admin email:', error);
        return;
    }
    const transporter = nodemailer.createTransport({
        service: "gmail",
        // service: "outlook",
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD,
        },
    });
   const bookingUrl=  `${process.env.FRONTEND_URL}`;
  const mailOptions = {
        from: {
            name: "CSG Team",
            address: process.env.EMAIL,
        },
        to: adminEmail, 
        subject: "New Slot Booking Request",
        text: `Dear Admin,\n\n${candidateName} has booked a slot. Please review the details below:\n\nEmail: ${candidateEmail}\nDate: ${date}\nTime: ${time}\nDistrict: ${district}\n\nClick here to view the booking: ${bookingUrl}\n\nThank you,\nCSG Team`,
        html: `
            <p>Dear Admin,</p>
            <p>${candidateName} has booked a slot. Please review the details below:</p>
            <ul>
                <li>Email: ${candidateEmail}</li>
                <li>Date: ${date}</li>
                <li>Time: ${time}</li>
                <li>District: ${district}</li>
            </ul>
            <p><a href="${bookingUrl}">Click here to view the booking details</a></p>
            <p>Thank you,<br>CSG Team</p>
        `,
    };

   await transporter.sendMail(mailOptions);

    console.log(`Slot booking email sent to admin at ${adminEmail}`);
}


module.exports = { sendSlotBookingEmail };
