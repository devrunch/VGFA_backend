import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, "Please provide a valid email address"],
    },
    password: {
      type: String,
      required: true,
      minlength: [8, "Password must be at least 8 characters long"],
      maxlength: [128, "Password must be less than 128 characters long"],
    },
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
    designation: {
      type: String,
      required: true,
      trim: true,
      // @todo! Make this field an enum
    },
    address_office: {
      type: String,
      required: true,
    },
    address_residence: {
      type: String,
      default: "",
    },
    state:{
      type:String,
      required:true,
    },
    city:{
      type:String,
      required:true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    profilePicture: {
      type: String,
      trim: true
    },
    addressProof: {
      type: String,
      trim: true
    },
    identityProof: {
      type: String,
      trim: true
    },
    panchayatResolution: {
      type: String,
      trim: true
    },
    office_name: {
      type: String,
      trim: true,
      required: true
    }
  },
  {
    timestamps: true,
  }
);
UserSchema.pre("save", async function (next) {
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
UserSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};
UserSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  return token;
};
UserSchema.statics.findByToken = function (token, includePassword = false) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const selectString = includePassword ? "" : "-password";
    return this.findOne({ _id: decoded._id }).select(selectString);
  } catch (err) {
    throw new Error(`Error verifying token: ${err.message}`);
  }
};
export default mongoose.model("Official", UserSchema);
