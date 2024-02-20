import Farmer from "../model/Farmer.js";
import Otp from "../model/Otp.js";


import { createJwtToken } from "../utils/tokenUtil.js";
import { generateOTP, fast2Sms } from "../utils/otpUtil.js";

// --------------------- create new user ---------------------------------

export const createNewUser = async (req, res, next) => {
  try {
    let { phone, first_name, last_name, dob, panchayat_centre, gender, frn_number, address } = req.body;
    // check duplicate phone Number
    const phoneExist = await Farmer.findOne({ phone });

    if (phoneExist) {
      next({ status: 400, message: "PHONE_ALREADY_EXISTS_ERR" });
      return;
    }
    // create new user
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

    // save user
    const user = await createUser.save();

    res.status(200).json({
      type: "success",
      message: "Account created OTP sended to mobile number",
      data: {
        userId: user._id,
      },
    });

    // generate otp
    const otp = generateOTP(6);
    // save otp to user collection
    user.phoneOtp = otp;
    await user.save();
    // send otp to phone number
    await fast2sms(
      {
        message: `Your OTP is ${otp}`,
        contactNumber: user.phone,
      },
      next
    );
  } catch (error) {
    next(error);
  }
};



// ------------ login with phone otp ----------------------------------

export const loginWithPhoneOtp = async (req, res, next) => {
  try {

    const { phone } = req.body;
    const user = await Farmer.findOne({ phone });

    if (!user) {
      next({ status: 400, message: "PHONE_NOT_FOUND_ERR" });
      return;
    }

    res.status(201).json({
      type: "success",
      message: "OTP sended to your registered phone number",
      data: {
        userId: user._id,
      },
    });

    // generate otp
    const otp = generateOTP(6);
    // save otp to user collection
    user.phoneOtp = otp;
    await user.save();
    // send otp to phone number
    await fast2sms(
      {
        message: `Your OTP is ${otp}`,
        contactNumber: user.phone,
      },
      next
    );
  } catch (error) {
    next(error);
  }
};

export const loginOtp = async (req, res, next) => {
  try {
    const { number } = req.body;
    const user = await Farmer.findOne({ phone:number });
    let newnum
    if (!user) {
       newnum = new Otp({
        number: number,
      });
      
      res.status(201).json({
        type: "success",
        message: "OTP sended to your registered phone number",
        data: {
          message:"send"
        },
      });
      
      // generate otp
      const otp = generateOTP(6);
      // save otp to user collection
      newnum.otp = otp;
      await newnum.save();
      // send otp to phone number
      await fast2Sms(
        {
          message: `Your OTP is ${otp}`,
          contactNumber: newnum.number,
        },
        next
      );
    }
    else
      loginWithPhoneOtp(req, res, next);
  } catch (error) {
    next(error);
  }
};
// ---------------------- verify phone otp -------------------------

export const verifyPhoneOtp = async (req, res, next) => {
  try {
    const { otp, number } = req.body;
    const user = await Otp.findById(number);
    if (!user) {
      next({ status: 400, message: "USER_NOT_FOUND_ERR" });
      return;
    }

    if (user.otp !== otp) {
      next({ status: 400, message: "INCORRECT_OTP_ERR" });
      return;
    }
    const token = createJwtToken({ userId: user._id });

    user.otp = "";
    user.isAccountVerified = true;
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
    next(error);
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
    next(error);
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
    next(error);
  }
};