const mongoose = require("mongoose");

const OfferSchema = new mongoose.Schema(
        {          
                title: {type: String}, //
                description : {type: String}, //
                // fulltime part time
                // company Name I missign
                /*
                Todo  Add company Name
                */
                modedemploi:  {type: String}, //
                companyDescription: {type: String}, //
                responsabilities: {type : String}, //
                requiredSkills : [{type: String}], //
                expYears: {type: String}, //
                image: {type : String}, //
                // list des ID des recommandations
                recommandations: [{
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "recommandation"
                }],
                // offers state
                closed: {type : Boolean},
                // starDate duration status
                startDate: {type: String}, //
                duration :{type : String}, //
                status: {type: String},
                //    
        },
        {
                timestamps: { currentTime: () => Date.now() },
        }
);

module.exports = mongoose.model('Offer', OfferSchema);