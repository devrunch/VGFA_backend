import VgfaForm from "../model/VgfaForm.js";
import Farmer from "../model/Farmer.js";
export const getForm = async (req, res) => {
  try {
    const farmer = await Farmer.findOne({ phone: "+"+req.query.phone }).exec();
    if (!farmer) {
        throw new Error('Farmer not found');
    }
    const form = await VgfaForm.findOne({ farmer: farmer._id }).exec();
    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }
    res.status(200).json({ form });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const createForm = async (req, res) => {
  try {
    const farmer = await Farmer.findOne({ phone: req.body.farmer }).exec();
    if (!farmer) {
        throw new Error('Farmer not found');
    }
    let d = req.body;
    d.farmer = farmer._id;
    const form = await VgfaForm.create(d);
    res.status(201).json({ form });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};