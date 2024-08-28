import Response from "../entities/Response.js";
import Panchayat from "../model/Panchayat.js";
import { validationResult } from "express-validator";
import  PanchayatUpdate  from "../model/PanchayatUpdates.js";

export const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const err = new Error(errors.array()[0].msg);
      err.status = 400;
      throw err;
    }
    
    const panchayat = new Panchayat(req.body);
    
    const files = ["profilePicture", "addressProof", "identityProof", "panchayatResolution"];

    files.forEach(file => {
      if (req.files[file]) {
        panchayat[file] = `${req.files[file][0].location}`;
      }
    });

    // @todo! If there is no profile picture passed, add a default profile picture

    if (
      await Panchayat.findOne({
        $or: [{ email: req.body.email }, { phone: req.body.phone }],
      })
    ) {
      const err = new Error("Email or phone already registered!");
      err.status = 400;
      throw err;
    }

    await panchayat.save();

    new Response(200, "Registered Panchayat successfully!").success(res);
  } catch (error) {
    new Response(error.code || 500, error.message).error(res);
  }
};

export const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const err = new Error(errors.array()[0].msg);
      err.status = 400;
      throw err;
    }
    const panchayat = await Panchayat.findOne({ email: req.body.email });
    if (!panchayat) {
      const err = new Error("Panchayat doesn't exist");
      err.code = 401;
      throw err;
    }

    const isMatch = await panchayat.comparePassword(req.body.password);
    if (!isMatch) {
      // Incorrect password
      const err = new Error("Invalid username or password");
      err.code = 401;
      throw err;
    }
    if (panchayat.status === "pending") {
      const err = new Error("Form is under review");
      err.code = 403;
      throw err;
    }
    if (panchayat.status === "rejected") {
      const err = new Error("Form is rejected");
      err.code = 403;
      throw err;
    }
    const token = await panchayat.generateAuthToken();
    res.cookie("jwttoken", token);
    new Response(200, "Login Success", { token }).success(res);
  } catch (error) {
    new Response(error.status || 500, error.message).error(res);
  }
};

export const update = async (req, res) => {
  try {
    const userId = res.locals.user;

    // @todo! Validate the req.body object first; Also this method returns the updated document, so the updated value can be echoed back to the user as well
    if (Object.keys(req.body).length === 0) {
      throw new Error("No fields to update");
    }

    const updates = {
      ...req.body
    }

    if (req.files["profilePicture"]) {
      updates.profilePicture = `${req.files["profilePicture"][0].location}`;
    }

    // if(!userId) {
    //   console.log(req.body);
    //   console.log(req.files);
    //   console.log(updates);

    //   throw new Error("Testing");
    // }

    const pendingUpdate = new PanchayatUpdate({
      userId,
      updates,
    });

    await pendingUpdate.save();

    new Response(200, "Update submitted for approval!").success(res);
  } catch (error) {
    new Response(error.code || 500, error.message).error(res);
  }
};

export const getAll = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const panchayats = await Panchayat.find({}, "-password -__v -createdAt -updatedAt -phone -email").skip((page - 1) * limit).limit(limit);

    new Response(200, "Fetched Panchayats successfully!", panchayats).success(res);
  } catch (error) {
    new Response(error.code || 500, error.message).error(res);
  }
};

export const getById = async (req, res) => {
  try {
    const { filter } = req.params;

    const panchayat = await Panchayat.findOne({ $or: [ { phone: filter }, { email: filter } ] }, "-password -__v -createdAt -updatedAt -phone -email");

    if (panchayat)
      new Response(200, "Found Panchayat successfully!", panchayat).success(res);
    else {
      const err = new Error("Panchayat not found!");
      err.status = 404;
      throw err;
    }
  } catch (error) {
    new Response(error.code || 500, error.message).error(res);
  }
};

export const getSelf = async (req, res) => {
  try {
    const panchayat = res.locals.user;
    new Response(200, "Profile fetched successfully", {
      message: panchayat,
      status: 1,
    }).success(res);
  } catch (error) {
    new Response(error.status || 500, error.message).error(res);
  }
};
