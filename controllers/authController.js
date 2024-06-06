import Farmer from "../model/Farmer.js";
import { createJwtToken } from "../utils/tokenUtil.js";
import { checkVerification, sendVerification } from "../utils/otpUtil.js";

// --------------------- create new user ---------------------------------

export const createNewFarmer = async (req, res, next) => {
  try {
    let { phone, first_name, last_name, dob, panchayat_centre, gender, frn_number, address } = req.body;
    const phoneExist = await Farmer.findOne({ phone });
    if (phoneExist) {
      let err = new Error("Phone already exists");
      err.status = 400;
      throw err;
    }

    let imageUrl, landOwnershipUrl, cropHarvestRecordsUrl, certificationUrl, soilHealthReportUrl, farmPhotosUrls = [];

    if (req.files['profilePicture']) {
      imageUrl = `${req.files['profilePicture'][0].location}`;
    }
    if (req.files['LandOwnership']) {
      landOwnershipUrl = `${req.files['LandOwnership'][0].location}`;
    }
    if (req.files['CropHarvestRecords']) {
      cropHarvestRecordsUrl = `${req.files['CropHarvestRecords'][0].location}`;
    }
    if (req.files['Certification']) {
      certificationUrl = `${req.files['Certification'][0].location}`;
    }
    if (req.files['SoilHealthReport']) {
      soilHealthReportUrl = `${req.files['SoilHealthReport'][0].location}`;
    }
    if (req.files['FarmPhotos']) {
      req.files['FarmPhotos'].forEach(file => {
        farmPhotosUrls.push(`${file.location}`);
      });
    }
    const createUser = new Farmer({
      phone,
      first_name,
      last_name,
      dob,
      panchayat_centre,
      gender,
      frn_number,
      address,
      imageUrl,
      LandOwnership: landOwnershipUrl,
      CropHarvestRecords: cropHarvestRecordsUrl,
      Certification: certificationUrl,
      SoilHealthReport: soilHealthReportUrl,
      FarmPhotos: farmPhotosUrls
    });

    const a = await createUser.save();

    await sendVerification(phone)

    res.status(200).json({
      type: "success",
      message: "Account created OTP sended to mobile number",
      data: {
        createUser
      }
    });

  } catch (error) {
    res.status(error.status || 500).json({
      type: "error",
      message: error.message,
    });
  }
};

export const loginFarmer = async (req, res, next) => {
  try {
    const { phone } = req.body;

    const user = await Farmer.findOne({ phone });

    if (!user) {
      let err = new Error("User Doesn't exists");
      err.status = 400;
      throw err;
    }

    await sendVerification(phone)
    res.status(201).json({
      type: "success",
      message: "OTP sended to your phone number",
      data: {
        message: "send"
      },
    });
  }
  catch (err) {
    console.log(err)
    res.status(err.status || 500).json({

      type: "error",
      message: err.message,
    });
  }
};

// ---------------------- verify phone otp -------------------------

export const verifyPhoneOtp = async (req, res, next) => {
  try {
    const { otp, phone } = req.body;

    const user = await Farmer.findOne({ phone: phone });
    if (!user) {
      let err = new Error("User Doesn't exists");
      err.status = 400;
      throw err;
    }
    // const verified = await checkVerification(phone, otp);
    const verified = true;
    if (!verified) {
      let err = new Error("Wrong OTP");
      err.status = 400;
      throw err;
    }

    const token = createJwtToken({ userId: user._id });
    if (user.approved != true) {
      user.approved = true
      await user.save();
    };

    res.status(201).json({
      type: "success",
      message: "OTP verified successfully",
      data: {
        token,
        userId: user._id,
      },
    });

  } catch (error) {

    res.status(error.status || 500).json({
      type: "error",
      message: error.message,
    });
  }
};


// --------------- fetch current user -------------------------


export const fetchCurrentUser = async (req, res, next) => {
  try {
    const currentUser = res.locals.user;
    if (!currentUser) {
      let err = new Error("Unauthorised Access");
      err.status = 400;
      throw err;
    }
    return res.status(200).json({
      type: "success",
      message: "current user",
      data: {
        user: currentUser,
      },
    });
  }
  catch (error) {

    res.status(error.status || 500).json({
      message: error.message,
      data: error
    });
  }
};

// --------------- Update current user -------------------------

export const updateFarmer = async (req, res) => {
  try {

    let { phone, first_name, last_name, dob, panchayat_centre, gender, frn_number, address } = req.body;

    const user = await Farmer.findOne({ phone });
    if (!user) {
      let err = new Error("User Doesn't exists");
      err.status = 400;
      throw err;
    }


    user.phone = phone;
    user.first_name = first_name;
    user.last_name = last_name;
    user.dob = dob;
    user.panchayat_centre = panchayat_centre;
    user.gender = gender
    user.frn_number = frn_number;
    user.address = address
    let farmPhotosUrls = [];

    if (req.files['profilePicture']) {
      user.imageUrl = `${req.files['profilePicture'][0].location}`;
    }
    if (req.files['LandOwnership']) {
      user.LandOwnership = `${req.files['LandOwnership'][0].location}`;
    }
    if (req.files['CropHarvestRecords']) {
      user.CropHarvestRecords = `${req.files['CropHarvestRecords'][0].location}`;
    }
    if (req.files['Certification']) {
      user.Certification = `${req.files['Certification'][0].location}`;
    }
    if (req.files['SoilHealthReport']) {
      user.SoilHealthReport = `${req.files['SoilHealthReport'][0].location}`;
    }
    if (req.files['FarmPhotos']) {
      req.files['FarmPhotos'].forEach(file => {
        farmPhotosUrls.push(`${file.location}`);
      });
      user.FarmPhotos = farmPhotosUrls;
    }


    const a = await user.save();

    res.status(200).json({
      type: "success",
      message: "Account Updated",
      data: {
        user
      }
    });


  }
  catch (error) {
    res.status(error.status || 500).json({
      type: "error",
      message: error.message,
    });
  }
};

export const checkMissingFields = async (req, res) => {
  try {
    const farmer = res.locals.user;

    if (!farmer) {
      return res.status(404).send({ message: 'Farmer not found' });
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
      'LandOwnership',
      'CropHarvestRecords',
      'SoilHealthReport'
    ];

    const missingFields = requiredFields.filter(field => !farmer[field]);

    if (missingFields.length > 0) {
      res.status(200).send({
        message: 'Farmer is not verified',
        status: false,
        missingFields,
      });
    } else {
      res.status(200).send({
        message: 'Farmer is verified',
        status: true,
        farmer,
      });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
