const { DeptAdmin, CenterAdmin } = require("../Modules/adminModule");
const Candidate = require('../Modules/candidateModule');
const KGIDCandidate = require('../Modules/kgidcandidateModule');
const UserAnswer = require('../Modules/candidateresponseModule');
let secretKey = process.env.JWT_TOKEN;
secretKey = "adhya"
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

const deptAdminController = {}
const centerAdminController = {}

deptAdminController.registerDeptAdmin = async (req, res) => {
  try {
    const findEmail = await DeptAdmin.findOne({ email:req.body.email });
    if (findEmail) {
      console.log("This email is already exist");
      return res.status(400).json({ error: "email already exits" });
    }
    else{
      const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
      if (!req.body.password || !req.body.email ) {
        return res.status(401).send("Email,Password fields cannot be empty");
      }
      if (!passwordRegex.test(req.body.password)) {
        console.log("Password should be at least 6 characters long and should contain at least one number, one lowercase, and one uppercase letter");
        return res.status(402).send("Password should be at least 6 characters long and should contain at least one number, one lowercase, and one uppercase letter");
      }
      const salt = await bcrypt.genSalt(10);
      const hashPass = await bcrypt.hash(req.body.password, salt);

      const admin = {
        email: req.body.email,
        password: hashPass
      };
      const newAdmin = new DeptAdmin(admin);
      await newAdmin.save();
      res.send("Admin registered successfully");
    }
   
  } catch (error) {
    console.error("Error registering admin:", error);
    res.status(500).send("Error in registering admin: " + error.message);
  }
}

deptAdminController.loginDeptAdmin = async (req, res) => {
  try {
    const admin = await DeptAdmin.findOne({ email: req.body.email });
    if (!admin) {
      return res.status(400).json({ error: "email does not exits" });
    }
    const decryptPassword = await bcrypt.compare(req.body.password, admin.password);
    if (!decryptPassword) {
      return res.status(400).json({ error: "password does not exits" });
    }
    const idData = admin.id;
    const token = await jwt.sign({ id: idData }, secretKey);
    const success = true;
    res.status(200).json({ success, token, admin });

}
catch (err) {
    res.status(500).json({ error: 'insertion unsuccessfull' })
}
}

centerAdminController.registerCenterAdmin = async (req, res) => {
  try {
    const findEmail = await CenterAdmin.findOne({ email:req.body.email });
    if (findEmail) {
      console.log("This email is already exist");
      return res.status(400).json({ error: "email already exits" });
    }
    else{
      const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
      if (!req.body.password || !req.body.email ) {
        return res.status(401).send("Email,Password fields cannot be empty");
      }
      if (!passwordRegex.test(req.body.password)) {
        console.log("Password should be at least 6 characters long and should contain at least one number, one lowercase, and one uppercase letter");
        return res.status(402).send("Password should be at least 6 characters long and should contain at least one number, one lowercase, and one uppercase letter");
      }
      const salt = await bcrypt.genSalt(10);
      const hashPass = await bcrypt.hash(req.body.password, salt);

      const admin = {
        email: req.body.email,
        password: hashPass
      };
      const newAdmin = new CenterAdmin(admin);
      await newAdmin.save();
      res.send("Admin registered successfully");
    }
   
  } catch (error) {
    console.error("Error registering admin:", error);
    res.status(500).send("Error in registering admin: " + error.message);
  }
}

centerAdminController.loginCenterAdmin = async (req, res) => {
  try {
    const admin = await CenterAdmin.findOne({ email: req.body.email });
    if (!admin) {
      return res.status(400).json({ error: "email does not exits" });
    }
    const decryptPassword = await bcrypt.compare(req.body.password, admin.password);
    if (!decryptPassword) {
      return res.status(400).json({ error: "password does not exits" });
    }
    const idData = admin.id;
    const token = await jwt.sign({ id: idData }, secretKey);
    const success = true;
    res.status(200).json({ success, token, admin });

}
catch (err) {
    res.status(500).json({ error: 'insertion unsuccessfull' })
}
}
centerAdminController.adminApproval = async (req,res) => {
  const { email, action } = req.body;
  try {


    const candidate=await Candidate.findOne({email});
    if(candidate){
      if(action !== 'approve' && action !== 'reject'){
        return res.status(400).json({ error: 'Invalid action value' });
      }
      candidate.adminApproval = action;
      await candidate.save();
      return res.status(200).json({ message: 'Approval updated successfully in Candidate' });
    }else{
      const candidate=await KGIDCandidate.findOne({email});
      if(candidate){
        if(action !== 'approve' && action !== 'reject'){
          return res.status(400).json({ error: 'Invalid action value' });
        }
        candidate.adminApproval = action;
        await candidate.save();
        return res.status(200).json({ message: 'Approval updated successfully in KGIDCandidate' });
      }else{
        return res.status(400).json({ message: 'Candidate not found in either schema' });
      }
    }
   
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
}


centerAdminController.candidateAttendence = async (req, res) => {
  const { email, attendence } = req.body;
  console.log(`Received request with email: ${email}, attendence: ${attendence}`);

  try {
    let candidate = await Candidate.findOne({ email });

    if (candidate) {
      if (attendence !== 'present' && attendence !== 'absent') {
        return res.status(400).json({ error: 'Invalid attendance value' });
      }

      candidate.attendence = attendence;
      await candidate.save();

      return res.status(200).json({ message: 'Attendance updated successfully in Candidate' });
      
    } else {
      candidate = await KGIDCandidate.findOne({ email });

      if (candidate) {
        if (attendence !== 'present' && attendence !== 'absent') {
          return res.status(400).json({ error: 'Invalid attendance value' });
        }

        candidate.attendence = attendence;
        await candidate.save();

        return res.status(200).json({ message: 'Attendance updated successfully in KGIDCandidate' });
      } else {
        return res.status(400).json({ error: 'Candidate not found in either schema' });
      }
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
};
deptAdminController.viewResultApproval = async (req, res) => {
  const { email, displayResult } = req.body;

  try {
    let candidate = await UserAnswer.findOne({ email });

    if (candidate) {
      if (displayResult !== 'display' && displayResult !== 'withheld') {
        return res.status(400).json({ error: 'Invalid attendance value' });
      }

      candidate.displayResult = displayResult;
      await candidate.save();

      return res.status(200).json({ message: 'View result updated successfully in Candidate' });
    } else {
        return res.status(400).json({ message: 'Candidate not found' });
      
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
};

module.exports = { deptAdminController, centerAdminController };