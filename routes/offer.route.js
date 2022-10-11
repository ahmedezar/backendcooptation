const express = require("express");
const router = express.Router();
const OfferController = require("../controllers/Offer.controller");
const multer = require("multer");
const path = require("path");


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads/images");
    },
    filename: (req, file, cb) => {
        const newFileName = (+new Date()).toString() + path.extname(file.originalname);
        cb(null, newFileName);
    }
})

const upload = multer({ storage });
 


router.get("/", OfferController.getAllOffers);
router.get("/:_id", OfferController.getOfferById);
router.post("/addOffer", upload.single("image"), OfferController.addOffer);
 


router.delete("/deleteOne", OfferController.deleteOne);

router.delete("/deleteAll", OfferController.deleteAll);

module.exports = router;
