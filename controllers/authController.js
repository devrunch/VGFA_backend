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
      return res
        .status(400)
        .json(new Response(400, errors.array()[0].msg, null));
    }
    const phoneExist = await Farmer.findOne({ phone });
    if (phoneExist) {
      return res
        .status(400)
        .json(new Response(400, "Phone already exists", null));
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

    await sendVerification(phone);
    res
      .status(201)
      .json(
        new Response(
          201,
          "Account created OTP sended to mobile number",
          createUser
        )
      );
  } catch (error) {
    console.log(error);
    res
      .status(error.status || 500)
      .json(new Response(error.status || 500, error.message, null));
  }
};

export const loginFarmer = async (req, res, next) => {
  try {
    const { phone } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json(new Response(400, errors.array()[0].msg, null));
    }

    const user = await Farmer.findOne({ phone });

    if (!user) {
      return res
        .status(400)
        .json(new Response(400, "User Doesn't exist", null));
    }

    await sendVerification(phone);
    res.status(201).json(
      new Response(201, "OTP sended to your phone number", {
        message: "send",
      })
    );
  } catch (err) {
    console.log(err);
    res
      .status(err.status || 500)
      .json(new Response(err.status || 500, err.message, null));
  }
};

// ---------------------- verify phone otp -------------------------

export const verifyPhoneOtp = async (req, res, next) => {
  try {
    const { otp, phone } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json(new Response(400, errors.array()[0].msg, null));
    }

    const user = await Farmer.findOne({ phone: phone });
    if (!user) {
      return res
        .status(400)
        .json(new Response(400, "User Doesn't exist", null));
    }
    const verified = await checkVerification(phone, otp);
    // const verified = true;
    if (!verified) {
      return res.status(400).json(new Response(400, "Wrong OTP", null));
    }

    const token = createJwtToken({ userId: user._id });
    if (user.approved != true) {
      user.approved = true;
      await user.save();
    }
    res.status(201).json(
      new Response(201, "OTP verified successfully", {
        token,
        userId: user._id,
      })
    );
  } catch (error) {
    console.log(error);
    res
      .status(error.status || 500)
      .json(new Response(error.status || 500, error.message, null));
  }
};

// --------------- fetch current user -------------------------

export const fetchCurrentUser = async (req, res, next) => {
  try {
    const currentUser = res.locals.user;
    if (!currentUser) {
      return res
        .status(400)
        .json(new Response(400, "Unauthorised Access", null));
    }
    return res
      .status(200)
      .json(new Response(200, "current user", { user: currentUser }));
  } catch (error) {
    console.log(error);
    res
      .status(error.status || 500)
      .json(new Response(error.status || 500, error.message, null));
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
      return res
        .status(400)
        .json(new Response(400, errors.array()[0].msg, null));
    }
    const user = await Farmer.findOne({ phone });
    if (!user) {
      return res
        .status(400)
        .json(new Response(400, "User Doesn't exists", null));
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

    res.status(200).json(new Response(200, "Account Updated", { user }));
  } catch (error) {
    console.log(error);
    res
      .status(error.status || 500)
      .json(new Response(error.status || 500, error.message, null));
  }
};

export const checkMissingFields = async (req, res) => {
  try {
    const farmer = res.locals.user;

    if (!farmer) {
      return res.status(404).json(new Response(404, "Farmer not found", null));
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
      res.status(200).json(
        new Response(200, "Farmer is not verified", {
          status: false,
          missingFields,
        })
      );
    } else {
      res
        .status(200)
        .json(
          new Response(200, "Farmer is verified", { status: true, farmer })
        );
    }
  } catch (error) {
    res.status(500).json(new Response(500, error.message, null));
  }
};
