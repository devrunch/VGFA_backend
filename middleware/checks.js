import Farmer from "../model/Farmer.js";
import Response from "../entities/Response.js";

export const isFarmerExistCheck = async (req, res, next) => {
    try {
        const user = await Farmer.findOne({phone: req.body.phone})
        if (user) {
            let err = new Error("User Already Exists");
            err.status = 400;
            throw err;
        }
        next()
    } catch (err) {
        new Response(err.status || 500, err.message).error(res);
    }
}