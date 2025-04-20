const Expert = require("../models/expert.model");
const Business = require("../models/business.model");
const Schedule = require("../models/schedule.model")
const Treatment = require("../models/treatment.model");
const { findOne } = require("../models/user.model");

exports.requestTreatment = async (req, res) => {
  try {
    const user = req.payload;
    const user_id = user._id;
    const {expert_id} = req.body; 
    let { start_time, end_time } = req.body;
    if (!user || !start_time || !end_time) {
      return res
        .status(404)
        .json({ success: false, message: "Not enough infomation" });
    }
    const schedule = new Schedule({ start_time, end_time, user_id, expert_id });
    const treatment = new Treatment({treatmentStatus:"pending", schedule_id: schedule._id, user_id, expert_id});
    await schedule.save();
    await treatment.save();
    return res.status(200).json({success:true, treatment});
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.acceptTreatment = async (req, res) => {
    try {
      const {_id} = req.expert;
      const {treatment_id} = req.params;
      const expert = await Expert.findOne({_id: _id});
      if(!expert) return res.status(404).json({success: false, message: "Found not expert"});
      const treatment = await Treatment.findOne({_id: treatment_id});
      treatment.treatmentStatus = "approved";
      await treatment.save();

      res.status(200).json({success: true, treatment});
    }
    catch(error){
      return res.status(500).json({success:false, message: error.message});
    }
};


exports.rejectTreatment = async (req, res) => {
  try {
    const {_id} = req.expert;
    const {treatment_id} = req.params;
    const expert = await Expert.findOne({_id: _id});
    if(!expert) return res.status(404).json({success: false, message: "Found not expert"});
    const treatment = await Treatment.findOne({_id: treatment_id});
    treatment.treatmentStatus = "rejected";
    await treatment.save();

    res.status(200).json({success: true, treatment});
  }
  catch(error){
    return res.status(500).json({success:false, message: error.message});
  }
};

exports.completeTreatment = async (req, res) => {
  try {
    const {_id} = req.expert;
    const {treatment_id} = req.params;
    const expert = await Expert.findOne({_id: _id});
    if(!expert) return res.status(404).json({success: false, message: "Found not expert"});
    const treatment = await Treatment.findOne({_id: treatment_id});
    treatment.treatmentStatus = "completed";
    await treatment.save();

    res.status(200).json({success: true, treatment});
  }
  catch(error){
    return res.status(500).json({success:false, message: error.message});
  }
};
