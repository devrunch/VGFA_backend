import VgfaForm from "../model/VgfaForm.js";
export const getForm = async (req, res) => {
  try {
    const farmer = res.locals.user;
    if (!farmer) {
      let err = new Error('Farmer not found');
      err.status = 401;
      throw err;
    }
    const form = await VgfaForm.findOne({ farmer: farmer._id }).populate('farmer').exec();
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
export const getAllForms = async (req, res) => {
  try {
    const forms = await VgfaForm.find({}).populate('farmer').exec();
    res.status(200).json({ forms });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
}
export const createForm = async (req, res) => {
  try {
    const farmer = res.locals.user;
    if (!farmer) {
      let err = new Error('Farmer not found');
      err.status = 401;
      throw err;
    }
    const requiredFields = [
      'first_name',
      'last_name',
      'phone',
      'dob',
      'panchayat_centre',
      'gender',
      'frn_number',
      'address',
      'imageUrl',
      'LandOwnership',
      'CropHarvestRecords',
      'SoilHealthReport'
    ];
    const missingFields = requiredFields.filter(field => !farmer[field]);
    if (missingFields.length > 0) {
      let err = new Error('Farmer is Not Verified');
      err.status = 401;
      err.missingFields = missingFields;
      throw err;
    }
    let d = req.body;
    const existingForm = await VgfaForm.findOne({ farmer: farmer._id }).exec()
    if (existingForm) {
      let err = new Error('Form Already Exist');
      err.status = 401;
      throw err;
    }
    if (!farmer.tags.includes(d.cropType.toLowerCase())) {
      farmer.tags.push(d.cropType.toLowerCase());
    }

    d.farmer = farmer._id;
    await farmer.save();
    const form = await VgfaForm.create(d);
    res.status(200).json({ form });
  } catch (error) {
    console.log(error)
    res.status(error.status || 500).json({ message: error.message });
  }
};
export const updateForm = async (req, res) => {
  try {
    // console.log(req.body)
    const Form = await VgfaForm.findById(req.body. id).exec()
    if (!Form) {
      let err = new Error('Form Does not Exist');
      err.status = 401;
      throw err;
    } 
    if (req.body.isDisapproved) {
      Form.state = 4;
      Form.remarks=req.body.remarks;
    }
    else {
      if(Form.state < 4)
      Form.state += 1;
    }
    await Form.save();
    res.status(200).json({ Form });
  } catch (error) {
    console.log(error)
    res.status(error.status || 500).json({ message: error.message });
  }
};
