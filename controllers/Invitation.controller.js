const User = require("../models/User.model");
const Invit = require("../models/Invitation.model");
const jwt = require("jsonwebtoken");
const config = require("../config.json");

const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

////* Verify if the provided email is already invited *////
exports.verifyEmailIsInvited = async function (email) {

    const exist = await Invit.find({ invitedEmail: email });

    console.log("***************************************");
    console.log(email);
    console.log(exist.length);
    console.log("***************************************");
    if (exist.length > 0) {
        return true;
    }
    return false;
}

async function verifyEmailInvited(email) {


    const exist = await Invit.find({ invitedEmail: email });

    console.log("***************************************");
    console.log(email);
    console.log(exist);
    console.log("***************************************");
    if (exist.length > 0) {
        return true;
    }
    return false;
}

////*  Get All Invitations *///
exports.getAllInvitations = async (req, res) => {
    const invits = await Invit.find({});
    //.populate("Cv");
    //.populate("chats likes");

    console.log("ALLL  INNVVVIITT");

    console.log(invits);

    console.log("ALLL  INNVVVIITT");

    if (invits) {
        res.status(200).send(invits);
    } else {
        res.status(403).send({ message: "Could Not Load Invitations" });
    }
};

////* Get Only Active Invitations *////
exports.getActiveInvitations = async (req, res) => {
    const invits = await Invit.find({ isActive: true });
    //.populate("Cv");
    //.populate("chats likes");

    if (invits) {
        res.status(200).send(invits);
    } else {
        res.status(403).send({ message: "Could Not Load Invitations" });
    }
};

////* Create New Invitation: Inviate A User By Email *////
exports.invite = async (req, res) => {
    console.log("Invitiiiinnng...........");
    const { invitedEmail, userEmail } = req.body;
    console.log(req.body.userEmail);

    const isEmailInvited = await Invit.find({ invitedEmail: invitedEmail });
    const verifUser = await User.find({ email: userEmail });
    //  verif invited is already exist
    const verifInvitedUserExist = await User.find({  'email': invitedEmail });
    
    console.log("Is Email Invited");
    console.log(isEmailInvited.length);
    console.log("Is User Allowed");
     console.log(verifUser.length);
     console.log("Is The invited User Already Exist");
    console.log(verifInvitedUserExist.length);

    // invited User DONE !

    if (verifInvitedUserExist.length==0 && verifUser.length>0 && isEmailInvited.length==0) { // $$NotAlreadyInvitrf
        // do your code here
        // create random code 
        var crypto = require('crypto');

        var hash = crypto.createHash('md5').update(invitedEmail).digest('hex');
        console.log(hash);
        // cretae Invitation and save It
        // create invitation 
        //  const invit = createInvitation({ invitedEmail: invitedEmail, userEmail: userEmail, code: hash, isActive: true });

        const invit = new Invit({ invitedEmail: invitedEmail, userEmail: userEmail, isActive: true, code: hash })
        invit.save();
        // send Invitation 
        sendInvitCode(invitedEmail, userEmail, hash);
        return res.status(201).send({ message: "success", invitation: invit, });

    }
    if (verifUser.length == 0) {
        console.log("Your are not allowed To make Invitaion");
        return res.status(201).send({ message: "error", message: "Yo are Not Allowed To Invit Users", });
    }
    if (isEmailInvited.length > 0) {
        console.log("User Already Invited");
        return res.status(201).send({ message: "error", message: "The user Is Already Invited", });

        // 
    }

    if (verifUser.length < 0 && isEmailInvited.length > 0) {
        console.log("User Already Invited and your are not allowed to invite");
        return res.status(201).send({ message: "error", message: "User Already Invited and your are not allowed to invite", });
    }
    console.log("Else Is Reached")
    return res.status(403).send({ message: "Somme Error has occuredS" });

}

////*  Create New Invitation :: To be  USed In INvite Function *///
/*
async function createInvitation(params) {
    const { invitedEmail, userEmail, code, isActive } = params;

    const invit = new Invit({ invitedEmail: invitedEmail, userEmail: userEmail, isActive: isActive, code: code })
    invit.save(); // if the add was succeful
    if(invit) {
        return invit;
    }
   return null;
}
*/
////* Verify Invitation *////
exports.verifyInvit = async (req, res) => {
    const { invitedEmail, code } = req.body;
    console.log(req.body);
    console.log(req.body.code);
    const verifInvit = await Invit.findOne({ code });
    console.log(verifInvit);

    if (verifInvit) {
        if (verifInvit.invitedEmail == invitedEmail) {
            ////* true ***/
            return res.status(200).send({ message: "ok" });
        }

        return res.status(201).send({ message: "error", message: "This INvitation doesnt Correspons to Your Email", });
    }
    console.log("Rong Invitaion Code ")
    return res.status(403).send({ message: "Rong  Invitation Code !" });
}

////* Send  Invitation Code By Email *////
async function sendInvitCode(emailTo, emailFrom, hashcode) {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'alaeddine.aouiti@esprit.tn',
            pass: '172839654172839654@Security.aouiti'
        }
    });

    transporter.verify(function (error, success) {
        if (error) {
            console.log(error);
            console.log("Server not ready");
        } else {
            console.log("Server is ready to take our messages");
        }
    });

    const mailOptions = {
        from: 'alaeddine.aouiti@esprit.tn',
        to: emailTo,
        subject: 'Cooptation Invitation',
        html: "<h2>You have Recieved An invitation To join Cooptation by  : " + emailFrom + "YYour invitation Code Is::" + hashcode + "</h2>"
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log('ooooooooooooooooooooooppppppppppppppppppppp' + error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}




