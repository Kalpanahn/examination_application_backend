// const adminController = require("../Controllers/admincontrollers.js");
const { deptAdminController, centerAdminController }= require("../Controllers/admincontrollers.js");

const express = require("express");
const router = express.Router();

router.post("/deptadminregister",deptAdminController.registerDeptAdmin)
router.post("/deptadminlogin",deptAdminController.loginDeptAdmin)
router.post("/centeradminregister",centerAdminController.registerCenterAdmin)
router.post("/centeradminlogin",centerAdminController.loginCenterAdmin)
router.post("/candidateattendence",centerAdminController.candidateAttendence)
router.post("/adminapproval",centerAdminController.adminApproval)
router.post("/viewresultapproval",deptAdminController.viewResultApproval)
router.get("/getApprovalCount",deptAdminController.approvedCount)
router.get("/getRejectedCount",deptAdminController.rejetcedCount)
router.get("/getpendingCount",deptAdminController.pendingCount)

module.exports = router;

