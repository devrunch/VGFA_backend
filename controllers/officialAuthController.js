import User from "../model/Official.js";
import Response from "../entities/Response.js";
import { validationResult } from "express-validator";
import OfficialUpdate from "../model/OfficialUpdates.js";

export const Login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const err = new Error(errors.array()[0].msg);
      err.status = 400;
      throw err;
    }
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      const err = new Error("User doesn't exist");
      err.code = 401;
      throw err;
    }

    const isMatch = await user.comparePassword(req.body.password);
    if (!isMatch) {
      // Incorrect password
      const err = new Error("Invalid username or password");
      err.code = 401;
      throw err;
    }
    if (user.status === "pending") {
      const err = new Error("Form is under review");
      err.code = 403;
      throw err;
    }
    const token = await user.generateAuthToken();
    res.cookie("jwttoken", token);
    new Response(200, "Login Success", { token }).success(res);
  } catch (error) {
    new Response(error.status || 500, error.message).error(res);
  }
};
export const Profile = async (req, res) => {
  try {
    const user = res.locals.user;
    new Response(200, "Profile fetched successfully", {
      message: user,
      status: 1,
    }).success(res);
  } catch (error) {
    new Response(error.status || 500, error.message).error(res);
  }
};
export const Register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const err = new Error(errors.array()[0].msg);
      err.status = 400;
      throw err;
    }
    const user = new User(req.body);
    const userExist = await User.findOne({
      $or: [{ email: req.body.email }, { phone: req.body.phone }],
    });
    if (userExist) {
      const err = new Error("Email or phone already registered!");
      err.status = 400;
      throw err;
    }
    await user.save();
    new Response(200, "User created successfully!").success(res);
  } catch (error) {
    console.log(error);
    new Response(error.status || 500, error.message).error(res);
  }
};

export const update = async (req, res) => {
  try {
    const userID = res.locals.user;
    if (Object.keys(req.body).length === 0) {
      throw new Error("No fields to update");
    }

    // @todo! Validate the req.body object first; Also this method returns the updated document, so the updated value can be echoed back to the user as well
    const pendingUpdate = new OfficialUpdate({
      userId: userID,
      updates: req.body,
    });

    await pendingUpdate.save();

    new Response(200, "Update submitted for approval!").success(res);
  } catch (error) {
    new Response(error.code || 500, error.message).error(res);
  }
};
