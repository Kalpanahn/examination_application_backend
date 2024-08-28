const  KGIDCandidate  = require("../Modules/kgidcandidateModule");

const fs = require('fs');
const path = require('path');
const KGIDCandidateController = {};
const multer = require('multer')
const jwt = require("jsonwebtoken");
require('dotenv').config();
const secretKey = process.env.JWT_TOKEN;

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const userFolder = path.join(__dirname, '../KGID Candidate documents/', req.body.email);
      fs.mkdirSync(userFolder, { recursive: true });
      cb(null, userFolder);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
  });
  
  const upload = multer({ storage: storage });

  KGIDCandidateController.getKGIDCandidate = async (req, res) => {
  try {
    const data = await KGIDCandidate.find();
    res.json(data);
  } catch (err) {
    console.log("error while fetching candidate details", err);
    res.status(500).json({ error: "error while fetching candidate details" });
  }
};
KGIDCandidateController.getSingleKGIDCandidate = async (req, res) => {
  try {
    const { KGID } = req.body;
    const data = await KGIDCandidate.findOne({ KGID });
    res.status(200).json(data);
  } catch (err) {
    console.log("error while fetching candidate details", err);
    res.status(500).json({ error: "error while fetching candidate details" });
  }
};


KGIDCandidateController.loginKGIDCandidate = async (req, res) => {
  try {
    // Log the incoming request body for debugging
    console.log('Request body:', req.body);

    // Find the candidate by KGID
    const candidate = await KGIDCandidate.findOne({ KGID: req.body.KGID });

    // Log the candidate object retrieved from the database
    console.log('Candidate:', candidate);

    if (!candidate) {
      return res.status(400).json({ error: "KGID does not exist" });
    }

    // Check if phone numbers match, ensuring case sensitivity and correct property name
    if (candidate.phone !== req.body.phone) {
      return res.status(400).json({ error: "Phone does not match the KGID" });
    }

    // Generate a token
    const idData = candidate.id;
    const token = await jwt.sign({ id: idData }, secretKey);

    // Send success response
    const success = true;
    res.status(200).json({ success, token, candidate });

  } catch (err) {
    // Log the error details
    console.error("Error in login:", err);
    res.status(500).json({ error: "Login unsuccessful", message: err.message });
  }
};

KGIDCandidateController.updateKGIDCandidate = async (req, res) => {
  try {
    const candidate = await KGIDCandidate.findOne({ KGID: req.body.KGID });
    if (!candidate) {
      return res.status(400).json({ error: "KGID does not exits" });
    } else {
      candidate.phone = req.body.phone;
      candidate.email = req.body.email;
      candidate.name = req.body.name;
      candidate.address = req.body.address;
      candidate.role = req.body.role;
      candidate.currentCompany = req.body.currentCompany;
      candidate.experience = req.body.experience;
      candidate.gender = req.body.gender;
      candidate.dob = req.body.dob;
      candidate.doj = req.body.doj;
      candidate.district = req.body.district;
      candidate.department = req.body.department;

      if (req.files["profilepic"]) {
        candidate.profilepic = req.files["profilepic"][0].path;
      }
      if (req.files["signaturepic"]) {
        candidate.signaturepic = req.files["signaturepic"][0].path;
      }
      if (req.files["resume"]) {
        candidate.resume = req.files["resume"][0].path;
      }
      await candidate.save();
      res.send("Candidate updated successfully");
    }
  } catch (err) {
    res.status(500).json({ error: "insertion unsuccessfull" });
  }
};
KGIDCandidateController.candidateBookedView = async (req, res) => {
  try {
    const data = await KGIDCandidate.find({ booking_id: { $ne: null } }).populate('booking_id')
    console.log("Populated data:", data);
    res.json(data);
  } catch (err) {
    console.log("error while fetching candidate details", err);
    res.status(500).json({ error: "error while fetching candidate details" });
  }
};


KGIDCandidateController.singleView = async (req, res) => {
  try {
    const { user_id } = req.body;
    const data = await KGIDCandidate.findById(user_id).populate("booking_id");

    res.json(data);
  } catch (err) {
    console.log("error while fetching candidate details", err);
    res.status(500).json({ error: "error while fetching candidate details" });
  }
};



KGIDCandidateController.singleCandidateView = async (req, res) => {
  try {
    const { KGID } = req.body;
    const data = await KGIDCandidate.findOne({KGID}).populate("booking_id");

    res.json(data);
  } catch (err) {
    console.log("error while fetching candidate details", err);
    res.status(500).json({ error: "error while fetching candidate details" });
  }
};


module.exports = { upload, KGIDCandidateController};
