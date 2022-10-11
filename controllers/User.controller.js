
const User = require("../models/User.model");
const Cv = require("../models/Cv");
const InvitController  = require("./Invitation.controller");
const jwt = require("jsonwebtoken");
const config = require("../config.json");



const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

// The Logic Related TO Invitation Here
////* Sign Up *////
exports.signup = async (req, res) => {
    const { email, password, firstName, lastName, age, sexe, isVerified, profession } = req.body;
    // test if he is not invited 
    const isInvited = await InvitController.verifyEmailIsInvited(email);
    console.log("ISSS INVITEDDD");
    console.log(isInvited);
    console.log("ISSS INVITEDDD");
    if (!isInvited) {
        console.log("Sorry ! Your Are Not Invited To Join Us yet :(")
        return res.status(403).send({ message: "User Not Invited !" });
    }
    const verifUser = await User.findOne({ email: email,  });
    // Work GOOD
    if (verifUser) {
        console.log("User already exists")
        res.status(403).send({ message: "User already exists !" });
    } else {
        console.log("Success")

        const newUSer = new User();
        mdpEncrypted = await bcrypt.hash(password, 10);
        newUSer.email = email;
        newUSer.password = mdpEncrypted;
        newUSer.firstname = firstName;
        newUSer.lastname = lastName;
        newUSer.age = age;
        newUSer.sexe = sexe;
        newUSer.isVerified = true;
        newUSer.profession = profession;
        // By defualt the new user is not an addmin
        // the admin will be manuyall added to the database

         newUSer.isAdmin = true;
        newUSer.cv = new Cv();
        newUSer.save();

        // token creation
        token = jwt.sign({ _id: newUSer._id }, config.token_secret, {
            expiresIn: "60000", // in Milliseconds (3600000 = 1 hour)
        });

        sendConfirmationEmail(email, token);
        // res.status(201).send({ message: "success", user: newUser, "token": token });
        res.status(201).send({ message: "success", user: newUSer, "token": token });
    }
}
exports.getAllUsers = async (req, res) => {
    const users = await User.find({});
    //.populate("Cv");
    //.populate("chats likes");

    if (users) {
        return res.status(200).send({ users, message: "success" });
    } else {
        return res.status(403).send({ message: "fail" });
    }
};

// set profile images 
exports.setImage = async (req, res) => {
    const { _id } = req.body;

    if (req.file) {
        console.log(req.file)
        console.log(req.body.id)

        let user = await User.findOneAndUpdate(
            { _id: req.body.id },
            {
                $set: {
                    image: req.file.path,

                }
            }
        );

    }
    res.json(req.file)
}

///
exports.login = async (req, res) => {
    const { email, password } = req.body;

    console.log(req.body);

    const user = await User.findOne({ email });

    if (user && ( bcrypt.compare(password, user.password))) {

        // token creation
        token = jwt.sign({ _id: user.id, email: user.email }, config.token_secret, {
            expiresIn: "100000000", // in Milliseconds (3600000 = 1 hour)
        })

        /*
        if (!user.isVerified) {
            res.status(200).send({ message: "email not verified" });
        } else {
            res.status(200).send({ token, user, message: "success" });
        }
        */
        res.status(200).send({ token, user });
    } else {
        res.status(403).send({ message: "email or password incorrect" });
    };
}

exports.findUserByEmail = async (req, res) => {
    const { email } = req.body;
    const user = await User.find({ email });
    //.populate("Cv");
    //.populate("chats likes");

    if (user) {
        return res.status(200).send({ user, message: "success" });
    } else {
        return res.status(403).send({ message: "There Is No User " });
    }
}

exports.getUserFromToken = async (req, res) => {

    const { token } = req.body;

    if (token == "") {
        res.status(403).send({ message: "No token provided" });
    } else {
        var user
        try {
            user = await User.findById(jwt.verify(token, config.token_secret)["_id"]);
        } catch (error) {
            console.log("Error : token invalid")
            return res.status(403).send({ message: "Token invalid" });
        }
        if (user) {
            console.log("User extracted from token")

            res.status(200).send({ user: user });
        } else {
            console.log("Can't find user with this token")

            res.status(403).send({ message: "Token invalid" });
        }
    }
}

exports.resendConfirmation = async (req, res) => {
    const user = await User.findOne({ "email": req.body.email });

    if (user) {
        // token creation
        const token = jwt.sign({ _id: user._id, email: user.email }, config.token_secret, {
            expiresIn: "60000", // in Milliseconds (3600000 = 1 hour)
        });

        sendConfirmationEmail(req.body.email, token);

        res.status(200).send({ "message": "Confirmation email was sent to " + user.email })
    } else {
        res.status(404).send({ "message": "User not found" })
    }
};

exports.confirmation = async (req, res) => {

    var tokenValue;
    try {
        tokenValue = jwt.verify(req.params.token, config.token_secret);
    } catch (e) {
        return res.status(400).send({ message: 'The confirmation link expired, please reverify.' });
    }

    User.findById(tokenValue._id, function (err, user) {
        if (!user) {
            return res.status(401).send({ message: 'User not found, please sign up.' });
        }
        else if (user.isVerified) {
            return res.status(200).send({ message: 'This mail has already been verified, please log in' });
        }
        else {
            user.isVerified = true;
            user.save(function (err) {
                if (err) {
                    return res.status(500).send({ message: err.message });
                }
                else {
                    return res.status(200).send({ message: 'Your account has been verified' });
                }
            });
        }
    });
}

exports.forgotPassword = async (req, res) => {
    const resetCode = req.body.resetCode
    const user = await User.findOne({ "email": req.body.email });

    if (user) {
        // token creation
        const token = jwt.sign({ _id: user._id, email: user.email }, config.token_secret, {
            expiresIn: "3600000", // in Milliseconds (3600000 = 1 hour)
        });

        sendPasswordResetEmail(req.body.email, token, resetCode);

        res.status(200).send({ "message": "Reset email has been sent to " + user.email })
    } else {
        res.status(404).send({ "message": "User not found" })
    }
};

exports.editPassword = async (req, res) => {
    const { email, newPassword } = req.body;

    newEncryptedPassword = await bcrypt.hash(newPassword, 10);

    let user = await User.findOneAndUpdate(
        { email: email },
        {
            $set: {
                password: newEncryptedPassword
            }
        }
    );

    res.send({ user });
};

exports.editProfile = async (req, res) => {

    const { email, firstname, lastname, sexe } = req.body;
    //  const {cv} = req.body.cv;
    console.log(req.body.cv);

    const user = await User.findOneAndUpdate(
        { email: email },
        //  {cv : cv},
        {
            $set: {

                firstname: firstname,
                lastname: lastname,
                //  age: age,
                sexe: sexe,
                //    profession: profession,

            }
        }
    );

    res.send(user);
};

exports.deleteOne = async (req, res) => {
    console.log(req.body)

    const user = await User.findById(req.body._id).remove()

    res.send({ user })
}

exports.deleteAll = async (req, res) => {
    User.remove({}, function (err, user) {
        if (err) { return handleError(res, err); }
        return res.status(204).send({ message: "No element" });
    })
}


async function sendPasswordResetEmail(email, token, resetCode) {
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
        to: email,
        subject: 'Reset your password',
        html: "<h2>Use this as your reset code : " + resetCode + "</h2>"
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log('ooooooooooooooooooooooppppppppppppppppppppp' + error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

async function sendConfirmationEmail(email, token) {
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

    const urlDeConfirmation = "http://localhost:3000/api/user/confirmation/" + token;

    const mailOptions = {
        from: 'alaeddine.aouiti@esprit.tn',
        to: email,
        subject: 'Please confirm your email',
        html: "<h4>Please confirm your email using this link : </h4><a href='" + urlDeConfirmation + "'>Confirmation</a>"
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}
/// not edited yet
async function configurerDossierUtilisateur(id) {
    const dir = `./uploads/utilisateurs/utilisateur-${id}`

    fs.mkdir(dir, function () {
        fs.exists(dir, function (exist, err) {
            if (exist) {
                const dir2 = `./uploads/developers/developer-${id}/profile-pic`
                fs.mkdir(dir2, function () {
                    console.log("folder created")
                })
            }
        })
    })
}

///ahmed
exports.FindUserbyId = async (req, res) => {
    try {
        const data = await User.findOne({ _id: req.params.id });
        res.status(201).json(data);
      } catch (error) {
        console.log(error.message);
      }
  };