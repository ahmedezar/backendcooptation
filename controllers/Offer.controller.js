const Offer = require("../models/Offer.model");
const jwt = require("jsonwebtoken");
const config = require("../config.json");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
var ObjectId = require('mongoose').Types.ObjectId;
/*
todo ::: Update Offer
todo ::: Show ONly the offer that are Open
*/
////* Get All The Created Offers *////
/*
todo add get only the active pen offer
*/
exports.getAllOffers = async (req, res) => {
    const offers = await Offer.find({});
    //.populate("Cv");
    //.populate("chats likes");
    if (offers) {
         /*
            todo remove the updods from the image name
              let txt = product.image;
        console.log(`txtttttt  ${txt}`);
        let nextTXT = txt.replace("uploads", "");  
        product.image = nextTXT; 
            */
        console.log("Lenghttt");
        console.log( offers.length);
        let arrayLength = offers.length;
        for (var i = 0; i < arrayLength; i++) {
            let txt = offers[i].image;
            console.log(offers[i].startDate);
            if(txt.includes("uploads")){
                let nextTXT = txt.replace("uploads", "");
                offers[i].image = nextTXT;
                //Do something
            }
        }
        res.status(200).send(offers);
    } else {
        res.status(403).send({ message: "fail" });
    }
};
/* 
todo this is required
? This is A blue comment
! The Red One
* The gree One
& Pink Comments
^ This IS Yellow 
*/
////* Create New Offer , Allowed Only to the admin *////
exports.addOffer = async (req, res) => {
      // starDate duration status
    const { title, description, modedemploi, companyDescription, responsabilities, requiredSkills, expYears, status, startDate, duration } = req.body;
    console.log("Thoiiiiiiiiiiiiiiiiiiiiiiiii")
    console.log(req.body.startDate)
    console.log("Thoiiiiiiiiiiiiiiiiiiiiiiiii")
    const verifOffer = await Offer.findOne({ title });
    if (verifOffer) {      
        res.status(403).send({ error: "Une offre avec le même titre existe déjà ! Veuillez utiliser un autre titre ." });
    } else {
        console.log("Success")
        const newOffer = new Offer();
        newOffer.title = title;
        newOffer.description = description;
        newOffer.modedemploi = modedemploi;
        newOffer.companyDescription = companyDescription;
        newOffer.responsabilities = responsabilities;
        newOffer.requiredSkills = requiredSkills;
        newOffer.expYears = expYears;
        // added   
        newOffer.status = status;
        
        const date =   new Date(startDate)
        newOffer.startDate = date.toLocaleDateString("fr-FR");
        console.log("addddddddddddddddddddddd start dtae");
        console.log(date.toLocaleDateString("fr-FR"));
        console.log("addddddddddddddddddddddd start dtae");
        newOffer.duration = duration; 
          // starDate duration status
        if (req.file) {
            console.log(req.file.path);
            let txt = req.file.path;
            let nextTXT = txt.replace("uploads", "");
            let last = nextTXT.replace("images", "");
            newOffer.image = last;
        } else{
            newOffer.image = "";
        }
        newOffer.save();
        /*
        Todo Notify all The users that there new Offer Published
        */
        res.status(201).send( newOffer);
    }
}
/*
 & Get Offer By Id
*/
exports.getOfferById = async (req , res) =>{
    /*
    todo  check if the id is OK
    */
    if(ObjectId.isValid( req.params._id)){
        var  offer = await Offer.findById(req.params._id)
    }
        if (offer) {
           return  res.status(201).send(offer);
        }
        return res.status(403).send({error: "Une erreur s'est produite"});
}
/*
& Delete One Offer By ID
*/ 
exports.deleteOne = async (req, res) => {
    console.log(req.body)
    const offer = await Offer.findById(req.body._id).remove()
    console.log("PPPPPPPPPPPPPPPPPP");
    console.log(req.body._id);
    console.log(offer.deletedCount);
    console.log("PPPPPPPPPPPPPPPPPP");
if (offer.deletedCount===0) {
    return  res.status(403).send("error");
} else {
    res.status(201).send("success" );
}
}
/*
& Delete All the offers
*/ 
exports.deleteAll = async (req, res) => {
    Offer.remove({}, function (err, user) {
        if (err) { return handleError(res, err); }
        return res.status(201).send({ message: "Toutes les offres ont été supprimées avec succès" });
    })
}
