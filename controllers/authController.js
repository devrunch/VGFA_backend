import Farmer from "../model/Farmer.js";
import Otp from "../model/Otp.js";


import { createJwtToken } from "../utils/tokenUtil.js";
import { checkVerification, sendVerification } from "../utils/otpUtil.js";

// --------------------- create new user ---------------------------------

export const createNewUser = async (req, res, next) => {
  try {
    let { phone, first_name, last_name, dob, panchayat_centre, gender, frn_number, address } = req.body;
    const phoneExist = await Farmer.findOne({ phone });
    console.log(phoneExist, "phoneExist");
    if (phoneExist) {
      res.json({ status: 400, message: "PHONE_ALREADY_EXISTS_ERR" });
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
      role: phone === process.env.ADMIN_PHONE ? "ADMIN" : "USER"
    });
    sendVerification(phone)
    console.log("hit")
    const a= await createUser.save();
    res.status(200).json({
      type: "success",
      message: "Account created OTP sended to mobile number",
      data: {
        createUser
      }
    });
    console.log(a)
    
  } catch (error) {
    console.log(error,"sdksaksj")
    res.status(400).json({
      type: "error",
      message: error.message,
    });
  }
};

export const Login_with_otp = async (req, res, next) => {
  try {
    const { phone } = req.body;
    const user = await Farmer.findOne({ phone });
    if(!user){
      res.status(400).json({
        type: "error",
        message: "User not found",
      });
    }
    sendVerification(phone)
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
    const user = await Farmer.findOne({phone: phone});
    console.log(user)
    if (!user) {
      next({ status: 400, message: "USER_NOT_FOUND_ERR" });
      return;
    }
    checkVerification(phone, otp).then((res) => {
      console.log(res)
      if (res !== "approved") {
        next({ status: 400, message: 'VERIFICATION_FAILED' })
      }
    });
    const token = createJwtToken({ userId: user._id });
    user.approved = true;
    await user.save();

    res.status(201).json({
      type: "success",
      message: "OTP verified successfully",
      data: {
        token,
        userId: user._id,
      },
    });
  } catch (error) {
    console.log(error)

    res.status(400).json({
      type: "error",
      message: error.message,
    });
  }
};


// --------------- fetch current user -------------------------

export const fetchCurrentUser = async (req, res, next) => {
  try {
    const currentUser = res.locals.user;


    return res.status(200).json({
      type: "success",
      message: "fetch current user",
      data: {
        user: currentUser,
      },
    });
  } catch (error) {
    console.log(error)

    res.status(400).json({
      type: "error",
      message: error.message,
    });
  }
};

// --------------- admin access only -------------------------

export const handleAdmin = async (req, res, next) => {
  try {
    const currentUser = res.locals.user;

    return res.status(200).json({
      type: "success",
      message: "Okay you are admin!!",
      data: {
        user: currentUser,
      },
    });
  } catch (error) {
    console.log(error)

    res.status(400).json({
      type: "error",
      message: error.message,
    });
  }
};