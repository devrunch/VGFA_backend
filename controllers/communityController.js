import Farmer from "../model/Farmer.js";
import Response from "../entities/Response.js";
export const getFarmers = async (req, res) => {
  try {
    const farmers = await Farmer.find().exec();
    res.status(200).json(new Response(200, "Farmers fetched successfully", farmers));
  } catch (error) {
    res.status(error.status || 500).json(new Response(error.status || 500, error.message, null));
  }
};

export const getFarmer = async (req, res) => {
  try {
    const farmer = await Farmer.findOne({ phone: '+'+req.query.phone }).exec();
    if (!farmer) {
      res.status(401).json(new Response(401, "Farmer not found", null));
    }
    res.status(200).json(new Response(200, "Farmer fetched successfully", farmer));
    }
    catch (error) {
      res.status(error.status || 500).json(new Response(error.status || 500, error.message, null));
    }
}

export const getFarmerByTag = async (req, res) => {
  try {
    const farmers = await Farmer.find({ tags: {$in:[req.query.tag.toLowerCase()]} }).exec();
    res.status(200).json(new Response(200, "Farmers fetched successfully", farmers));
  } catch (error) {
    res.status(error.status || 500).json(new Response(error.status || 500, error.message, null));
  }
}