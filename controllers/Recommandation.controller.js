const Recommandation = require("../models/Recommandation.model");
const User = require("../models/User.model");
const Offer = require("../models/Offer.model");
const jwt = require("jsonwebtoken");
var ObjectId = require('mongoose').Types.ObjectId;
const mongoose = require("mongoose");
const config = require("../config.json");

const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");



/* 

todo ::: Get All Recommandation
todo :::  Get Recommandation By Offer

ToDo ::: Create New Recommandation For An Offer
ToDo :::  Create New Recommandation For No Specefic Offer

*/

/* 
& Get All The  Recommandation 
*/


exports.createRec = async (req, res) => {
    const { userEmail, invitedEmail, invitedName, invitedLastName, linkedInUrl, message, cv, offer_Id } = req.body;

   
    /*
    ^ isEmailRecForThisOffer test of the provided email is already invited for this offer , 
    ^if Yes your can can not Recommand it
    */
// already rec for this offer
// your email is not valid 

// 

    
    const verifUser = await User.find({ email: userEmail });
    // invited User DONE !
    if (verifUser.length == 0) {
        console.log("Your are not allowed To make Recommandations");
        return res.status(201).send({ message: "error", message: "Yo are Not Allowed To Recommande Users", });
    } else {   
    if (offer_Id) {
        if(ObjectId.isValid(offer_Id)){
            var id = mongoose.Types.ObjectId(offer_Id);
            const isOfferExists = await Offer.find({ _id: id });
         // find by id and then filter if he is already invited 
            const isEmailRecForThisOffer =  false; 
          /*
          todo coorect this
         await Offer.find({ invitedEmail: invitedEmail });
           */ 
          if(isOfferExists.length>0) {
            /*
            ^offer exits
            */
            if (!isEmailRecForThisOffer && verifUser.length > 0) {
                //// ***  Create Your Recommandation****///
                // $$NotAlreadyInvitrf
                // do your code here
                // create random code
                const rec = new Recommandation({ invitedEmail: invitedEmail, invitedName: invitedName, invitedLastName: invitedLastName, linkedInUrl: linkedInUrl, message: message, cv: cv, offer_Id: id });
                let offer = await Offer.findOneAndUpdate(
                    { _id: offer_Id },
                    { $push: { recommandations: rec._id } },
                );
                rec.save();
                return res.status(201).send(rec);
            }
            if (isEmailRecForThisOffer ) {
                console.log("User Already Recomannded For This offer");
                return res.status(201).send({ message: "error", message: "The user Is Already Recommanded For This Offer ", });
            }
          } else {
            console.log("OfferNot Found");
            return res.status(403).send({ message: "error", message: "Offer Not Found", });
          }
            
           

        } else {
            console.log("Offer Id IS Not Valide");
            return res.status(201).send({ message: "error", message: "The Offer Id Is Not Valide ", });
        }
       
    } else {
        
        if ( verifUser.length > 0) {
            //// ***  Create Your Recommandation Without An Offer ****///
            // $$NotAlreadyInvitrf
            // do your code here
            // create random code
            const rec = new Recommandation({ invitedEmail: invitedEmail, invitedName: invitedName, invitedLastName: invitedLastName, linkedInUrl: linkedInUrl, message: message, cv:cv })
            rec.save();
            return res.status(201).send(rec);
        }

    }
    }
    console.log("Else Is Reached")
    return res.status(403).send({ message: "Somme Error has occuredS" });

}


exports.getAllRec = async (req, res) => {
    const recs = await Recommandation.find({});
    if (recs) {
        res.status(200).send(recs);
    } else {
        res.status(403).send({ message: "Could Not Load Recommandation" });
    }
};
