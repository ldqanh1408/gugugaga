const Expert = require("../models/expert.model");
const Business = require("../models/business.model");
const Treatment = require("../models/treatment.model");

exports.addTreatment = async (req, res) => {
  try {
    const user = req.user;
    const expert = req.expert;
    const user_id = user._id;
    const expert_id = expert._id;
    let { start_time, end_time } = req.body;
    if (!user || !expert || !start_time || !end_time) {
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
    return res.status(500).json({ success: true, message: error.message });
  }
};

exports.acceptTreatment = async (req, res) => {
    
}