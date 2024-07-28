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
    const userID = res.locals.user;

    // @todo! Validate the req.body object first; Also this method returns the updated document, so the updated value can be echoed back to the user as well
    if (Object.keys(req.body).length === 0) {
      throw new Error("No fields to update");
    }
    const pendingUpdate = new PanchayatUpdate({
      userId: userID,
      updates: req.body,
    });

    await pendingUpdate.save();

    new Response(200, "Update submitted for approval!").success(res);
  } catch (error) {
    new Response(error.code || 500, error.message).error(res);
  }
};