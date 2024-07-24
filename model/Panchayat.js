import { model, Schema } from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const PanchayatSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: [8, "Password must be at least 8 characters long"],
      maxlength: [128, "Password must be less than 128 characters long"],
    },
    designation: {
      type: String,
      required: true,
      trim: true,
      // @todo! Make this field an enum
      // enum: ["Panchayat Pradhan", "Panchayat Secretary", "Gram Panchayat Members"]
    },
    panchayat_name: {
      type: String,
      required: true,
      trim: true,
    },
    panchayat_samiti: {
      type: String,
      trim: true,
      default: "",
    },
    address_office: {
      type: String,
    },
    address: {
      type: String,
      required: true,
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "approved"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

PanchayatSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password") || user.isNew) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(user.password, salt);
      user.password = hash;
      next();
    } catch (err) {
      return next(err);
    }
  } else {
    return next();
  }
});
PanchayatSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};
PanchayatSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  return token;
};
PanchayatSchema.statics.findByToken = function (
  token,
  includePassword = false
) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const selectString = includePassword ? "" : "-password";
    return this.findOne({ _id: decoded._id }).select(selectString);
  } catch (err) {
    throw new Error(`Error verifying token: ${err.message}`);
  }
};

export default model("Panchayat", PanchayatSchema);
