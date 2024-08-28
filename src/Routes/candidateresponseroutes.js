const candidateResponseController = require('../Controllers/candidateresponsecontroller');
const express = require('express');
const router = express.Router();

router.post('/getCandidateResponse', candidateResponseController.getCandidateResponse);
router.get('/getAllUserAnswer', candidateResponseController.getAllUserAnswer);
router.post('/getAnswerByEmail', candidateResponseController.getAnswerByEmail);

module.exports = router;