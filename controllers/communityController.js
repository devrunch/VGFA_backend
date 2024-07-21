import Farmer from "../model/Farmer.js";

import Response from "../entities/Response.js";

export const getFarmers = async (req, res) => {
  try {
    const farmers = await Farmer.find().exec();
    new Response(200, "Found farmers successfully!", { farmers }).success(res);
  } catch (error) {
    new Response(error.status || 500, error.message).error(res);
  }
};

export const getFarmer = async (req, res) => {
  try {
    const farmer = await Farmer.findOne({ phone: '+'+req.query.phone }).exec();
    if (!farmer) {
      let err = new Error('Farmer not found');
      err.status = 401;
      throw err;
    }
    new Response(200, "Found farmer successfully!", { farmer }).success(res);
    }
    catch (error) {
    new Response(error.status || 500, error.message).error(res);
    }
}

export const getFarmerByTag = async (req, res) => {
  try {
    const farmers = await Farmer.find({ tags: {$in:[req.query.tag.toLowerCase()]} }).exec();
    new Response(200, "Found farmers successfully!", { farmers }).success(res);
  } catch (error) {
    new Response(error.status || 500, error.message).error(res);
  }
}