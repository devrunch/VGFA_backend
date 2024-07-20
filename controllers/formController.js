import VgfaForm from "../model/VgfaForm.js";
import Response from "../entities/Response.js";
export const getForm = async (req, res) => {
  try {
    const farmer = res.locals.user;
    if (!farmer) {
      res.status(401).json(new Response(401, "Farmer not found", null));
    }
    const form = await VgfaForm.findOne({ farmer: farmer._id }).populate('farmer').exec();
    if (!form) {
      return res.status(401).json(new Response(401, 'Form not found', null));
    }
    res.status(200).json(new Response(200, "Form fetched successfully", form));
  } catch (error) {
    res.status(error.status || 500).json(new Response(error.status || 500, error.message, null));
  }
};
export const getAllForms = async (req, res) => {
  try {
    const forms = await VgfaForm.find({}).populate('farmer').exec();
    res.status(200).json(new Response(200,"Forms fetched successfully",forms)); 
  } catch (error) {
    res.status(error.status || 500).json(new Response(error.status || 500, error.message, null));
  }
}
export const createForm = async (req, res) => {
  try {
    const farmer = res.locals.user;
    if (!farmer) {
      return res.status(401).json(new Response(401, "Farmer not found", null));
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
      return res.status(401).json(new Response(401, "Farmer is Not Verified", missingFields));
    }
    let d = req.body;
    const existingForm = await VgfaForm.findOne({ farmer: farmer._id }).exec()
    if (existingForm) {
      return res.status(401).json(new Response(401, "Form Already Exist", null));
    }
    if (!farmer.tags.includes(d.cropType.toLowerCase())) {
      farmer.tags.push(d.cropType.toLowerCase());
    }

    d.farmer = farmer._id;
    await farmer.save();
    const form = await VgfaForm.create(d);
    res.status(200).json(new Response(200, "Form created successfully", form));
  } catch (error) {
    console.log(error)
    res.status(error.status || 500).json(new Response(error.status || 500, error.message, null));
  }
};
export const updateForm = async (req, res) => {
  try {
    // console.log(req.body)
    const Form = await VgfaForm.findById(req.body. id).exec()
    if (!Form) {
      return res.status(401).json(new Response(401, "Form Does not Exist", null));
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
    res.status(200).json(new Response(200, "Form Updated", { Form }));
  } catch (error) {
    console.log(error)
    res.status(error.status || 500).json(new Response(error.status || 500, error.message, null));
  }
};
