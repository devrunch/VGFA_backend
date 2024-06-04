import Farmer from "../model/Farmer.js";

export const isFarmerExistCheck = async (req, res, next) => {
    try {
        const user = await Farmer.findOne({phone: req.body.phone})
        console.log(user)
        if (user) {
            let err = new Error("User Already Exists");
            err.status = 400;
            throw err;
        }
        next()
    } catch (err) {
        res.status(err.status||500).json({
            type: "error",
            message: err.message,
        });
    }
}