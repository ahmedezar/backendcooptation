const express = require("express");
const router = express.Router();
const RecommandationController = require("../controllers/Recommandation.controller");
const multer = require("multer");
const path = require("path");


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads/cvs");
    },
    filename: (req, file, cb) => {
        const newFileName = (+new Date()).toString() + path.extname(file.originalname);
        cb(null, newFileName);
    }
})

const upload = multer({ storage });
 


router.get("/", RecommandationController.getAllRec);
router.post("/createRec",upload.single("cv"), RecommandationController.createRec);
 
 
/*
router.delete("/deleteOne", RecommandationController.deleteOne);

router.delete("/deleteAll", RecommandationController.deleteAll)
*/

module.exports = router;
