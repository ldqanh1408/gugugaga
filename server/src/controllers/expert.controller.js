const Expert = require("../models/expert.model");
const Business = require("../models/business.model");
const Treatment = require("../models/treatment.model");
const Schedule = require("../models/schedule.model");
const bcrypt = require("bcrypt");
const redisHelper = require("../utils/redisHelper");
const constants = require("../constants");
const pubSubHelper = require("../utils/pubSubHelper");
const mongoose = require("mongoose");
async function hashPassword(password) {
  const saltRounds = 10; // Số lần hash (càng cao càng an toàn nhưng chậm)
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

exports.addExpert = async (req, res) => {
  try {
    let { account, password, expert_name, gendar, diploma_url, avatar_url } =
      req.body;
    password = await hashPassword(password);
    const business = req.payload;
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
    await pubSubHelper.publishInvalidation(constants.CHANEL_EXPERTS, {
      businessId : business._id,
    });

    return res.status(200).json({ success: true, expert: newExpert });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getExperts = async (req, res) => {
  try {
    const temp_business = req.payload;
    const cacheKey = `experts:business:${temp_business._id}`;
    const cachedData = await redisHelper.get(cacheKey);

    if (cachedData) {
      // Nếu có cache, trả về luôn
      return res
        .status(200)
        .json({ success: true, experts: cachedData, msg: "OF REDIS" });
    }
    let business_id = new mongoose.Types.ObjectId(temp_business._id);
    const business = await Business.findOne({ _id: business_id });
    if (!business)
      return res
        .status(404)
        .json({ success: false, message: "Found not business" });
    const experts = await Expert.find({ business_id: business_id });

    await redisHelper.set(cacheKey, experts);
    return res.status(200).json({ success: true, experts });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getTreatment = async (req, res) => {
  try {
    let { _id } = req.payload;
    const expert = await Expert.findOne({ _id: _id });
    if (!expert)
      return res
        .status(404)
        .json({ success: false, message: "Found not expert" });
    const cacheData = await redisHelper.get(`treatments:experts:${expert._id}`);
    if(cacheData){
      return res.status(200).json({ success: true, treatments: cacheData });
    }
    const treatments = await Treatment.find({ expert_id: _id });
    await redisHelper.set(`treatments:experts:${expert._id}`, treatments);
    return res.status(200).json({ success: true, treatments });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAvailableExperts = async (req, res) => {
  try {
    const { start_time, end_time } = req.body;
    const schedules = await Schedule.find({
      start_time: { $lte: end_time },
      end_time: { $gte: start_time },
    });
    const expert_ids = schedules.map((s) => s.expert_id);
    const experts = await Expert.find({
      _id: { $nin: expert_ids },
    });
    return res.status(200).json({ success: true, experts });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
