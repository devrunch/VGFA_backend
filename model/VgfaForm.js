import mongoose from 'mongoose'; // Erase if already required

// Declare the Schema of the Mongo model
const formSchema = new mongoose.Schema({
    cropType:{
        type:String,
        required:true,
    },
    landArea:{
        type:Number,
        required:true,
    },
    expextedProduction:{
        type:Number,
        required:true,
    },
    issuePercent:{
        type:Number,
        required:true,
    },
    quantity:{
        type:Number,
        required:true,
    },
    vgfaUnitEq:{
        type:Number,
        required:true,
    },
    farmer:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Farmer',
        required:true,
    },
    state:{
        type:Number,
        default:0,
        enum:[0, 1, 2, 3, 4]
    },
    approved:{
        type:Boolean,
        ref:'Official',
    },

    remarks:{
        type:String,
    }
},{ timestamps: true });

//Export the model
export default mongoose.model('Forms', formSchema);