import VgfaForm from "../model/VgfaForm.js";

import Response from "../entities/Response.js";

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
    new Response(200, "Fetched form successfully!", { form }).success(res);
  } catch (error) {
    new Response(error.status || 500, error.message).error(res);
  }
};
export const getAllForms = async (req, res) => {
  try {
    const forms = await VgfaForm.find({}).populate('farmer').exec();
    new Response(200, "Fetched forms successfully!", { forms }).success(res);
    // res.status(200).json({ forms });
  } catch (error) {
    new Response(error.status || 500, error.message).error(res);
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
    new Response(200, "Form created successfully!", form).success(res);
    res.status(200).json({ form });
  } catch (error) {
    console.log(error)
    new Response(error.status || 500, error.message).error(res);
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
    new Response(200, "Updated form successfully!", Form).success(res);
  } catch (error) {
    console.log(error)
    new Response(error.status || 500, error.message).error(res);
  }
};
