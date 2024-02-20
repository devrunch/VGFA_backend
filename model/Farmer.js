import { model, Schema } from "mongoose";
const addressSchema = new Schema({
    city: {
        type: String,
        required: true,
    },
    district: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    popstal_code: {
        type: String,
        required: true,
    }
})

const farmerSchema = new Schema(
    {
        first_name: {
            type: String,
            required: true,
            trim: true,

        },
        last_name: {
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
        dob: {
            type: Date,
            required: true
        },
        panchayat_centre: {
            type: String,
            required: true
        },
        gender: {
            type: String,
            enum: ["Male", "Female", "Others", "PNTD"]
        },
        frn_number: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        role: {
            type: String,
            enum: ["ADMIN", "USER"],
            default: "USER",
        },
        
        address: addressSchema,
        isAccountVerified:{
            type : Boolean,
            default:false,
        },
        phoneOtp: String


    },
    { timestamps: true }
);


export default model("Farmer", farmerSchema);