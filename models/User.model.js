const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
        {          
                email: { type: String },
                password: { type: String },
                firstname: { type: String },
                lastname: { type: String },
                age: { type: Number },
                sexe: { type: String },
                isVerified: { type: Boolean },
                image: {type : String},
                // changed from admin to isAdmin
                isAdmin: {type : Boolean},
                image: {type : String},
                cv: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "Cv"
                    },              
        },
        {
                timestamps: { currentTime: () => Date.now() },
        }
);

module.exports = mongoose.model('User', UserSchema);