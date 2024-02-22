import { model, Schema } from "mongoose";
const otp = new Schema({
    number: {
        type: String,
        required: true,
    },
    approved: { 
        type: Boolean, 
        default: false  
    }
})
export default model("Otp", otp);
