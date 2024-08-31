const express = require("express");
const { upload, candidateController } = require("../Controllers/candidatescontrollers.js");
const router = express.Router();

const cpUpload = upload.fields([
    { name: 'profilepic', maxCount: 1 },
    { name: 'signaturepic', maxCount: 1 },
    { name: 'resume', maxCount: 1 }
  ]);
  
router.post("/registerCandidate", candidateController.registerCandidate);
router.post("/loginCandidate", candidateController.loginCandidate);
router.put('/update-candidate', cpUpload, candidateController.updateCandidate);
router.post("/sendOTP", candidateController.sendOTP);
router.get("/getCandidates",candidateController.candidateView);// get candidate deatils who have booked slots
router.post("/getSingleCandidate",candidateController.singleView); 
router.get('/downloadPdf',candidateController.downloadPDF)

module.exports = router;