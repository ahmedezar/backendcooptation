const mongoose = require("mongoose");

const CVSchema = new mongoose.Schema(
    { 
        description: {type: String,  }, 
        competenace: [{
            name: { type : String },
            // level: { type: int }
        }],
        lang: [{
            name: { type: String },
           // level: { type: int }
        }],
        // experiance  travaille
        experiences: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "experience"
        }],
        // Formation - education
        formations: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Formation"
        }],
        freelancer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "freelancer"
        },
    },
    {
        timestamps: { currentTime: () => Date.now() },
    }
);

module.exports = mongoose.model('CV', CVSchema);