const express = require("express");
const router = express.Router();
const UserController = require("../controllers/User.controller");
const multer = require("multer");
const path = require("path");


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads");
    },
    filename: (req, file, cb) => {
        const newFileName = (+new Date()).toString() + path.extname(file.originalname);
        cb(null, newFileName);
    }
})

const upload = multer({ storage });
 


router.get("/", UserController.getAllUsers);
router.post("/signup", UserController.signup);
router.post("/login", UserController.login);
router.get("/useredit/:id", UserController.FindUserbyId);
router.post("/setimage",upload.single("image"), UserController.setImage);
 



router.post("/getUserFromToken", UserController.getUserFromToken);

// router.post("/loginWithSocialApp", UserController.loginWithSocialApp);

router.get("/confirmation/:token", UserController.confirmation);

router.post("/resendConfirmation", UserController.resendConfirmation);

router.post("/forgotPassword", UserController.forgotPassword);

router.put("/editPassword", UserController.editPassword);

router.put("/editProfile", UserController.editProfile);

router.delete("/deleteOne", UserController.deleteOne);

router.delete("/deleteAll", UserController.deleteAll)

module.exports = router;
