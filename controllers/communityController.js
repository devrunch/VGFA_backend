import Farmer from "../model/Farmer.js";

export const getFarmers = async (req, res) => {
  try {
    const farmers = await Farmer.find().exec();
    res.status(200).json({ farmers });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

export const getFarmer = async (req, res) => {
  try {
    console.log(req.query.phone);
    const farmer = await Farmer.findOne({ phone: '+'+req.query.phone }).exec();
    if (!farmer) {
      let err = new Error('Farmer not found');
      err.status = 401;
      throw err;
    }
    res.status(200).json({ farmer });
    }
    catch (error) {
      res.status(error.status || 500).json({ message: error.message });
    }
}

export const getFarmerByTag = async (req, res) => {
  try {
    const farmers = await Farmer.find({ tags: {$in:[req.query.tag.toLowerCase()]} }).exec();
    res.status(200).json({ farmers });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
}