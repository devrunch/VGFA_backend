import Farmer from "../model/Farmer.js";
import { createJwtToken } from "../utils/tokenUtil.js";
import { checkVerification, sendVerification } from "../utils/otpUtil.js";
import Response from "../entities/Response.js";

import { validationResult } from "express-validator";

// --------------------- create new user ---------------------------------

export const createNewFarmer = async (req, res, next) => {
  try {
    // console.log(req.headers)
    let {
      phone,
      first_name,
      last_name,
      dob,
      panchayat_centre,
      gender,
      frn_number,
      address,
    } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const err = new Error(errors.array()[0].msg);
      err.status = 400;
      throw err;
    }

    const phoneExist = await Farmer.findOne({ phone });
    if (phoneExist) {
      const err = new Error("Phone already exists");
      err.status = 400;
      throw err;
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
    });
    // console.log(createUser)
    const a = await createUser.save();

    await sendVerification(phone)

    new Response(200, "Account created OTP sent to mobile number", { createUser }).success(res);
  } catch (error) {
    console.log(error);
    new Response(error.status || 500, error.message).error(res);
  }
};

export const loginFarmer = async (req, res, next) => {
  try {
    const { phone } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const err = new Error(errors.array()[0].msg);
      err.status = 400;
      throw err;
    }

    const user = await Farmer.findOne({ phone });

    if (!user) {
      const err = new Error("User doesn't exist");
      err.status = 400;
      throw err;
    }

    await sendVerification(phone)

    new Response(201, "OTP sent to your phone number").success(res);
  }
  catch (error) {
    console.log(error);
    new Response(error.status || 500, error.message).error(res);
  }
};

// ---------------------- verify phone otp -------------------------

export const verifyPhoneOtp = async (req, res, next) => {
  try {
    const { otp, phone } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const err = new Error(errors.array()[0].msg);
      err.status = 400;
      throw err;
    }

    const user = await Farmer.findOne({ phone: phone });
    if (!user) {
      const err = new Error("User doesn't exist");
      err.status = 400;
      throw err;
    }
    // const verified = await checkVerification(phone, otp);
    const verified = true;
    if (!verified) {
      const err = new Error("Wrong OTP");
      err.status = 400;
      throw err;
    }

    const token = createJwtToken({ userId: user._id });
    if (user.approved != true) {
      user.approved = true;
      await user.save();

    };

    new Response(201, "OTP verified successfully", { token, userId: user._id, }).success(res);
  } catch (error) {
    console.log(error)
    new Response(error.status || 500, error.message).error(res);

  }
};

// --------------- fetch current user -------------------------

export const fetchCurrentUser = async (req, res, next) => {
  try {
    const currentUser = res.locals.user;
    if (!currentUser) {
      const err = new Error("Unauthorised Access");
      err.status = 400;
      throw err;
    }

    new Response(200, "Current user", { user: currentUser }).success(res);
  }
  catch (error) {
    console.log(error);
    new Response(error.status || 500, error.message).error(res);

  }
};

// --------------- Update current user -------------------------

export const updateFarmer = async (req, res) => {
  try {
    let {
      phone,
      first_name,
      last_name,
      dob,
      panchayat_centre,
      gender,
      frn_number,
      address,
    } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const err = new Error(errors.array()[0].msg);
      err.status = 400;
      throw err;
    }
    const user = await Farmer.findOne({ phone });
    if (!user) {
      const err = new Error("User doesn't exist");
      err.status = 400;
      throw err;
    }

    user.phone = phone;
    user.first_name = first_name;
    user.last_name = last_name;
    user.dob = dob;
    user.panchayat_centre = panchayat_centre;
    user.gender = gender;
    user.frn_number = frn_number;
    user.address = address;
    let farmPhotosUrls = [];

    if (req.files["profilePicture"]) {
      user.imageUrl = `${req.files["profilePicture"][0].location}`;
    }
    if (req.files["LandOwnership"]) {
      user.LandOwnership = `${req.files["LandOwnership"][0].location}`;
    }
    if (req.files["CropHarvestRecords"]) {
      user.CropHarvestRecords = `${req.files["CropHarvestRecords"][0].location}`;
    }
    if (req.files["Certification"]) {
      user.Certification = `${req.files["Certification"][0].location}`;
    }
    if (req.files["SoilHealthReport"]) {
      user.SoilHealthReport = `${req.files["SoilHealthReport"][0].location}`;
    }
    if (req.files["FarmPhotos"]) {
      req.files["FarmPhotos"].forEach((file) => {
        farmPhotosUrls.push(`${file.location}`);
      });
      user.FarmPhotos = farmPhotosUrls;
    }

    const a = await user.save();

    new Response(200, "Account Updated", { user }).success(res);
  }
  catch (error) {
    console.log(error);
    new Response(error.status || 500, error.message).error(res);

  }
};

export const checkMissingFields = async (req, res) => {
  try {
    const farmer = res.locals.user;

    if (!farmer) {
      const err = new Error("Farmer not found");
      err.status = 404;
      throw err;
    }

    const requiredFields = [
      "first_name",
      "last_name",
      "phone",
      "dob",
      "panchayat_centre",
      "gender",
      "frn_number",
      "address",
      "LandOwnership",
      "CropHarvestRecords",
      "SoilHealthReport",
    ];

    const missingFields = requiredFields.filter((field) => !farmer[field]);

    if (missingFields.length > 0) {

      new Response(200, "Farmer is not verified", { status: false, missingFields }).error(res);
    } else {
      new Response(200, "Farmer is verified", { status: true, farmer }).success(res);
    }
  } catch (error) {
    new Response(error.status || 500, error.message).error(res);

  }
};
