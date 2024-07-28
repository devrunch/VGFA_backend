import { check } from "express-validator";
import moment from "moment";
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
  .isDate({ format: 'DD-MM-YYYY' })
  .withMessage("Date of birth must be a valid date (DD-MM-YYYY)")
  .custom((value) => {
      const inputDate = moment(value, 'DD-MM-YYYY', true);
      if (!inputDate.isValid()) {
          throw new Error('Date of birth must be a valid date (DD-MM-YYYY)');
      }
      const today = moment().startOf('day');
      if (!inputDate.isBefore(today)) {
          throw new Error('Date of birth must be before today');
      }
      return true;
  }),
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

export const panchayatSignUpValidation = [
  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email is not valid"),
  check("phone")
    .notEmpty()
    .withMessage("Phone number is required")
    .matches(/^\+91[1-9]\d{9}$/)
    .withMessage(
      "Phone number must start with +91 and be followed by 10 digits"
    ),
  check("name").notEmpty().withMessage("Name is required"),
  check("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .isLength({ max: 128 })
    .withMessage("Password must be less than 128 characters long")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number")
    .matches(/[\W_]/)
    .withMessage("Password must contain at least one special character"),
  check("designation").notEmpty().withMessage("Designation is required"),
  check("panchayat_name").notEmpty().withMessage("Panchayat name is required"),
  check("address").notEmpty().withMessage("Address is required"),
];

export const officialSignUpValidation = [
  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email is not valid"),
  check("phone")
    .notEmpty()
    .withMessage("Phone number is required")
    .matches(/^\+91[1-9]\d{9}$/)
    .withMessage(
      "Phone number must start with +91 and be followed by 10 digits"
    ),
  check("name").notEmpty().withMessage("Name is required"),
  check("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .isLength({ max: 128 })
    .withMessage("Password must be less than 128 characters long")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number")
    .matches(/[\W_]/)
    .withMessage("Password must contain at least one special character"),
  check("designation").notEmpty().withMessage("Designation is required"),
  check("address_office").notEmpty().withMessage("Office address is required"),
  check("address_residence")
    .notEmpty()
    .withMessage("Residence address is required"),
  check("blocks")
    .notEmpty()
    .withMessage("Blocks is required")
    .isArray()
    .withMessage("Blocks must be array"),
];

export const userLoginValidation = [
  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email is not valid"),
  check("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .isLength({ max: 128 })
    .withMessage("Password must be less than 128 characters long")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number")
    .matches(/[\W_]/)
    .withMessage("Password must contain at least one special character"),
];