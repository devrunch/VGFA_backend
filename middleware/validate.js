import { check } from "express-validator";

export const signUpValidation = [
  check("phone")
    .notEmpty()
    .withMessage("Phone number is required")
    .matches(/^\+91[1-9]\d{9}$/)
    .withMessage(
      "Phone number must start with +91 and be followed by 10 digits"
    ),
  check("first_name").notEmpty().withMessage("First name is required"),
  check("last_name").notEmpty().withMessage("Last name is required"),
  check("dob")
    .notEmpty()
    .withMessage("Date of birth is required")
    .isDate()
    .withMessage("Date of birth must be a valid date(YYYY-MM-DD)")
    .isBefore(new Date().toISOString())
    .withMessage("Date of birth must be before today"),
  check("panchayat_centre")
    .notEmpty()
    .withMessage("Panchayat centre is required"),
  check("gender")
    .notEmpty()
    .withMessage("Gender is required")
    .isIn(["Male", "Female", "Others", "PNTD"])
    .withMessage("Gender must be Male, Female, Others, or PNTD"),
  check("frn_number")
    .notEmpty()
    .withMessage("FRN number is required")
    .matches(/^\d{13}$/)
    .withMessage("FRN number must be a 13 digit number"),
  check("address")
    .notEmpty()
    .withMessage("Address is required")
    .isLength({ min: 10 })
    .withMessage("Address must be at least 10 characters long"),
];
export const loginValidation = [
  check("phone")
    .notEmpty()
    .withMessage("Phone number is required")
    .matches(/^\+91[1-9]\d{9}$/)
    .withMessage(
      "Phone number must start with +91 and be followed by 10 digits"
    ),
];

export const verifyOtpValidation = [
  check("phone")
    .notEmpty()
    .withMessage("Phone number is required")
    .matches(/^\+91[1-9]\d{9}$/)
    .withMessage(
      "Phone number must start with +91 and be followed by 10 digits"
    ),
  check("otp")
    .notEmpty()
    .withMessage("OTP is required")
    .matches(/^\d{6}$/)
    .withMessage("OTP must be a 6 digit number"),
];
