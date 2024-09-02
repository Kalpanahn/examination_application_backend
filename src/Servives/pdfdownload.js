// const PDFDocument = require('pdfkit');
// const bookingSchema=require('../Modules/slotbookingModule')

// const generatePDF = async(res, user) => {
//   const doc = new PDFDocument({ margin: 50 });

 
//   res.setHeader('Content-Type', 'application/pdf');
//   res.setHeader('Content-Disposition', `attachment; filename=hall-ticket-${user._id}.pdf`);
 
  

//   const examDetails = await bookingSchema.findOne( {email:user.email});
  
  


//   doc.fontSize(24).text('Hall Ticket', { align: 'center' }).moveDown(1);
//   doc.fontSize(16).text(`Candidate Name: ${user.name}`, { align: 'right' }).moveDown(0.5);

 
//   doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke().moveDown(1.5);

//   let profilePicHeight = 0; // Default value for profilePicHeight

//   // Add profile picture to the right side, if available
//   if (user.profilepic) {
//     try {
//       const profilePicPosition = doc.y;
//       doc.image(user.profilepic, doc.page.width - 200, profilePicPosition, {
//         fit: [150, 150],
//         align: 'right',
//         valign: 'top'
//       });
//       profilePicHeight = 150;
//     } catch (error) {
//       console.error('Error adding profile picture:', error);
//     }
//   }

//   // Add signature image below the profile picture if available
//   if (user.signaturepic) {
//     try {
//       const signaturePosition = doc.y + profilePicHeight + 10;
//       doc.image(user.signaturepic, doc.page.width - 200, signaturePosition, {
//         fit: [100, 50],
//         align: 'right',
//         valign: 'top'
//       }).moveDown();
//     } catch (error) {
//       console.error('Error adding signature image:', error);
//     }
//   }
//     doc.fontSize(18).text('User Information', { underline: true }).moveDown(0.5);

//     const userInfo = [
//       { label: 'Email', value: user.email },
//       { label: 'Phone', value: user.phone },
//       { label: 'Date of Birth', value: new Date(user.dob).toLocaleDateString() },
//       { label: 'Address', value: user.address },
//       { label: 'Role', value: user.role },
//       { label: 'Current Company', value: user.currentCompany },
//       { label: 'Experience', value: `${user.experience} years` },
//       { label: 'Gender', value: user.gender },
//     ];
  
//     userInfo.forEach(info => {
//       doc.text(`${info.label}: ${info.value}`).moveDown(0.5);
//     });
  
   
//     doc.fontSize(18).text('Exam Details', { underline: true }).moveDown(0.5);
  
//     const examInfo = [
//       { label: 'Exam Center', value: examDetails.district},
//       { label: 'Exam Date', value: new Date(examDetails.date).toLocaleDateString() },
//       { label: 'Exam Time', value: examDetails.time },
//     ];
  
//     examInfo.forEach(info => {
//       doc.text(`${info.label}: ${info.value}`).moveDown(0.5);
//     });
 


//   doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke().moveDown(1);

 
//   doc.fontSize(12).text('This is an electronically generated hall ticket.', { align: 'center' });
//   doc.text('Please carry a printed copy along with a valid ID proof to the examination center.', { align: 'center' });

//   // Finalize the PDF and send it as the response
//   doc.pipe(res);
//   doc.end();
// };

// module.exports = generatePDF;
const PDFDocument = require('pdfkit');
const bookingSchema = require('../Modules/slotbookingModule');

const generatePDF = async (res, user) => {
    const doc = new PDFDocument({ margin: 50 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=exam-result-${user._id}.pdf`);

    const examDetails = await bookingSchema.findOne({ email: user.email });

    // Header Section
    doc.image('C:\\Users\\USER\\Pictures\\Screenshots\\Screenshot 2024-09-02 144115.png', 50, 45, { width: 50 }) // Replace with actual path to logo
       .image('C:\\Users\\USER\\Pictures\\Screenshots\\Screenshot 2024-09-02 144115.png',  doc.page.width - 100, 45, { width: 50 }) // Replace with actual path to logo
       .moveDown(2);
    
    doc.fontSize(20).text('COMPUTER LITERACY TEST', { align: 'center' }).moveDown(0.5);
    doc.fontSize(16).text('For Karnataka Government Employees', { align: 'center' }).moveDown(2);

    doc.fontSize(18).text('Candidate Exam Result', { align: 'center', underline: true }).moveDown(2);

    // Candidate Information
    doc.fontSize(14);
    doc.text(`KGID/Employee No.   : ${user.kgid}`, { align: 'left' }).moveDown(0.5);
    doc.text(`Name                : ${user.name}`, { align: 'left' }).moveDown(0.5);
    doc.text(`Examination         : COMPUTER LITERACY TEST`, { align: 'left' }).moveDown(0.5);
    doc.text(`Subject Name        : COMPUTER LITERACY TEST`, { align: 'left' }).moveDown(0.5);
    doc.text(`Examination Centre  : ${examDetails.district}`, { align: 'left' }).moveDown(0.5);
    doc.text(`Examination Date    : ${new Date(examDetails.date).toLocaleDateString()}`, { align: 'left' }).moveDown(0.5);
    doc.text(`Examination Time    : ${examDetails.time}`, { align: 'left' }).moveDown(0.5);
    doc.text(`Score               : ${examDetails.score}`, { align: 'left' }).moveDown(2);

    // Footer Section
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke().moveDown(1);

    doc.fontSize(12).text('This is an electronically generated exam result.', { align: 'center' });
    doc.text('Please keep a printed copy for your records.', { align: 'center' });

    // Finalize the PDF and send it as the response
    doc.pipe(res);
    doc.end();
};

module.exports = generatePDF;
