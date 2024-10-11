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
            type: String,
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
        
        address: String,
        
        isAccountVerified:{
            type : Boolean,
            default:false,
        },
        approved: {
            type: Boolean,
            default: false,
        },
        imageUrl: {
            type: String,
        },
        LandOwnership: {
            type: String,
        },
        CropHarvestRecords: {
            type: String,
        },
        Certification: {
            type: String,   
        },
        SoilHealthReport: {
            type: String,
        },
        FarmPhotos: {
            type: [String],
            default: [],
        },    
        tags: {
            type: [String],
            default: [],
        },
        bank_name:{
            type: String,
            required: true,
        },
        account_holder_name:{
            type:String,
            required: true,
        },
        account_number:{
            type: String,
            required: true,
        },
        ifsc_code:{
            type: String,
            required: true
        },
        aadhaar:{
            type: String,
            unique: true,
            required: true
        }
    },
    { timestamps: true }
);


export default model("Farmer", farmerSchema);
