import VgfaForm from "../model/VgfaForm.js";
import Farmer from "../model/Farmer.js";
export const getForm = async (req, res) => {
  try {
    const farmer = await Farmer.findOne({ phone: "+" + req.query.phone }).exec();
    if (!farmer) {
      let err = new Error('Farmer not found');
      err.status = 401;
      throw err;
    }
    const form = await VgfaForm.findOne({ farmer: farmer._id }).exec();
    if (!form) {
      let err = new Error('Form not found');
      err.status = 401;
      throw err;
    }
    res.status(200).json({ form });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};
export const createForm = async (req, res) => {
  try {
    const farmer = await Farmer.findOne({ phone: req.body.farmer }).exec();
    if (!farmer) {
      let err = new Error('Form not found');
      err.status = 401;
      throw err;
    }
    let d = req.body;
    d.farmer = farmer._id;
    const form = await VgfaForm.create(d);
    res.status(200).json({ form });
  } catch (error) {
    console.log(error)
    res.status(error.status || 500).json({ message: error.message });
  }
};