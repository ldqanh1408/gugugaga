
const User = require("../models/user.model");
const Business = require("../models/business.model");
const Expert = require("../models/expert.model");



const ROLE_MODELS = {
    USER:  {
        model: User
    },
    BUSINESS: {
        model: Business
    },
    EXPERT: {
        model: Expert
    }
}

module.exports = ROLE_MODELS;