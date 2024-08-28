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
    .isDate({ format: "DD-MM-YYYY" })
    .withMessage("Date of birth must be a valid date (DD-MM-YYYY)")
    .custom((value) => {
      const inputDate = moment(value, "DD-MM-YYYY", true);
      if (!inputDate.isValid()) {
        throw new Error("Date of birth must be a valid date (DD-MM-YYYY)");
      }
      const today = moment().startOf("day");
      if (!inputDate.isBefore(today)) {
        throw new Error("Date of birth must be before today");
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
  check("bank_name").notEmpty().withMessage("Bank name is required"),
  check("account_holder_name")
    .notEmpty()
    .withMessage("Account holder name is required"),
  check("account_number")
    .notEmpty()
    .withMessage("Bank account no. is required")
    .matches(/^\d{9,18}$/)
    .withMessage("Bank account no. must be between 9 and 18 digits"),
  check("re_enter_account_number")
    .notEmpty()
    .withMessage("Re-enter account no. is required")
    .matches(/^\d{9,18}$/)
    .withMessage("Bank account no. must be between 9 and 18 digits"),
  check("ifsc_code").notEmpty().withMessage("IFSC code is required").matches(/^[A-Z]{4}0[A-Z0-9]{6}$/).withMessage("Invalid IFSC_Code")
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
  check("address_office").notEmpty().withMessage("Office Address is required"),
  check("address_residence")
    .notEmpty()
    .withMessage("Residence Address is required"),
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
  check("office_name").notEmpty().withMessage("Office name is required"),
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
