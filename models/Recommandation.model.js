const mongoose = require("mongoose");

const RecSchema = new mongoose.Schema(
        {

                // id OFfer
                offer_Id: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "offer"
                },
                userEmail: { type: String },
                invitedEmail: { type: String },
                invitedName: { Ttpe: String },
                invitedLastName: { type: String },
                linkedInUrl: { type: String },
                message: {type : String},
                cv: {type : String},
                // cv PDF    
        },
        {
                timestamps: { currentTime: () => Date.now() },
        }
);

module.exports = mongoose.model('Recommandation', RecSchema);