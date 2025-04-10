const Expert = require("../models/expert.model");
const Business = require("../models/business.model")
const Treatment = require("../models/treatment.model")
const bcrypt = require("bcrypt")
const mongoose = require("mongoose")
async function hashPassword(password) {
  const saltRounds = 10; // Số lần hash (càng cao càng an toàn nhưng chậm)
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

exports.addExpert = async (req, res) => {
  try {
    let {
      account,
      password,
      expert_name,
      gendar,
      diploma_url,
      avatar_url,
    } = req.body;

    password = await hashPassword(password);
    const business = req.business
    let business_id = business._id;
    business_id = new mongoose.Types.ObjectId(business_id);
    const role = "EXPERT";
    const number_of_treatment = 0;
    const newExpert = new Expert({
      account,
      password,
      expert_name,
      gendar,
      role,
      number_of_treatment,
      diploma_url,
      business_id,
      avatar_url,
    });

    await newExpert.save();
    return res.status(200).json({success: true, expert: newExpert});
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getExperts = async (req, res) => {
    try {
        const temp_business = req.business;
        let business_id = new mongoose.Types.ObjectId(temp_business._id);
        const business = await Business.findOne({_id: business_id});
        if(!business) return res.status(404).json({success: false, message: "Found not business"});
        const experts = await Expert.find({business_id: business_id});
        return res.status(200).json({success: true, experts});
    }
    catch (error){
        return res.status(500).json({ success: false, message: error.message });
    }
}

exports.getTreatment = async (req, res) => {
    try{
        let {_id} = req.expert;
        const expert = await Expert.findOne({_id: _id});
        if(!expert) return res.status(404).json({success: false, message: "Found not expert"})
        const treatments = await Treatment.find({expert_id: _id});
        return res.status(200).json({success:true, treatments});
    }
    catch(error){
        return res.status(500).json({ success: false, message: error.message });
    }
}

exports.getAvailableExperts = async (req, res) => {

}