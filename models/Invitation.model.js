const mongoose = require("mongoose");

const InvitSchema = new mongoose.Schema(
        {          
                invitedEmail: { type: String },
                code: { type: String },
                userEmail: {type: String},
                isActive: { type: Boolean },               
        },
        {
                timestamps: { currentTime: () => Date.now() },
        }
);

module.exports = mongoose.model('Invit', InvitSchema);