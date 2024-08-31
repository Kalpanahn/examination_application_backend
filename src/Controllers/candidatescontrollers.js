const Candidate = require("../Modules/candidateModule");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const multer = require('multer')
require('dotenv').config();
const secretKey = process.env.JWT_TOKEN;
const path = require('path');
const { sendOTP } = require("../Servives/candidateservice.js");
const candidateController = {};
const fs = require('fs');
const e = require("express");
const KGIDCandidate=require('../Modules/kgidcandidateModule');
const NonKGIDCandidate=require('../Modules/candidateModule');
const generatePDF = require('../Servives/pdfdownload');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const userFolder = path.join(__dirname, '../Non KGID Candidate document/', req.body.email);
    fs.mkdirSync(userFolder, { recursive: true });
    cb(null, userFolder);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

candidateController.registerCandidate = async (req, res) => {
  try {
    console.log("try block")
    const { name, email, phone, dob, password } = req.body;
    console.log(req.body)
    const findEmail = await Candidate.findOne({ email });
    if (findEmail) {
      console.log("This email is already exist");
      return res.status(400).json({ error: "email already exits" });
    }
    else {
      console.log("new user")
      const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
      if (!name || !password || !email || !phone || !dob) {
        return res.status(401).send("Name,Email,Phone and Dob fields cannot be empty");
      }
      if (!passwordRegex.test(password)) {
        console.log("Password should be at least 6 characters long and should contain at least one number, one lowercase, and one uppercase letter");
        return res.status(402).send("Password should be at least 6 characters long and should contain at least one number, one lowercase, and one uppercase letter");
      }
      const salt = await bcrypt.genSalt(10);
      const hashPass = await bcrypt.hash(password, salt);

      const newCandidate = new Candidate({ name: name, email: email, phone: phone, dob: dob, password: hashPass });
      console.log(newCandidate);
      await newCandidate.save();
      return res.status(200).json({ success: "Successfully added candidate" });
    }

  } catch (error) {
    console.error("Error adding candidate:", error);
    res.status(500).send("Error adding candidate: " + error.message);
  }
};

candidateController.sendOTP = async (req, res) => {
  try {
    const message = "Please enter the following OTP to verify your email: ";
    const otp = await sendOTP(req.body.email, message);
    res.status(200).json({ message: "Mail has been sent", otp: otp, });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).send("Error sending OTP: " + error.message);
  }
};

candidateController.updateCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findOne({ email: req.body.email });
    if (candidate) {
      const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

      if (!req.body.password || !req.body.confirmPassword) {
        console.log(req.body.password, req.body.confirmPassword);
        return res.status(400).send("Password fields cannot be empty");
      }
      console.log(req.body.password, req.body.confirmPassword);
      if (req.body.password !== req.body.confirmPassword) {
        return res.status(400).send("Passwords do not match");
      }
      if (passwordRegex.test(req.body.password)) {
        const salt = await bcrypt.genSalt(10);
        const hashPass = await bcrypt.hash(req.body.password, salt);
        candidate.phone = req.body.phone;
        candidate.dob = req.body.dob;
        candidate.name = req.body.name;
        candidate.email = req.body.email;
        candidate.password = hashPass;
        candidate.address = req.body.address;
        candidate.role = req.body.role;
        candidate.currentCompany = req.body.currentCompany;
        candidate.experience = req.body.experience;
        candidate.gender = req.body.gender;
        candidate.department = req.body.department

        // Save file paths if files were uploaded
        if (req.files['profilepic']) {
          candidate.profilepic = req.files['profilepic'][0].path;
        }
        if (req.files['signaturepic']) {
          candidate.signaturepic = req.files['signaturepic'][0].path;
        }
        if (req.files['resume']) {
          candidate.resume = req.files['resume'][0].path;
        }
        await candidate.save();
        res.send("Candidate updated successfully");
      } else {
        res.status(400).send("Password should be at least 6 characters long and should contain at least one number, one lowercase, and one uppercase letter");
      }
    } else {
      res.status(404).send("Candidate not found");
    }
  } catch (error) {
    console.error("Error updating candidate:", error);
    res.status(500).send("Error updating candidate: " + error.message);
  }
}


candidateController.loginCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findOne({ email: req.body.email });
    if (!candidate) {
      return res.status(400).json({ error: "email does not exits" });
    }
    const decryptPassword = await bcrypt.compare(req.body.password, candidate.password);
    if (!decryptPassword) {
      return res.status(400).json({ error: "password does not exits" });
    }
    const idData = candidate.id;
    console.log(secretKey, "secretKey")
    const token = await jwt.sign({ id: idData }, secretKey);
    const success = true;
    res.status(200).json({ success, token, candidate });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
candidateController.candidateView = async (req, res) => {

  try {
    const data = await Candidate.find({ booking_id: { $ne: null } }).populate('booking_id');
    console.log('Populated data:', data);
    res.json(data);


  } catch (err) {
    console.log("error while fetching candidate details", err);
    res.status(500).json({ error: 'error while fetching candidate details' })
  }
}
candidateController.singleView = async (req, res) => {

  try {

    const { user_id } = req.body;
    const data = await Candidate.findById(user_id).populate('booking_id');

    res.json(data);
  } catch (err) {
    console.log("error while fetching candidate details", err);
    res.status(500).json({ error: 'error while fetching candidate details' })
  }
}

candidateController.downloadPDF = async (req, res) => {
  try {
    const { id } = req.body;
    let user = await KGIDCandidate.findById(id);
    if (!user) {
      user = await NonKGIDCandidate.findById(id);
    }
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    generatePDF(res, user);
  } catch (err) {
    console.error('Error in downloadPDF:', err); 
    return res.status(500).json({ error: 'Internal server error' });
  }
};




module.exports = { upload, candidateController };
