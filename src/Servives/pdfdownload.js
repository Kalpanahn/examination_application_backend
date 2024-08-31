const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');


const generatePDF = (res, user) => {
  const doc = new PDFDocument();
  
  
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=user-${user._id}.pdf`);

  
  doc.fontSize(16).text(`Name: ${user.name}`);
  doc.text(`Email: ${user.email}`);
  doc.text(`Phone: ${user.phone}`);
  doc.text(`Date of Birth: ${user.dob}`);
  doc.text(`Address: ${user.address}`);
  doc.text(`Role: ${user.role}`);
  doc.text(`Current Company: ${user.currentCompany}`);
  doc.text(`Experience: ${user.experience}`);
  doc.text(`Gender: ${user.gender}`);
  
  
  if (user.profilepic) {
    try {
      doc.image(user.profilepic, {
        fit: [150, 150], // Size of the image
        align: 'center',
        valign: 'center'
      });
      doc.moveDown();
    } catch (error) {
      console.error('Error adding profile picture:', error);
    }
  }

  // Add Signature Picture if available
  if (user.signaturepic) {
    try {
      doc.image(user.signaturepic, {
        fit: [100, 50], // Size of the signature image
        align: 'left',
        valign: 'bottom'
      });
      doc.moveDown();
    } catch (error) {
      console.error('Error adding signature image:', error);
    }
  }

  // Finalize the PDF and send it as the response
  doc.pipe(res);
  doc.end();
};

module.exports = generatePDF;