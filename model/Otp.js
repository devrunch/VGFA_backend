import { model, Schema } from "mongoose";
const otp = new Schema({
    number: {
        type: String,
        required: true,
    },
    otp : {
        type: String,
        // required: true
    }
})
export default model("Otp", otp);
