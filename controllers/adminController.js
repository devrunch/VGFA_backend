import Panchayat from "../model/Panchayat.js";
import PanchayatUpdate from "../model/PanchayatUpdates.js";
import Response from "../entities/Response.js";
import Official from "../model/Official.js";
import OfficialUpdate from "../model/OfficialUpdates.js";

export const approvePanchayatRegistration = async (req, res) => {
  try {
    const { email } = req.params;
    const panchayat = await Panchayat.findOne({ email });
    if (!panchayat) {
      const err = new Error("User not found");
      err.status = 404;
      throw err;
    }
    if (panchayat.status === "approved") {
      return new Response(400, "Registration is already approved").error(res);
    } else if (panchayat.status === "rejected") {
      return new Response(400, "Registration has been rejected").error(res);
    }
    panchayat.status = "approved";
    await panchayat.save();
    new Response(200, "User registration approved").success(res);
  } catch (error) {
    new Response(error.status || 500, error.message).error(res);
  }
};

export const approvePanchayatUpdate = async (req, res) => {
  try {
    const { email } = req.params;

    const panchayat = await Panchayat.findOne({ email });
    if (!panchayat) {
      const err = new Error("User not found");
      err.status = 404;
      throw err;
    }

    if (panchayat.status === "pending") {
      return res.status(400).json({ error: "Panchayat status is pending, updates cannot be approved." });
    } else if (panchayat.status === "rejected") {
      return res.status(400).json({ error: "Panchayat status is rejected, updates cannot be approved." });
    }

    const updateRequest = await PanchayatUpdate.findOne({ userId: panchayat._id })
      .sort({ createdAt: -1 });  
    if (!updateRequest) {
      const err = new Error("Update request not found");
      err.status = 404;
      throw err;
    }

    if (updateRequest.status === "approved") {
      return res.status(400).json({ error: "Update is already approved" });
    } else if (updateRequest.status === "rejected") {
      return res.status(400).json({ error: "Update has been rejected" });
    }

    const requiredFields = [
      "name",
      "phone",
      "email",
      "password",
      "designation",
      "panchayat_name",
      "address_office",
      "address_residence",
    ];

    requiredFields.forEach((field) => {
      if (!updateRequest.updates.has(field)) {
        updateRequest.updates.set(field, panchayat[field]);
      }
    });

    Object.assign(panchayat, Object.fromEntries(updateRequest.updates));
    updateRequest.status = "approved";

    await panchayat.save();
    await updateRequest.save();
    await PanchayatUpdate.findByIdAndDelete(updateRequest._id);

    res.status(200).json({ message: "User updates approved" });
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
};


export const rejectPanchayatRegistration = async (req, res) => {
  try {
    const { email } = req.params;
    const panchayat = await Panchayat.findOne({ email });
    if (!panchayat) {
      const err = new Error("Panchayat not found");
      err.status = 404;
      throw err;
    }
    if (panchayat.status === "rejected") {
      return new Response(400, "Registration has already been rejected").error(
        res
      );
    }
    panchayat.status = "rejected";
    await panchayat.save();
    new Response(200, "User registration rejected").success(res);
  } catch (error) {
    new Response(error.status || 500, error.message).error(res);
  }
};

export const rejectPanchayatUpdate = async (req, res) => {
  try {
    const { email } = req.params;

    const panchayat = await Panchayat.findOne({ email });
    if (!panchayat) {
      const err = new Error("User not found");
      err.status = 404;
      throw err;
    }

    const updateRequest = await PanchayatUpdate.findOne({ userId: panchayat._id })
      .sort({ createdAt: -1 });  
    if (!updateRequest) {
      const err = new Error("Update request not found");
      err.status = 404;
      throw err;
    }

    if (updateRequest.status === "approved") {
      return res.status(400).json({ error: "Update is already approved" });
    } else if (updateRequest.status === "rejected") {
      return res.status(400).json({ error: "Update has already been rejected" });
    }

    updateRequest.status = "rejected";
    await updateRequest.save();

    res.status(200).json({ message: "User updates rejected" });
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
};


export const approveOfficialRegistration = async (req, res) => {
  try {
    const { email } = req.params;
    const official = await Official.findOne({ email });
    if (!official) {
      const err = new Error("User not found");
      err.status = 404;
      throw err;
    }
    if (official.status === "approved") {
      return new Response(400, "Registration is already approved").error(res);
    } else if (official.status === "rejected") {
      return new Response(400, "Registration has been rejected").error(res);
    }
    official.status = "approved";
    await official.save();
    new Response(200, "User Registration approved").success(res);
  } catch (error) {
    new Response(error.status || 500, error.message).error(res);
  }
};

export const approveOfficialUpdate = async (req, res) => {
  try {
    const { email } = req.params;

    const official = await Official.findOne({ email });
    if (!official) {
      const err = new Error("User not found");
      err.status = 404;
      throw err;
    }

    if (official.status === "pending") {
      return res.status(400).json({ error: "Official status is pending, updates cannot be approved." });
    } else if (official.status === "rejected") {
      return res.status(400).json({ error: "Official status is rejected, updates cannot be approved." });
    }

    const updateRequest = await OfficialUpdate.findOne({ userId: official._id })
      .sort({ createdAt: -1 });  
    if (!updateRequest) {
      const err = new Error("Update request not found");
      err.status = 404;
      throw err;
    }

    if (updateRequest.status === "approved") {
      return res.status(400).json({ error: "Update is already approved" });
    } else if (updateRequest.status === "rejected") {
      return res.status(400).json({ error: "Update has been rejected" });
    }

    const requiredFields = [
      "name",
      "phone",
      "email",
      "password",
      "designation",
      "address_office",
      "address_residence",
    ];

    requiredFields.forEach((field) => {
      if (!updateRequest.updates.has(field)) {
        updateRequest.updates.set(field, official[field]);
      }
    });

    Object.assign(official, Object.fromEntries(updateRequest.updates));
    updateRequest.status = "approved";

    await official.save();
    await updateRequest.save();
    await OfficialUpdate.findByIdAndDelete(updateRequest._id);

    res.status(200).json({ message: "User updates approved" });
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
};

export const rejectOfficialRegistration = async (req, res) => {
  try {
    const { email } = req.params;
    const official = await Official.findOne({ email });
    if (!official) {
      const err = new Error("User not found");
      err.status = 404;
      throw err;
    }
    if (official.status === "rejected") {
      return new Response(400, "Registration has already been rejected").error(
        res
      );
    }
    official.status = "rejected";
    await official.save();
    new Response(200, "User registration rejected").success(res);
  } catch (error) {
    new Response(error.status || 500, error.message).error(res);
  }
};

export const rejectOfficialUpdate = async (req, res) => {
  try {
    const { email } = req.params;

    const official = await Official.findOne({ email });
    if (!official) {
      const err = new Error("User not found");
      err.status = 404;
      throw err;
    }

    const updateRequest = await OfficialUpdate.findOne({ userId: official._id })
      .sort({ createdAt: -1 });  
    if (!updateRequest) {
      const err = new Error("Update request not found");
      err.status = 404;
      throw err;
    }

    if (updateRequest.status === "approved") {
      return res.status(400).json({ error: "Update is already approved" });
    } else if (updateRequest.status === "rejected") {
      return res.status(400).json({ error: "Update has already been rejected" });
    }

    updateRequest.status = "rejected";
    await updateRequest.save();

    res.status(200).json({ message: "User updates rejected" });
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
};

