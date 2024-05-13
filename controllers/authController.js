import Farmer from "../model/Farmer.js";
import { createJwtToken } from "../utils/tokenUtil.js";
import { checkVerification, sendVerification } from "../utils/otpUtil.js";

// --------------------- create new user ---------------------------------

export const createNewFarmer = async (req, res, next) => {
  try {

    let { phone, first_name, last_name, dob, panchayat_centre, gender, frn_number, address } = req.body;

    const phoneExist = await Farmer.findOne({ phone });

    console.log(phoneExist, "phoneExist");
    if (phoneExist) {
      let err = new Error("Phone already exists");
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

    await sendVerification(phone)

    const a = await createUser.save();

    res.status(200).json({
      type: "success",
      message: "Account created OTP sended to mobile number",
      data: {
        createUser
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
      message: error.message,
    });
  }
};

// ---------------------- verify phone otp -------------------------

export const verifyPhoneOtp = async (req, res, next) => {
  try {
    const { otp, phone } = req.body;

    const user = await Farmer.findOne({ phone: phone });
    console.log(user)
    if (!user) {
      let err = new Error("User Doesn't exists");
      err.status = 400;
      throw err;
    }
    console.log('here')
    const verified = await checkVerification(phone, otp);
    if (!verified){
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

    res.status(error.status||500).json({
      type: "error",
      message: error.message,
    });
  }
};


// --------------- fetch current user -------------------------


export const fetchCurrentUser = async (req, res, next) => {
  console.log('hit')
  try {
    const currentUser = res.locals.user;
    if(!currentUser){
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
      data:error
    });
  }
};

// --------------- Update current user -------------------------

export const updateFarmer = async (req, res, next) => {
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
      user.dob= dob;
      user.panchayat_centre = panchayat_centre;
      user.gender = gender
      user.frn_number = frn_number;
      user.address = address

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
