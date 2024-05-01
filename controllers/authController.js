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
      res.json({
        type: 'error',
        status: 401,
        message: "Already Exist"
      });
      return;
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
    res.status(500).json({
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
      res.status(400).json({
        type: "error",
        message: "User not found",
      });
      return ;
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
    res.status(400).json({

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
      res.status(400).json({ message: "USER_NOT_FOUND_ERR" });
      return;
    }
    console.log('here')
    const verified = await checkVerification(phone, otp);
    if (!verified){
      console.log("here")
      res.status(400).json({
        type: "error",
        message: "Wrong OTP",
      });
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

    res.status(500).json({
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
      return res.status(400).json({
        type: "error",
        message: "User not found",
      });
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
    
    res.status(500).json({
      type: "error",
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
      res.json({
        type: 'error',
        status: 401,
        message: "User Does Not Exist"
      });
      return;
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
    res.status(500).json({
      type: "error",
      message: error.message,
    });
  }
};
