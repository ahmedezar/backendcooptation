const express = require("express");
const router = express.Router();
const InvitController = require("../controllers/Invitation.controller.js");

const path = require("path");

////* Get All Invitaions *////
router.get("/", InvitController.getAllInvitations);
////* Get All Active Invitations *////
router.get("/getActive", InvitController.getActiveInvitations)
////* Invite New User To join the Site *////
router.post("/invitNew", InvitController.invite);
////* Verify If  this invitation code blongs to thi provided invitedUserEmail *////
router.post("/checkInvitation", InvitController.verifyInvit);
 


module.exports = router;
